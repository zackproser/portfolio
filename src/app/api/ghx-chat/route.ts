import { streamText } from 'ai'
import { openai } from '@ai-sdk/openai'
import glossary from '@/app/ghx/glossary.json'

// Ask-the-glossary chat for the GHX workshop page (/ghx).
//
// No RAG needed: the entire glossary fits comfortably in the system prompt.
// Every question asked here is signal about what GHX folks are actually
// struggling with — questions are logged (Vercel function logs) and tracked
// client-side, feeding the post-event report and future proposals.
//
// Provider note: runs on the site's existing OpenAI key. To switch to
// Claude (on-theme for a Claude workshop), add ANTHROPIC_API_KEY, install
// @ai-sdk/anthropic, and swap the model line for anthropic('claude-haiku-4-5').

export const maxDuration = 30

// Soft per-IP limit — resets on cold start, which is fine: this is a
// guard against runaway abuse, not billing-grade metering. High limit
// accounts for shared conference WiFi where many attendees share one IP.
const hits = new Map<string, { count: number; windowStart: number }>()
const LIMIT = 300
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

function buildSystemPrompt(): string {
  const terms = glossary.sections
    .map(
      (s) =>
        `## ${s.level} — ${s.name} (${s.difficulty})\n` +
        s.terms.map((t) => `- **${t.term}**: ${t.definition}`).join('\n'),
    )
    .join('\n\n')

  return `You are the live assistant for "The AI Glossary" — a private page built for GHX (Global Healthcare Exchange) Collaboration Week, June 17, 2026, in Denver. The workshop is run by Mind On Fire: Zack Proser, Nick Nisi, and Nick Cannariato. The audience ranges from leaders who have never opened a terminal to advanced engineers.

Your job: answer questions about AI concepts, the glossary's terms, and how this applies to working at GHX — in the same voice as the glossary: plain language, direct, warm, no condescension. Most askers are smart people who were too polite to ask out loud. There are no dumb questions.

THE GLOSSARY (your source of truth):

${terms}

CONTEXT YOU KNOW:
- The workshop day: a sizzle reel, ground rules (psychological safety), a 30-minute de-jargonification walk through this glossary, hands-on blocks starting with Nick Nisi's ideation plugin, and a final advanced block on agents, verification loops, and orchestration.
- GHX engineering runs Claude through AWS Bedrock; the broader org has Claude enterprise access.
- After the workshop, Mind On Fire provides async support through July 1 — for anything beyond a quick answer, point people to the workshop channel.
- The page has live interactive demos: a terminal simulator, tokenizer, embeddings, RAG walkthrough, context-window, and more.

RULES:
- Keep answers SHORT: 2-5 sentences for most questions. This is a phone screen at a workshop table.
- Use healthcare supply chain examples when they help (supplier contracts, GPO terms, price files, claims).
- When a glossary term is relevant, name it so they can find it on the page.
- If asked about GHX internal systems, policies, or anything confidential: you don't know GHX internals — suggest they ask their team or the facilitators.
- If a question is out of scope (personal advice, unrelated tech support, anything sketchy): decline kindly and redirect to the workshop channel.
- Never invent facts about GHX, pricing, or the workshop. "Great question for the room" is a fine answer.
- Banned phrases: "great question!", "I'd be happy to", "delve", "unlock", "seamless", and the construction "this isn't X, it's Y". State what things are.`
}

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return new Response('Slow down a little — try again in a bit.', { status: 429 })
  }

  const { messages } = await req.json()
  if (!Array.isArray(messages) || messages.length === 0 || messages.length > 40) {
    return new Response('Bad request', { status: 400 })
  }
  // Validate message content size to prevent abuse via search-seeded queries
  const MAX_CONTENT_LENGTH = 2000
  for (const m of messages) {
    if (typeof m.content === 'string' && m.content.length > MAX_CONTENT_LENGTH) {
      return new Response('Message too long', { status: 400 })
    }
  }

  const lastUser = [...messages].reverse().find((m) => m.role === 'user')
  // Signal capture: every question is a data point about where GHX is confused.
  console.log(`[ghx-chat] q: ${String(lastUser?.content ?? '').slice(0, 300)}`)

  const result = streamText({
    model: openai.chat('gpt-4o-mini'),
    system: buildSystemPrompt(),
    messages: messages.slice(-12),
    maxTokens: 450,
    onFinish: ({ text }) => {
      console.log(`[ghx-chat] a: ${text.slice(0, 400)}`)
    },
  })

  return result.toDataStreamResponse()
}
