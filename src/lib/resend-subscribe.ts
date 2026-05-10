/**
 * Resend client used by the portfolio's signup API routes. Replaces the
 * EmailOctopus integration during the 2026-05 migration.
 *
 * Auth: `Authorization: Bearer <RESEND_API_KEY>` header.
 * Required env:
 *   - RESEND_API_KEY     (Vercel project settings; matches /hermes/resend_api_key in SSM)
 *   - RESEND_AUDIENCE_ID (defaults to the "General" audience id below)
 *
 * Resend's data model differs from Kit/EmailOctopus:
 *   - There is one or more "audiences" (lists); contacts belong to audiences.
 *   - There is no first-class "tag" concept on contacts. We preserve
 *     tag-style segmentation by firing a typed event after contact creation,
 *     passing tag names through the event `data` payload. Automations in the
 *     Resend dashboard subscribe to the event name and may branch on
 *     `data.tags` / `data.source`.
 *
 * Signup flow per request:
 *   1) POST /audiences/{id}/contacts  → idempotent (existing email returns 201
 *      with the same contact id and no error).
 *   2) POST /events/send              → fires `newsletter.signup`, which is
 *      the trigger the welcome-v1 automation listens on.
 *
 * Bulk imports (e.g., the EO→Resend migration) skip step 2 so existing
 * subscribers do NOT enter the welcome flow.
 */

const RESEND_API_BASE = 'https://api.resend.com'

const DEFAULT_AUDIENCE_ID = '5f50ed9c-cf50-4a17-8e1e-1b782a4414d1'

export const SIGNUP_EVENT_NAME = 'newsletter.signup'

function audienceId(): string {
  return process.env.RESEND_AUDIENCE_ID || DEFAULT_AUDIENCE_ID
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
  // Preserved as `data.tags` on the fired event (Resend has no native tags).
  // The first tag is also surfaced as `data.source` for automation branching.
  tags?: string[]
}

export type ResendSubscribeResult =
  | {
      ok: true
      contactId: string
      eventFired: string
      tagsForwarded: string[]
    }
  | { ok: false; error: string }

type ContactCreateResp = { object?: string; id: string; email?: string }
type EventSendResp = { object?: string; event: string }

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
      // Contact is on the list; trigger event failed. Surface this so the
      // caller logs it — the subscriber is captured but won't get welcome v1.
      return {
        ok: false,
        error: `Resend event send failed: HTTP ${eventRes.status}`,
      }
    }

    return {
      ok: true,
      contactId,
      eventFired: SIGNUP_EVENT_NAME,
      tagsForwarded: tags,
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
