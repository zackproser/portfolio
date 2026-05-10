/**
 * Resend client used by the portfolio's signup API routes. Replaces the
 * EmailOctopus integration during the 2026-05 migration.
 *
 * Auth: `Authorization: Bearer <RESEND_API_KEY>` header.
 * Required env:
 *   - RESEND_API_KEY     (Vercel project settings; matches /hermes/resend_api_key in SSM)
 *   - RESEND_AUDIENCE_ID (defaults to the "General" audience id below)
 *
 * Resend's segmentation model:
 *   - Audiences are lists; contacts belong to one or more audiences.
 *   - Topics are the tag analog — account-scoped, each contact can be
 *     opt_in or opt_out per topic. We use Topics directly to preserve the
 *     Kit/EO tag semantics. Topic names match our tag names verbatim
 *     (e.g. `interest:voice-ai`, `source:blog`, `waitlist:rag-pipeline`).
 *
 * Signup flow per request:
 *   1) POST /audiences/{id}/contacts        → idempotent (existing email
 *      returns 201 with the same contact id and no error).
 *   2) For each tag: ensure a Topic exists with that name (GET /topics
 *      cache + POST /topics on miss).
 *   3) PATCH /contacts/{id}/topics          → opt the contact in to each
 *      resolved topic. Partial failures are surfaced as `topicWarning`,
 *      they don't fail the signup.
 *   4) POST /events/send                    → fires `newsletter.signup`,
 *      which is the trigger the welcome-v1 automation listens on.
 *
 * Bulk imports (e.g., the EO→Resend migration) skip step 4 so existing
 * subscribers do NOT enter the welcome flow. Topic backfill for existing
 * subscribers is a separate one-off script.
 */

const RESEND_API_BASE = 'https://api.resend.com'

const DEFAULT_AUDIENCE_ID = '5f50ed9c-cf50-4a17-8e1e-1b782a4414d1'

export const SIGNUP_EVENT_NAME = 'newsletter.signup'

function audienceId(): string {
  return process.env.RESEND_AUDIENCE_ID || DEFAULT_AUDIENCE_ID
}

/**
 * Returns true when `email` is at a Google-operated public mailbox (gmail.com
 * or googlemail.com). Used to gate sending while sender-domain reputation at
 * Gmail warms up — Google Workspace domains are NOT detected here (impossible
 * from the address alone; would need MX lookup).
 */
export function isGoogleMailbox(email: string): boolean {
  return /@(gmail|googlemail)\.com$/i.test(email.trim())
}

function gmailHoldEnabled(): boolean {
  return process.env.RESEND_GMAIL_HOLD === 'true'
}

type ResendInit = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

type ResendResp<T> = { status: number; body: T | undefined }

