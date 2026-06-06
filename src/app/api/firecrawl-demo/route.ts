import { NextRequest, NextResponse } from 'next/server'
import {
  checkRateLimit,
  clientIp,
  liveModeAvailable,
  runLiveCrawl,
  runLiveMonitor,
  validatePublicUrl,
} from '@/lib/firecrawlDemo'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Live backing for the Firecrawl demos. Visitors paste their own URL and the
// server runs the real Firecrawl API against it. The key stays server-side,
// the URL is validated against internal hosts, and calls are rate limited.
export async function POST(req: NextRequest) {
  if (!liveModeAvailable()) {
    return NextResponse.json(
      { error: 'Live mode is not configured on this deployment.' },
      { status: 503 },
    )
  }

  let payload: { mode?: string; url?: string; schema?: Record<string, unknown> }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const mode = payload.mode
  if (mode !== 'crawl' && mode !== 'monitor') {
    return NextResponse.json({ error: 'Unknown mode.' }, { status: 400 })
  }

  const check = validatePublicUrl(payload.url)
  if (!check.ok) {
    return NextResponse.json({ error: check.error }, { status: 400 })
  }

  const rate = checkRateLimit(clientIp(req.headers))
  if (!rate.ok) {
    return NextResponse.json(
      { error: `Rate limit reached. Try again in about ${Math.ceil(rate.retryAfterSec / 60)} minutes.` },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSec) } },
    )
  }

  try {
    if (mode === 'crawl') {
      const data = await runLiveCrawl(check.url)
      return NextResponse.json({ mode, data })
    }
    const schema =
      payload.schema && typeof payload.schema === 'object' ? payload.schema : undefined
    const data = await runLiveMonitor(check.url, schema)
    return NextResponse.json({ mode, data })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'The live request failed.'
    // Surface Firecrawl's own message (e.g. blocked, timeout) without leaking internals.
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
