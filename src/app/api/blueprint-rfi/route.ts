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
const LIMIT = 120
const WINDOW_MS = 60 * 60 * 1000

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now })
    return false
  }
  entry.count++
  return entry.count > LIMIT
}

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()
  if (rateLimited(ip)) {
    return new Response('Slow down a little — try again in a bit.', { status: 429 })
  }

  let body: { drawingId?: string; messages?: Array<{ role: string; content: string }>; via?: string }
  try {
    body = await req.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const cfg = body.drawingId ? RFI_CONFIGS[body.drawingId] : undefined
  if (!cfg) {
    return new Response('Unknown drawing', { status: 404 })
  }

  const { messages } = body
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 24) {
    return new Response('Bad request', { status: 400 })
  }
  const MAX_CONTENT_LENGTH = 2000
  for (const m of messages) {
    if (
      !m ||
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.content !== 'string' ||
      m.content.length > MAX_CONTENT_LENGTH
    ) {
      return new Response('Bad request', { status: 400 })
    }
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
