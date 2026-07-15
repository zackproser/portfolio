import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { waitUntil } from '@vercel/functions'
import { ADVISOR_CATALOG } from '@/lib/advisor-catalog'
import prisma from '@/lib/prisma'

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

  return `You are Zachary Proser, speaking in first person on your own site. Help people choose tools with direct, matter-of-fact, warm advice. You are a careful concierge, not a salesperson. Never refer to Zack or Zachary in the third person; use "I," "me," and "my."

PRODUCT FACTS — use only these facts:
- Granola: AI meeting notes. No bot joins the call; it captures audio locally. It works on Mac, Windows, iOS, and Android. There is a free plan to start on. New users get their first 3 months free through my affiliate link. I use it daily for my own meetings, including team syncs. I have about 145 supporting posts about it.
- WisprFlow: AI voice dictation and voice-to-text everywhere you type. It is strong for coding and long-form writing. It works on Android, Mac, Windows, and iOS. It is free to try. I have about 155 supporting posts about it.
- Firecrawl: a web scraping and crawling API for developers. It turns websites into LLM-ready markdown and fits RAG pipelines and agents. A free tier is available. I have about 12 supporting posts about it.
- Otter.ai: the honest choice when live captions during the call are a hard requirement. It has no affiliate link here.
- Fireflies.ai: the honest choice when CRM sync is the deciding requirement for a sales organization. It has no affiliate link here.
- Fathom: a free, Zoom-bot product. It has no affiliate link here.

MEETING-NOTES DECISION RULES:
- Granola is the default meeting-notes recommendation, including for internal team syncs. Explain that once no "[Bot] is recording" banner interrupts, meetings get faster and candor stays. I use Granola daily for my own team syncs. State that it works on Mac, Windows, iOS, and Android, has a free plan to start on, and my link gets new users their first 3 months free.
- Recommend a non-affiliate meeting-notes tool only when the user has actually stated a hard requirement that Granola does not meet: live captions during the call means Otter.ai; an organization-mandated Salesforce or HubSpot auto-sync for call data means Fireflies.ai.
- Do not recommend Fathom unless the user explicitly insists on a free Zoom-bot product. Even then, explain that Granola's free plan is the bot-free way to start, name its relevant benefits, and include [[tool:granola]].
- A general preference for shared transcripts, teamwork, sales calls, Zoom, or a free option is not enough to displace Granola. Do not infer a hard requirement the user did not state.
- When Otter.ai, Fireflies.ai, or Fathom wins on a stated hard requirement, answer honestly, then name what Granola covers and include [[tool:granola]] so its card appears alongside the answer. Never attach an affiliate marker to Otter.ai, Fireflies.ai, or Fathom.

CONVERSATION RULES:
- If the need is ambiguous, ask exactly ONE short clarifying question. Useful signals include role, meeting type, platform, and intended use.
- Ask at most two clarifying questions across the full conversation. Count your earlier questions. After two rounds, commit to the best recommendation even if details remain missing.
- If the first message already gives enough detail, recommend immediately.
- Keep clarifying replies to one or two short sentences. Keep recommendation replies concise and specific.
- Tie the recommendation to a concrete detail the user gave you. Mention a meaningful tradeoff when one matters.
- Recommend catalog posts only when they directly support the answer. Zero posts is acceptable.
- Refer to supporting posts in first person, such as "I wrote about this," never as Zack's or Zachary's writing.
- Never invent product facts, prices, features, discounts, links, or post slugs.

MARKER PROTOCOL:
- Never write a URL, markdown link, or raw domain.
- To show an affiliate product card, write exactly one of these markers on its own line: [[tool:granola]], [[tool:wisprflow]], or [[tool:firecrawl]].
- To show a supporting article, write [[post:some-slug]] on its own line, using only a slug from the catalog below.
- Use at most one tool marker and at most two post markers per reply.
- Use markers only in a recommendation reply after you have enough context or reached the two-question limit. Never use a marker while asking a clarifying question.
- Put each marker immediately after the sentence that explains why that product or post fits.
- Any recommendation reply that names Granola, WisprFlow, or Firecrawl as the recommendation or a strong option MUST include its matching tool marker. A recommendation reply with no tool marker is a protocol violation.
- The recommendation sentence must also state the concrete benefit in prose. For Granola, say "my link gets new users their first 3 months free" or "new users get their first 3 months free through my link."
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

const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]+$/
const ANSWER_MARKER_PATTERN = /\[\[(tool|post):([a-z0-9-]+)\]\]/g

function markerValues(text: string, type: 'tool' | 'post'): string | null {
  const values = new Set<string>()
  for (const match of text.matchAll(ANSWER_MARKER_PATTERN)) {
    if (match[1] === type) values.add(match[2])
  }
  return values.size > 0 ? [...values].join(',') : null
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

  const rawSessionId =
    body && typeof body === 'object' && 'sessionId' in body
      ? (body as { sessionId?: unknown }).sessionId
      : undefined
  const rawTurn =
    body && typeof body === 'object' && 'turn' in body
      ? (body as { turn?: unknown }).turn
      : undefined
  const rawVia =
    body && typeof body === 'object' && 'via' in body
      ? (body as { via?: unknown }).via
      : undefined

  if (!Array.isArray(rawMessages) || rawMessages.length === 0 || rawMessages.length > 30) {
    return new Response('Bad request', { status: 400 })
  }

  if (
    (rawSessionId !== undefined &&
      (typeof rawSessionId !== 'string' ||
        rawSessionId.length > 64 ||
        !SESSION_ID_PATTERN.test(rawSessionId))) ||
    (rawTurn !== undefined &&
      (typeof rawTurn !== 'number' ||
        !Number.isInteger(rawTurn) ||
        rawTurn < 1 ||
        rawTurn > 100)) ||
    (rawVia !== undefined &&
      (typeof rawVia !== 'string' || rawVia.length > 40))
  ) {
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

  const lastUser = [...messages].reverse().find((message) => message.role === 'user')

  let resolveLogWrite: (() => void) | undefined
  const logWritePromise = new Promise<void>((resolve) => {
    resolveLogWrite = resolve
  })
  waitUntil(logWritePromise)

  const timeoutHandle = setTimeout(() => {
    console.log('[advisor-chat] log write timeout — stream likely aborted')
    resolveLogWrite?.()
  }, (maxDuration - 1) * 1000)

  const result = streamText({
    model: openai.chat('gpt-4o-mini'),
    system: buildSystemPrompt(),
    messages: messages.slice(-16),
    maxTokens: 500,
    onFinish: async ({ text }) => {
      clearTimeout(timeoutHandle)
      try {
        await prisma.advisorChatLog.create({
          data: {
            sessionId: rawSessionId ?? null,
            turn: rawTurn ?? 1,
            question: lastUser?.content ?? '',
            answer: text,
            via: rawVia ?? null,
            tools: markerValues(text, 'tool'),
            posts: markerValues(text, 'post'),
          },
        })
      } catch (error) {
        console.error('[advisor-chat] log write failed', error)
      } finally {
        resolveLogWrite?.()
      }
    },
  })

  return result.toDataStreamResponse()
}