async function resendFetch<T>(path: string, init: ResendInit = {}): Promise<ResendResp<T>> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    throw new Error('RESEND_API_KEY env var is not set')
  }
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    Accept: 'application/json',
  }
  if (init.body !== undefined) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${RESEND_API_BASE}${path}`, {
    method: init.method ?? 'GET',
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  })
  const text = await res.text()
  const body = (text.length === 0 ? undefined : JSON.parse(text)) as T | undefined
  return { status: res.status, body }
}

export type ResendSubscribeArgs = {
  email: string
  firstName?: string
  // Each tag becomes a Resend Topic (created on the fly if missing) and the
  // contact is opted in. Also forwarded as `payload.tags` on the fired event
  // so automation `condition` steps can branch on them without round-trips.
  tags?: string[]
}

export type ResendSubscribeResult =
  | {
      ok: true
      contactId: string
      // null when held for reputation warmup (Gmail subscriber while
      // RESEND_GMAIL_HOLD=true). The contact is still on the audience; only
      // the welcome-trigger event is suppressed.
      eventFired: string | null
      tagsForwarded: string[]
      heldForReputation: boolean
      // Subset of `tagsForwarded` that successfully became Topic opt-ins.
      topicsApplied: string[]
      // Present when one or more topics failed to resolve or apply. The
      // contact and event are unaffected — only topic state may be partial.
      topicWarning?: string
      // Present when the contact was created but /events/send failed.
      // Surfaced so callers can log the partial failure — the subscriber
      // is on the audience either way.
      eventSendWarning?: string
    }
  | { ok: false; error: string }

type ContactCreateResp = { object?: string; id: string; email?: string }
type EventSendResp = { object?: string; event: string }
type TopicListItem = { id: string; name: string }
type TopicListResp = {
  object?: string
  data: TopicListItem[]
  has_more?: boolean
}
type TopicCreateResp = { object?: string; id: string }

// === Topic resolution + caching ===
//
// Topic names map 1:1 to our tag names. Resolution is GET /topics (paginated)
// with a 5-minute in-memory cache. On cache miss for a tag, POST /topics
// creates the topic with `default_subscription: opt_in` (non-subscribers do
// NOT auto-receive — only contacts explicitly opted in).

const TOPIC_CACHE_TTL_MS = 5 * 60 * 1000
type TopicCache = { ids: Map<string, string>; expiresAt: number }
let topicCache: TopicCache | null = null

async function loadAllTopics(): Promise<Map<string, string>> {
  const out = new Map<string, string>()
  let after: string | undefined
  // Safety bound: 35 EO tags today, future bounded by realistic segment
  // counts. Stop at 50 pages to avoid runaway pagination on a bad API state.
  for (let page = 0; page < 50; page++) {
    const params = new URLSearchParams({ limit: '100' })
    if (after) params.set('after', after)
    const res = await resendFetch<TopicListResp>(`/topics?${params.toString()}`)
    if (res.status >= 300 || !res.body) {
      throw new Error(`Topics list failed: HTTP ${res.status}`)
    }
    for (const t of res.body.data) out.set(t.name, t.id)
    if (!res.body.has_more || res.body.data.length === 0) break
    after = res.body.data[res.body.data.length - 1].id
  }
  return out
}

async function getTopicIdMap(): Promise<Map<string, string>> {
  if (topicCache && Date.now() < topicCache.expiresAt) return topicCache.ids
  const ids = await loadAllTopics()
  topicCache = { ids, expiresAt: Date.now() + TOPIC_CACHE_TTL_MS }
  return ids
}

async function ensureTopic(name: string): Promise<string> {
  const map = await getTopicIdMap()
  const existing = map.get(name)
  if (existing) return existing
  const res = await resendFetch<TopicCreateResp>(`/topics`, {
    method: 'POST',
    body: { name, default_subscription: 'opt_in' },
  })
  if (res.status >= 300 || !res.body?.id) {
    throw new Error(`Topic create failed for "${name}": HTTP ${res.status}`)
  }
  map.set(name, res.body.id)
  return res.body.id
}

async function applyTopicsToContact(
  contactId: string,
  topicIds: string[],
): Promise<void> {
  if (topicIds.length === 0) return
  const body = topicIds.map((id) => ({ id, subscription: 'opt_in' as const }))
  const res = await resendFetch<{ id: string }>(
    `/contacts/${encodeURIComponent(contactId)}/topics`,
    { method: 'PATCH', body },
  )
  if (res.status >= 300) {
    throw new Error(`Topic apply failed: HTTP ${res.status}`)
  }
}

// Test-only: clear the in-memory topic cache between tests.
export function _resetTopicCacheForTests(): void {
  topicCache = null
}

export async function subscribeToResend(
  args: ResendSubscribeArgs,
): Promise<ResendSubscribeResult> {
  if (!args.email) return { ok: false, error: 'Missing email' }

  try {
    const contactBody: Record<string, unknown> = {
      email: args.email,
      unsubscribed: false,
    }
    if (args.firstName) contactBody.first_name = args.firstName

    const contactRes = await resendFetch<ContactCreateResp>(
      `/audiences/${audienceId()}/contacts`,
      { method: 'POST', body: contactBody },
    )
    if (contactRes.status >= 300) {
      return {
        ok: false,
        error: `Resend contact create failed: HTTP ${contactRes.status}`,
      }
    }
    const contactId = contactRes.body?.id
    if (!contactId) {
      return { ok: false, error: 'Resend contact create returned no id' }
    }

    const tags = args.tags ?? []

    // === Topic assignment ===
    // Resolve each tag to a Topic id (creating on the fly) and PATCH the
    // contact with opt_in subscriptions. Partial failures are surfaced as a
    // warning — the contact is still on the audience.
    const topicsApplied: string[] = []
    const resolvedTopicIds: string[] = []
    let topicWarning: string | undefined
    if (tags.length > 0) {
      const failedTags: string[] = []
      for (const tagName of tags) {
        try {
          resolvedTopicIds.push(await ensureTopic(tagName))
          topicsApplied.push(tagName)
        } catch (err) {
          failedTags.push(tagName)
          console.warn(
            `[resend-subscribe] ensureTopic("${tagName}") failed: ${(err as Error).message}`,
          )
        }
      }
      if (resolvedTopicIds.length > 0) {
        try {
          await applyTopicsToContact(contactId, resolvedTopicIds)
        } catch (err) {
          topicWarning = `Topic apply failed: ${(err as Error).message}`
          topicsApplied.length = 0
        }
      }
      if (!topicWarning && failedTags.length > 0) {
        topicWarning = `Failed to resolve ${failedTags.length}/${tags.length} topics: ${failedTags.join(', ')}`
      }
    }

    // Reputation hold: while RESEND_GMAIL_HOLD=true, contacts at gmail.com
    // and googlemail.com are added to the audience and tagged via Topics
    // (captured) but the welcome-trigger event is NOT fired. Lets us build
    // sender-domain reputation against non-Gmail providers first.
    if (isGoogleMailbox(args.email) && gmailHoldEnabled()) {
      return {
        ok: true,
        contactId,
        eventFired: null,
        tagsForwarded: tags,
        heldForReputation: true,
        topicsApplied,
        ...(topicWarning ? { topicWarning } : {}),
      }
    }

    const eventRes = await resendFetch<EventSendResp>(`/events/send`, {
      method: 'POST',
      body: {
        event: SIGNUP_EVENT_NAME,
        email: args.email,
        payload: {
          source: tags[0] ?? 'newsletter',
          tags,
        },
      },
    })
    if (eventRes.status >= 300) {
      // Contact is on the list; trigger event failed. Surface this as a warning
      // so the caller logs it — the subscriber is captured but won't get welcome v1.
      return {
        ok: true,
        contactId,
        eventFired: SIGNUP_EVENT_NAME,
        tagsForwarded: tags,
        heldForReputation: false,
        topicsApplied,
        ...(topicWarning ? { topicWarning } : {}),
        eventSendWarning: `Resend event send failed: HTTP ${eventRes.status}`,
      }
    }

    return {
      ok: true,
      contactId,
      eventFired: SIGNUP_EVENT_NAME,
      tagsForwarded: tags,
      heldForReputation: false,
      topicsApplied,
      ...(topicWarning ? { topicWarning } : {}),
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

/**
 * Returns true when `email` is on the Resend audience and not unsubscribed.
 * Used by gated-content flows that short-circuit when the visitor is already
 * on the list.
 *
 * Single API call: `GET /audiences/{id}/contacts/{email}` returns the
 * matching contact (200) or 404. Errors are logged but swallowed — returning
 * `false` keeps the gate's UX safe (a false negative just shows the signup
 * form, which is harmless because re-subscribing is idempotent).
 */
export async function isResendSubscriber(
  email: string | null | undefined,
): Promise<boolean> {
  if (!email) return false
  const target = email.trim().toLowerCase()
  try {
    type ContactResp = { id: string; email: string; unsubscribed: boolean }
    const res = await resendFetch<ContactResp>(
      `/audiences/${audienceId()}/contacts/${encodeURIComponent(target)}`,
    )
    if (res.status === 404) return false
    if (res.status >= 300) return false
    return res.body?.unsubscribed === false
  } catch (err) {
    console.error(
      `[resend-subscribe] isResendSubscriber lookup failed for ${target}:`,
      (err as Error).message,
    )
    return false
  }
}
