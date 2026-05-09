/**
 * Kit (formerly ConvertKit) v4 client used by the portfolio's signup API
 * routes. Replaces the EmailOctopus integration during the 2026-05 migration.
 *
 * Auth: X-Kit-Api-Key header (https://developers.kit.com/api-reference/authentication).
 * Required env: KIT_API_KEY (set in Vercel project settings).
 *
 * Tag-name → tag-id lookups are cached in module memory for 5 minutes to keep
 * latency low across requests on the same serverless instance.
 */

const KIT_API_BASE = 'https://api.kit.com/v4'
const TAG_CACHE_TTL_MS = 5 * 60 * 1000

type TagCache = { ids: Map<string, number>; expiresAt: number }
let tagCache: TagCache | null = null

type KitInit = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
}

async function kitFetch<T>(path: string, init: KitInit = {}): Promise<T> {
  const apiKey = process.env.KIT_API_KEY
  if (!apiKey) {
    throw new Error('KIT_API_KEY env var is not set')
  }
  const headers: Record<string, string> = {
    'X-Kit-Api-Key': apiKey,
    Accept: 'application/json',
  }
  if (init.body !== undefined) headers['Content-Type'] = 'application/json'
  const res = await fetch(`${KIT_API_BASE}${path}`, {
    method: init.method ?? 'GET',
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(
      `Kit API ${res.status} ${init.method ?? 'GET'} ${path}: ${text}`
    )
  }
  const text = await res.text()
  return text.length === 0 ? (undefined as T) : (JSON.parse(text) as T)
}

type TagsPage = {
  tags: Array<{ id: number; name: string }>
  pagination: { has_next_page: boolean; end_cursor: string | null }
}

async function loadAllTags(): Promise<Map<string, number>> {
  const out = new Map<string, number>()
  let after: string | undefined
  while (true) {
    const params = new URLSearchParams({ per_page: '1000' })
    if (after) params.set('after', after)
    const data = await kitFetch<TagsPage>(`/tags?${params.toString()}`)
    for (const t of data.tags) out.set(t.name, t.id)
    if (!data.pagination?.has_next_page || !data.pagination.end_cursor) break
    after = data.pagination.end_cursor
  }
  return out
}

async function getTagIds(): Promise<Map<string, number>> {
  if (tagCache && Date.now() < tagCache.expiresAt) {
    return tagCache.ids
  }
  const ids = await loadAllTags()
  tagCache = { ids, expiresAt: Date.now() + TAG_CACHE_TTL_MS }
  return ids
}

async function ensureTag(name: string): Promise<number> {
  const map = await getTagIds()
  const existing = map.get(name)
  if (existing !== undefined) return existing
  // Create returns 201 if new, 200 if name already exists — both shapes carry
  // the canonical { tag: { id, name } } payload.
  type CreateResp = { tag: { id: number; name: string } }
  const created = await kitFetch<CreateResp>('/tags', {
    method: 'POST',
    body: { name },
  })
  map.set(name, created.tag.id)
  return created.tag.id
}

export type KitSubscribeArgs = {
  email: string
  firstName?: string
  tags?: string[]
}

export type KitSubscribeResult =
  | {
      ok: true
      subscriberId: number
      appliedTags: string[]
      failedTags: Array<{ tag: string; reason: string }>
    }
  | { ok: false; error: string }

/**
 * Create or fetch a Kit subscriber and apply the given tags.
 *
 * Idempotent: if `email` is already a subscriber, Kit returns 200 with the
 * existing subscriber object. Tags that are already applied also return 200
 * (Kit's tag-application endpoint is idempotent per email × tag).
 *
 * Tag-application failures are surfaced in the result's `failedTags` field
 * rather than thrown — partial success is informative for the caller (the
 * subscriber is still on the list even if one tag failed to apply).
 */
export async function subscribeToKit(
  args: KitSubscribeArgs
): Promise<KitSubscribeResult> {
  if (!args.email) return { ok: false, error: 'Missing email' }

  try {
    type SubResp = {
      subscriber: { id: number; email_address: string; state: string }
    }
    const body: Record<string, unknown> = {
      email_address: args.email,
      state: 'active',
    }
    if (args.firstName) body.first_name = args.firstName
    const sub = await kitFetch<SubResp>('/subscribers', { method: 'POST', body })

    if (sub.subscriber.state !== 'active') {
      return {
        ok: false,
        error: `Subscriber exists but is in '${sub.subscriber.state}' state. Please resubscribe through the Kit form to reactivate.`,
      }
    }

    const appliedTags: string[] = []
    const failedTags: Array<{ tag: string; reason: string }> = []
    if (args.tags && args.tags.length > 0) {
      for (const tagName of args.tags) {
        try {
          const tagId = await ensureTag(tagName)
          await kitFetch(`/tags/${tagId}/subscribers/${sub.subscriber.id}`, {
            method: 'POST',
            body: {},
          })
          appliedTags.push(tagName)
        } catch (err) {
          failedTags.push({ tag: tagName, reason: (err as Error).message })
        }
      }
    }
    return {
      ok: true,
      subscriberId: sub.subscriber.id,
      appliedTags,
      failedTags,
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

/**
 * Returns true when `email` is an active Kit subscriber. Used by gated-content
 * flows that short-circuit when the visitor is already on the list.
 *
 * Single API call: Kit's v4 `GET /subscribers?email_address=…` filter returns
 * the matching subscriber (or empty). Errors are logged but swallowed —
 * returning `false` keeps the gate's UX safe (a false negative just shows the
 * signup form, which is harmless because re-subscribing is idempotent).
 */
export async function isKitSubscriber(
  email: string | null | undefined
): Promise<boolean> {
  if (!email) return false
  const target = email.trim().toLowerCase()
  try {
    type ListResp = {
      subscribers: Array<{ id: number; email_address: string; state: string }>
    }
    const params = new URLSearchParams({ email_address: target })
    const resp = await kitFetch<ListResp>(`/subscribers?${params.toString()}`)
    return resp.subscribers.some(
      (s) =>
        s.email_address.toLowerCase() === target && s.state === 'active'
    )
  } catch (err) {
    // Log so production failures aren't invisible. Still return false to keep
    // the gating UX safe — a false negative is harmless (signup form shows;
    // Kit dedupes on email so re-subscribing is idempotent).
    console.error(
      `[kit-subscribe] isKitSubscriber lookup failed for ${target}:`,
      (err as Error).message
    )
    return false
  }
}

// Test-only: clear the in-memory tag cache between tests.
export function _resetTagCacheForTests(): void {
  tagCache = null
}
