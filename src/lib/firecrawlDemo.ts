/**
 * Server-only helpers for the live Firecrawl demo endpoints.
 *
 * Two demos can call the real Firecrawl API on a visitor-supplied URL:
 *  - the site crawler  (/map + a single /scrape of the seed page)
 *  - the change tracker (/scrape with the changeTracking format)
 *
 * Everything here runs on the server so the API key never reaches the client.
 * The key lives in FIRECRAWL_API_KEY (.env, gitignored). Requests are rate
 * limited per IP and the URL is validated to block SSRF against internal hosts.
 */

const FIRECRAWL_BASE = 'https://api.firecrawl.dev'

// Keep live calls cheap: map is capped low, and each demo run is one map + one
// scrape (crawl) or a single scrape (monitor) — roughly 1–3 credits per run.
const MAP_LIMIT = 25
const REQUEST_TIMEOUT_MS = 25_000

// ─── Rate limiting (best-effort, per serverless instance) ───────────────────
// A fixed window per IP plus a global ceiling so a single popular hour can't
// drain the account. Not distributed — acceptable for a demo, intentionally
// conservative so the worst case is "try again later", never a surprise bill.
const PER_IP_LIMIT = 5
const PER_IP_WINDOW_MS = 15 * 60 * 1000
const GLOBAL_LIMIT = 120
const GLOBAL_WINDOW_MS = 60 * 60 * 1000

type Window = { count: number; resetAt: number }
const ipHits = new Map<string, Window>()
const globalHits: Window = { count: 0, resetAt: 0 }

function tick(win: Window, limit: number, windowMs: number, now: number): boolean {
  if (now > win.resetAt) {
    win.count = 0
    win.resetAt = now + windowMs
  }
  if (win.count >= limit) return false
  win.count += 1
  return true
}

export type RateResult = { ok: true } | { ok: false; retryAfterSec: number }

export function checkRateLimit(ip: string, now = Date.now()): RateResult {
  if (!tick(globalHits, GLOBAL_LIMIT, GLOBAL_WINDOW_MS, now)) {
    return { ok: false, retryAfterSec: Math.ceil((globalHits.resetAt - now) / 1000) }
  }
  let win = ipHits.get(ip)
  if (!win) {
    win = { count: 0, resetAt: now + PER_IP_WINDOW_MS }
    ipHits.set(ip, win)
  }
  if (!tick(win, PER_IP_LIMIT, PER_IP_WINDOW_MS, now)) {
    return { ok: false, retryAfterSec: Math.ceil((win.resetAt - now) / 1000) }
  }
  // Opportunistic cleanup so the Map doesn't grow unbounded.
  if (ipHits.size > 5000) {
    for (const [k, v] of ipHits) if (now > v.resetAt) ipHits.delete(k)
  }
  return { ok: true }
}

// ─── URL validation (SSRF guard) ────────────────────────────────────────────
const PRIVATE_HOST = /^(localhost|0\.0\.0\.0|169\.254\.|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i
const BLOCKED_SUFFIX = /(\.local|\.internal|\.localhost)$/i

export type UrlCheck = { ok: true; url: string } | { ok: false; error: string }

export function validatePublicUrl(raw: unknown): UrlCheck {
  if (typeof raw !== 'string' || raw.trim().length === 0) {
    return { ok: false, error: 'Provide a URL.' }
  }
  let parsed: URL
  try {
    parsed = new URL(raw.trim())
  } catch {
    return { ok: false, error: 'That is not a valid URL. Include https://' }
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { ok: false, error: 'Only http and https URLs are supported.' }
  }
  const host = parsed.hostname.toLowerCase()
  if (PRIVATE_HOST.test(host) || BLOCKED_SUFFIX.test(host) || !host.includes('.')) {
    return { ok: false, error: 'Internal and private hosts are not allowed.' }
  }
  return { ok: true, url: parsed.toString() }
}

// ─── Firecrawl calls ────────────────────────────────────────────────────────
function authHeaders(): HeadersInit {
  const key = process.env.FIRECRAWL_API_KEY
  if (!key) throw new Error('FIRECRAWL_API_KEY is not configured')
  return { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
}

export function liveModeAvailable(): boolean {
  return Boolean(process.env.FIRECRAWL_API_KEY)
}

async function firecrawl(path: string, body: unknown): Promise<any> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
  try {
    const res = await fetch(`${FIRECRAWL_BASE}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    const json = await res.json().catch(() => ({}))
    if (!res.ok || json?.success === false) {
      const msg = json?.error || `Firecrawl returned ${res.status}`
      throw new Error(typeof msg === 'string' ? msg : 'Firecrawl request failed')
    }
    return json
  } finally {
    clearTimeout(timer)
  }
}

export interface LiveCrawlResult {
  links: string[]
  seed: {
    url: string
    markdown: string
    title?: string
    statusCode?: number
    discoveredLinks: string[]
  }
}

export async function runLiveCrawl(url: string): Promise<LiveCrawlResult> {
  const [map, scrape] = await Promise.all([
    firecrawl('/v1/map', { url, limit: MAP_LIMIT }),
    firecrawl('/v1/scrape', {
      url,
      formats: ['markdown', 'links'],
      onlyMainContent: true,
    }),
  ])
  const data = scrape.data ?? scrape
  return {
    links: Array.isArray(map.links) ? map.links.slice(0, MAP_LIMIT) : [],
    seed: {
      url,
      markdown: data.markdown ?? '',
      title: data.metadata?.title,
      statusCode: data.metadata?.statusCode,
      discoveredLinks: Array.isArray(data.links) ? data.links.slice(0, 60) : [],
    },
  }
}

export interface LiveMonitorResult {
  markdown: string
  changeTracking: {
    previousScrapeAt: string | null
    changeStatus: 'new' | 'same' | 'changed' | 'removed'
    visibility: 'visible' | 'hidden'
  }
  json?: Record<string, unknown>
}

export async function runLiveMonitor(
  url: string,
  schema?: Record<string, unknown>,
): Promise<LiveMonitorResult> {
  const modes = schema ? ['git-diff', 'json'] : ['git-diff']
  const changeTracking: Record<string, unknown> = { type: 'changeTracking', modes }
  if (schema) changeTracking.schema = schema

  const res = await firecrawl('/v2/scrape', {
    url,
    formats: ['markdown', changeTracking],
  })
  const data = res.data ?? res
  const ct = data.changeTracking ?? {}
  return {
    markdown: data.markdown ?? '',
    changeTracking: {
      previousScrapeAt: ct.previousScrapeAt ?? null,
      changeStatus: ct.changeStatus ?? 'new',
      visibility: ct.visibility ?? 'visible',
    },
    json: ct.json,
  }
}

export function clientIp(headers: Headers): string {
  const fwd = headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return headers.get('x-real-ip') ?? 'unknown'
}
