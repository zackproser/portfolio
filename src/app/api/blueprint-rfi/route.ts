import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { RFI_CONFIGS, buildRfiSystemPrompt } from '@/lib/blueprint/rfi-configs'

// RFI (Request For Information) desk for Blueprint Deep Dive posts.
//
// Same shape as /api/ghx-chat: streamText over the site's OpenAI key,
// soft per-IP rate limit, questions logged to function logs as signal
// for the next revision of each drawing. System prompts are looked up
// server-side by drawingId (src/lib/blueprint/rfi-configs.ts) so the
// route can't be driven with arbitrary client-supplied prompts.

export const maxDuration = 30

const hits = new Map<string, { count: number; windowStart: number }>()
const LIMIT = 60
const WINDOW_MS = 60 * 60 * 1000
const MAX_TRACKED_IPS = 5000

// Backstop for spoofed/rotating client IPs: bound the total spend one
// process can generate regardless of how many distinct IPs appear.
let globalCount = 0
let globalWindowStart = 0
const GLOBAL_LIMIT = 1500

function rateLimited(ip: string): boolean {
  const now = Date.now()
  if (now - globalWindowStart > WINDOW_MS) {
    globalWindowStart = now
    globalCount = 0
  }
  globalCount++
  if (globalCount > GLOBAL_LIMIT) return true
  // Bound the map without wiping live counters: drop expired windows
  // first; only if everything is live, drop the oldest entries. A
  // clear-all here would let rotating IPs reset everyone's quota.
  if (hits.size > MAX_TRACKED_IPS) {
    for (const [key, entry] of hits) {
      if (now - entry.windowStart > WINDOW_MS) hits.delete(key)
    }
    while (hits.size > MAX_TRACKED_IPS) {
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
  return entry.count > LIMIT
}

export async function POST(req: Request) {
  // Client IP: x-real-ip is set by Vercel's edge and not client-
  // controllable; the leftmost x-forwarded-for entry is the platform-
  // sanitized client address (matches ghx-chat). The RIGHTMOST hop is
  // Vercel's own shared proxy — keying on it collapses every reader
  // into one rate-limit bucket.
  const ip =
    req.headers.get('x-real-ip')?.trim() ||
    (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  if (rateLimited(ip)) {
    return new Response('Slow down a little — try again in a bit.', { status: 429 })
  }

  if (!process.env.OPENAI_API_KEY) {
    // Fail before streamText: a lazy stream would otherwise surface a
    // provider error as an empty 200 body.
    return new Response('RFI desk is offline right now.', { status: 503 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return new Response('Bad request', { status: 400 })
  }
  const { drawingId, messages } = body as { drawingId?: unknown; messages?: unknown }

  const cfg =
    typeof drawingId === 'string' && Object.hasOwn(RFI_CONFIGS, drawingId)
      ? RFI_CONFIGS[drawingId]
      : undefined
  if (!cfg) {
    return new Response('Unknown drawing', { status: 404 })
  }

  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 24) {
    return new Response('Bad request', { status: 400 })
  }
  // User questions are capped tightly; assistant history gets headroom
  // because our own streamed answers (maxTokens: 700) routinely exceed
  // 2,000 characters and come back as context on the next turn.
  const MAX_USER_LENGTH = 2000
  const MAX_ASSISTANT_LENGTH = 8000
  for (const m of messages) {
    if (
      !m ||
      typeof m !== 'object' ||
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.content !== 'string' ||
      m.content.length > (m.role === 'user' ? MAX_USER_LENGTH : MAX_ASSISTANT_LENGTH)
    ) {
      return new Response('Bad request', { status: 400 })
    }
  }
  // The endpoint answers reader questions; it is not a continuation
  // proxy for arbitrary assistant prefills.
  if (messages[messages.length - 1].role !== 'user') {
    return new Response('Bad request', { status: 400 })
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  // Every RFI is signal about where the drawing is unclear.
  console.log(`[blueprint-rfi] ${cfg.drawingCode} q: ${String(lastUser?.content ?? '').slice(0, 300)}`)

  const result = streamText({
    model: openai.chat('gpt-4o-mini'),
    system: buildRfiSystemPrompt(cfg),
    messages: messages.slice(-12) as Array<{ role: 'user' | 'assistant'; content: string }>,
    maxTokens: 700,
    onFinish: ({ text }) => {
      console.log(`[blueprint-rfi] ${cfg.drawingCode} a: ${text.slice(0, 400)}`)
    },
  })

  // Plain text stream — the client accumulates chunks and renders its
  // own compact markdown.
  return result.toTextStreamResponse()
}
