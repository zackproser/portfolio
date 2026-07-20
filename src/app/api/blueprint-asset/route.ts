import { NextRequest, NextResponse } from 'next/server'
import { ServerClient } from 'postmark'
import { subscribeToResend } from '@/lib/resend-subscribe'
import { ASSET_REGISTRY } from '@/lib/blueprint/assets'

// DETACHABLE PLATE delivery: exchange an email for a gated artifact.
// Subscribes through the same Resend path as every other capture
// (interest:blueprint-series + a per-asset tag) and returns the file
// URL for immediate display; a copy also goes out by email when
// Postmark is configured. Assets resolve server-side from a registry
// so the endpoint can't be pointed at arbitrary URLs.

export const maxDuration = 30

const dedup = new Map<string, number>()

// Per-IP rate limit: this endpoint sends outbound email, so it must
// not be drivable into email-bombing arbitrary addresses. Bounded,
// self-evicting; a durable/WAF limiter is the platform-level backstop.
const hits = new Map<string, { count: number; windowStart: number }>()
const IP_LIMIT = 10
const WINDOW_MS = 60 * 60 * 1000
let globalCount = 0
let globalWindowStart = 0
const GLOBAL_LIMIT = 400

function rateLimited(ip: string): boolean {
  const now = Date.now()
  if (now - globalWindowStart > WINDOW_MS) {
    globalWindowStart = now
    globalCount = 0
  }
  globalCount++
  if (globalCount > GLOBAL_LIMIT) return true
  if (hits.size > 5000) {
    for (const [k, e] of hits) if (now - e.windowStart > WINDOW_MS) hits.delete(k)
    while (hits.size > 5000) {
      const oldest = hits.keys().next().value
      if (oldest === undefined) break
      hits.delete(oldest)
    }
  }
  const entry = hits.get(ip)
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now })
    return false
  }
  entry.count++
  return entry.count > IP_LIMIT
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get('x-real-ip')?.trim() ||
    (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Slow down a little — try again shortly.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 })
  }
  const { email, assetId, hp, referrer } = body as Record<string, unknown>

  // Honeypot: fake success, no side effects
  if (typeof hp === 'string' && hp.trim().length > 0) {
    return NextResponse.json({ ok: true })
  }
  if (typeof email !== 'string' || !email.includes('@') || email.length > 320) {
    return NextResponse.json({ error: 'A valid email is required' }, { status: 400 })
  }
  const asset =
    typeof assetId === 'string' && Object.hasOwn(ASSET_REGISTRY, assetId)
      ? ASSET_REGISTRY[assetId]
      : undefined
  if (!asset) {
    return NextResponse.json({ error: 'Unknown asset' }, { status: 404 })
  }

  // 30s dedup per email+asset for genuine double-submits of a
  // SUCCESSFUL request. Recorded only after the subscribe succeeds so
  // a transient failure stays retryable (mirrors /api/form).
  const key = `${email.trim().toLowerCase()}:${assetId}`
  const last = dedup.get(key)
  if (last && Date.now() - last < 30_000) {
    return NextResponse.json({ ok: true, fileUrl: asset.fileUrl })
  }

  const result = await subscribeToResend({
    email: email.trim(),
    tags: ['interest:blueprint-series', 'source:blog', `asset:${assetId}`],
  })
  if (!result.ok) {
    console.error(`[blueprint-asset] subscribe failed for ${assetId}: ${result.error}`)
    return NextResponse.json({ error: 'Subscription failed — try again shortly' }, { status: 502 })
  }
  dedup.set(key, Date.now())
  if (dedup.size > 5000) {
    const now = Date.now()
    for (const [k, ts] of dedup) if (now - ts > 30_000) dedup.delete(k)
    while (dedup.size > 5000) {
      const oldest = dedup.keys().next().value
      if (oldest === undefined) break
      dedup.delete(oldest)
    }
  }
  console.log(
    `[blueprint-asset] ${assetId} → ${email.trim().slice(0, 3)}… (referrer: ${typeof referrer === 'string' ? referrer.slice(0, 80) : 'n/a'})`,
  )

  // Best-effort email copy of the file link. The on-screen link is the
  // primary delivery; a Postmark failure never fails the exchange.
  const apiKey = process.env.POSTMARK_API_KEY
  if (apiKey) {
    try {
      await new ServerClient(apiKey).sendEmail({
        From: 'notifications@zackproser.com',
        To: email.trim(),
        Subject: `${asset.name} — ${asset.drawingCode} detachable plate`,
        TextBody: [
          `Here is your copy of the ${asset.name} (${asset.drawingCode}):`,
          '',
          asset.fileUrl,
          '',
          `You'll also receive future Blueprint drawings when they are issued. Unsubscribe any time from the link in those emails.`,
          '',
          '— Zack Proser · zackproser.com',
        ].join('\n'),
        MessageStream: 'outbound',
      })
    } catch (e) {
      console.error(`[blueprint-asset] Postmark send failed for ${assetId}:`, e)
    }
  }

  return NextResponse.json({ ok: true, fileUrl: asset.fileUrl })
}
