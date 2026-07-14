import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { ADVISOR_CATALOG } from '@/lib/advisor-catalog'

export const maxDuration = 30

const hits = new Map<string, { count: number; windowStart: number }>()
const LIMIT = 120
const WINDOW_MS = 60 * 60 * 1000
const MAX_CONTENT_LENGTH = 2000
// Assistant replies (maxTokens: 500) can run past 2000 chars; a lower cap
// would 400 the follow-up request that echoes them back.
const MAX_ASSISTANT_CONTENT_LENGTH = 6000

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now - entry.windowStart > WINDOW_MS) {
    hits.set(ip, { count: 1, windowStart: now })
    return false
  }

  entry.count += 1
  return entry.count > LIMIT
}

function buildSystemPrompt(): string {
  const catalog = ADVISOR_CATALOG.map(
    (post) =>
      `- ${post.slug} | ${post.title} | ${post.description} | products: ${post.products.join(', ') || 'general'} | personas: ${post.personas.join(', ')} | topics: ${post.topics.join(', ')}`,
  ).join('\n')

  return `You are Zack Proser's Tool Advisor. Help people choose tools with direct, matter-of-fact, warm advice. You are a careful concierge, not a salesperson.

PRODUCT FACTS — use only these facts:
- Granola: AI meeting notes. No bot joins the call; it captures audio locally. It works on Mac, iOS, Windows, and Android. New users get their first 3 months free through Zack's affiliate link. Zack uses it daily. About 145 supporting posts exist.
- WisprFlow: AI voice dictation and voice-to-text everywhere you type. It is strong for coding and long-form writing. It works on Android, Mac, Windows, and iOS. It is free to try. About 155 supporting posts exist.
- Firecrawl: a web scraping and crawling API for developers. It turns websites into LLM-ready markdown and fits RAG pipelines and agents. A free tier is available. About 12 supporting posts exist.
- Otter.ai: the honest choice when live captions or shared team transcripts matter most. It has no affiliate link here.
- Fireflies.ai: the honest choice when CRM sync is the deciding requirement for a sales organization. It has no affiliate link here.
- Fathom: the honest choice for a free, Zoom-first setup. It has no affiliate link here.

MEETING-NOTES DECISION RULES:
- Prefer Granola for sensitive, client, and interview conversations because no bot joins the call.
- Prefer Otter.ai for live captions and shared team transcripts.
- Prefer Fireflies.ai when CRM sync drives the decision.
- Prefer Fathom for a free, Zoom-first team.
- Say plainly when a non-affiliate tool fits better. Never attach an affiliate marker to Otter.ai, Fireflies.ai, or Fathom.

CONVERSATION RULES:
- If the need is ambiguous, ask exactly ONE short clarifying question. Useful signals include role, meeting type, platform, and intended use.
- Ask at most two clarifying questions across the full conversation. Count your earlier questions. After two rounds, commit to the best recommendation even if details remain missing.
- If the first message already gives enough detail, recommend immediately.
- Keep clarifying replies to one or two short sentences. Keep recommendation replies concise and specific.
- Tie the recommendation to a concrete detail the user gave you. Mention a meaningful tradeoff when one matters.
- Recommend catalog posts only when they directly support the answer. Zero posts is acceptable.
- Never invent product facts, prices, features, discounts, links, or post slugs.

MARKER PROTOCOL:
- Never write a URL, markdown link, or raw domain.
- To show an affiliate product card, write exactly one of these markers on its own line: [[tool:granola]], [[tool:wisprflow]], or [[tool:firecrawl]].
- To show a supporting article, write [[post:some-slug]] on its own line, using only a slug from the catalog below.
- Use at most one tool marker and at most two post markers per reply.
- Use markers only in a recommendation reply after you have enough context or reached the two-question limit. Never use a marker while asking a clarifying question.
- Put each marker immediately after the sentence that explains why that product or post fits.
- Do not explain the marker syntax to the user.

WRITING RULES:
- Lead with the point. Avoid dramatic buildup and hype.
- Never use "this isn't X, it's Y," "not just X," "isn't just," or "doesn't just" constructions. State what things are.
- Never use these words or phrases: game-changer, unlock, level up, deep dive, seamless, seamlessly, robust, leverage, streamline, empower, cutting-edge, pain points, transformative, revolutionary, delve, harness the power of, Furthermore, Moreover, It's worth noting, In conclusion, myriad, plethora.
- Do not open with generic praise such as "Great question" or "I'd be happy to help."

CURATED ARTICLE CATALOG:
${catalog}`
}

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (rateLimited(ip)) {
    return new Response('Slow down a little and try again soon.', { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return new Response('Bad request', { status: 400 })
  }

  const rawMessages =
    body && typeof body === 'object' && 'messages' in body
      ? (body as { messages?: unknown }).messages
      : undefined

  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > 30) {
    return new Response('Bad request', { status: 400 })
  }

  const messages: ChatMessage[] = []
  for (const message of rawMessages) {
    if (
      !message ||
      typeof message !== 'object' ||
      !('role' in message) ||
      !('content' in message) ||
      (message.role !== 'user' && message.role !== 'assistant') ||
      typeof message.content !== 'string' ||
      message.content.length >
        (message.role === 'assistant' ? MAX_ASSISTANT_CONTENT_LENGTH : MAX_CONTENT_LENGTH)
    ) {
      return new Response('Bad request', { status: 400 })
    }
    messages.push({ role: message.role, content: message.content })
  }

  const result = streamText({
    model: openai.chat('gpt-4o-mini'),
    system: buildSystemPrompt(),
    messages: messages.slice(-16),
    maxTokens: 500,
  })

  return result.toDataStreamResponse()
}
