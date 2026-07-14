'use client'

import Link from 'next/link'
import { memo, useEffect, useMemo, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import { useChat } from 'ai/react'
import { track } from '@vercel/analytics'
import {
  ArrowUpRight,
  CalendarDays,
  Flame,
  Mic2,
  Send,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { getAffiliateLink, type AffiliateProduct } from '@/lib/affiliate'
import {
  ADVISOR_POSTS_BY_SLUG,
  type AdvisorPostSlug,
} from '@/lib/advisor-catalog'

const SUGGESTIONS = [
  'Which AI meeting notes app should I use?',
  'I want meeting notes but no bot joining my calls',
  'Best voice dictation for coding?',
  'I need to turn websites into data for a RAG pipeline',
  'What does Zack actually use daily?',
]

const PRODUCT_DATA: Record<
  AffiliateProduct,
  {
    name: string
    benefit: string
    cta: string
    description: string
    icon: LucideIcon
    gradient: string
    glow: string
  }
> = {
  granola: {
    name: 'Granola',
    benefit: 'First 3 months free for new users',
    cta: 'Get 3 Months Free',
    description: 'AI meeting notes with no bot joining the call.',
    icon: CalendarDays,
    gradient: 'from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500',
    glow: 'bg-teal-500/10 text-teal-700 dark:bg-teal-400/10 dark:text-teal-300',
  },
  wisprflow: {
    name: 'WisprFlow',
    benefit: 'Free to try',
    cta: 'Try WisprFlow Free',
    description: 'Voice-to-text everywhere you type, including code and long-form writing.',
    icon: Mic2,
    gradient: 'from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500',
    glow: 'bg-purple-500/10 text-purple-700 dark:bg-purple-400/10 dark:text-purple-300',
  },
  firecrawl: {
    name: 'Firecrawl',
    benefit: 'Free to try',
    cta: 'Try Firecrawl Free',
    description: 'Web crawling that returns clean, LLM-ready content for apps and agents.',
    icon: Flame,
    gradient: 'from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500',
    glow: 'bg-orange-500/10 text-orange-700 dark:bg-orange-400/10 dark:text-orange-300',
  },
}

type ParsedSegment =
  | { type: 'text'; value: string }
  | { type: 'tool'; product: AffiliateProduct }
  | { type: 'post'; slug: AdvisorPostSlug }

const MARKER_PATTERN = /\[\[(tool|post):([a-z0-9-]+)\]\]/g

function parseMessage(content: string, isStreaming: boolean): ParsedSegment[] {
  // A marker can arrive over several stream chunks. Hide its unfinished tail
  // so readers never see protocol text flash in the message.
  const safeContent = isStreaming
    ? content.replace(/\[\[[^\]\n]*$/, '')
    : content
  const segments: ParsedSegment[] = []
  let cursor = 0

  for (const match of safeContent.matchAll(MARKER_PATTERN)) {
    const index = match.index ?? 0
    if (index > cursor) {
      segments.push({ type: 'text', value: safeContent.slice(cursor, index) })
    }

    const [, markerType, value] = match
    if (markerType === 'tool' && value in PRODUCT_DATA) {
      segments.push({ type: 'tool', product: value as AffiliateProduct })
    } else if (markerType === 'post' && value in ADVISOR_POSTS_BY_SLUG) {
      segments.push({ type: 'post', slug: value as AdvisorPostSlug })
    }
    cursor = index + match[0].length
  }

  if (cursor < safeContent.length) {
    segments.push({ type: 'text', value: safeContent.slice(cursor) })
  }

  return segments
}

function ToolCard({ product }: { product: AffiliateProduct }) {
  const impressionTracked = useRef(false)
  const data = PRODUCT_DATA[product]
  const Icon = data.icon
  const href = useMemo(
    () =>
      getAffiliateLink({
        product,
        campaign: 'advisor-chat',
        medium: 'tools',
        placement: 'chat',
      }),
    [product],
  )

  useEffect(() => {
    if (impressionTracked.current) return
    impressionTracked.current = true
    track('advisor_rec_impression', { product })
  }, [product])

  return (
    <aside className="my-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-700/60 dark:bg-zinc-900">
      <div className={`h-1 bg-gradient-to-r ${data.gradient}`} />
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className={`rounded-xl p-2.5 ${data.glow}`}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {data.name}
              </h3>
              <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {data.benefit}
              </span>
            </div>
            <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              {data.description}
            </p>
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => track('advisor_rec_click', { product })}
          className={`mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition sm:w-auto ${data.gradient}`}
        >
          {data.cta}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </aside>
  )
}

function PostCard({ slug }: { slug: AdvisorPostSlug }) {
  const post = ADVISOR_POSTS_BY_SLUG[slug]

  return (
    <Link
      href={`/blog/${slug}`}
      onClick={() => track('advisor_post_click', { slug })}
      className="group my-3 block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-700/60 dark:bg-zinc-900 dark:hover:border-zinc-600"
    >
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
        From Zack’s writing
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
      </span>
      <span className="block text-sm font-semibold leading-6 text-zinc-900 dark:text-zinc-100">
        {post.title}
      </span>
      <span className="mt-1 block text-sm leading-6 text-zinc-600 dark:text-zinc-400">
        {post.description}
      </span>
    </Link>
  )
}

const AssistantMessage = memo(function AssistantMessage({
  content,
  isStreaming,
}: {
  content: string
  isStreaming: boolean
}) {
  const segments = useMemo(
    () => parseMessage(content, isStreaming),
    [content, isStreaming],
  )

  return (
    <div className="min-w-0 flex-1">
      {segments.map((segment, index) => {
        if (segment.type === 'tool') {
          return <ToolCard key={`tool-${segment.product}-${index}`} product={segment.product} />
        }
        if (segment.type === 'post') {
          return <PostCard key={`post-${segment.slug}-${index}`} slug={segment.slug} />
        }
        if (!segment.value.trim()) return null
        return (
          <div
            key={`text-${index}`}
            className="prose prose-sm max-w-none text-zinc-700 prose-p:my-2 prose-p:leading-7 prose-strong:text-zinc-900 prose-ul:my-2 dark:text-zinc-300 dark:prose-invert dark:prose-strong:text-zinc-100"
          >
            <ReactMarkdown
              components={{
                a: ({ children }) => <span>{children}</span>,
              }}
            >
              {segment.value}
            </ReactMarkdown>
          </div>
        )
      })}
    </div>
  )
})

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 py-2" role="status" aria-label="Advisor is writing">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-zinc-400 motion-reduce:animate-none dark:bg-zinc-500"
          style={{ animationDelay: `${dot * 140}ms` }}
        />
      ))}
    </div>
  )
}

export default function AdvisorChat() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const shouldAutoScroll = useRef(true)
  const { messages, input, setInput, append, isLoading, error } = useChat({
    api: '/api/advisor-chat',
  })

  useEffect(() => {
    if (!shouldAutoScroll.current || !scrollRef.current) return
    const frame = requestAnimationFrame(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [messages, isLoading])

  const updateScrollIntent = () => {
    const node = scrollRef.current
    if (!node) return
    const distanceFromBottom = node.scrollHeight - node.scrollTop - node.clientHeight
    shouldAutoScroll.current = distanceFromBottom < 120
  }

  const ask = (question: string, via: 'typed' | 'chip') => {
    const trimmed = question.trim()
    if (!trimmed || isLoading) return
    shouldAutoScroll.current = true
    track('advisor_chat_question', { q: trimmed.slice(0, 100), via })
    void append({ role: 'user', content: trimmed }, { body: { via } })
    setInput('')
  }

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    ask(input, 'typed')
  }

  const lastMessage = messages[messages.length - 1]

  return (
    <section
      className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 shadow-xl shadow-zinc-900/5 dark:border-zinc-700/60 dark:bg-zinc-900/70 dark:shadow-black/20"
      aria-label="AI tool advisor chat"
    >
      <header className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3.5 dark:border-zinc-700/60 dark:bg-zinc-900 sm:px-5">
        <div className="rounded-xl bg-zinc-900 p-2 text-white dark:bg-zinc-100 dark:text-zinc-900">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Tool Advisor</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">Straight answers, with the tradeoffs included</p>
        </div>
      </header>

      <div
        ref={scrollRef}
        onScroll={updateScrollIntent}
        className="h-[min(58vh,560px)] min-h-[400px] overflow-y-auto overscroll-contain px-3 py-5 sm:px-5"
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className="mx-auto flex min-h-full max-w-xl flex-col justify-center py-4">
            <div className="mb-5 text-center">
              <p className="text-base font-medium text-zinc-900 dark:text-zinc-100">
                Tell me what you are trying to get done.
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                I may ask one or two questions before giving you a recommendation.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              {SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isLoading}
                  onClick={() => ask(suggestion, 'chip')}
                  className="rounded-xl border border-zinc-200 bg-white px-4 py-3 text-left text-sm leading-5 text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700/60 dark:bg-zinc-800/70 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-2xl space-y-5">
          {messages.map((message, index) => {
            const streamingAssistant =
              isLoading && index === messages.length - 1 && message.role === 'assistant'

            if (message.role === 'user') {
              return (
                <div key={message.id} className="flex justify-end pl-8 sm:pl-16">
                  <div className="max-w-xl rounded-2xl rounded-br-md bg-zinc-900 px-4 py-3 text-sm leading-6 text-white dark:bg-zinc-100 dark:text-zinc-900">
                    {message.content}
                  </div>
                </div>
              )
            }

            return (
              <div key={message.id} className="flex items-start gap-2.5 pr-1 sm:gap-3 sm:pr-8">
                <div className="mt-0.5 hidden rounded-lg border border-zinc-200 bg-white p-1.5 text-zinc-600 dark:border-zinc-700/60 dark:bg-zinc-800 dark:text-zinc-300 sm:block">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <AssistantMessage content={message.content} isStreaming={streamingAssistant} />
              </div>
            )
          })}

          {isLoading && lastMessage?.role === 'user' && (
            <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
              <TypingIndicator />
            </div>
          )}
          {isLoading && lastMessage?.role === 'assistant' && (
            <div className="pl-1 text-zinc-500 dark:text-zinc-400">
              <TypingIndicator />
            </div>
          )}
          {error && (
            <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
              The advisor could not answer that one. Wait a moment and try again.
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-white p-3 dark:border-zinc-700/60 dark:bg-zinc-900 sm:p-4">
        <form onSubmit={submit} className="mx-auto max-w-2xl">
          <div className="flex items-end gap-2 rounded-2xl border border-zinc-300 bg-white p-2 shadow-sm focus-within:border-zinc-500 focus-within:ring-2 focus-within:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:focus-within:border-zinc-500 dark:focus-within:ring-zinc-800">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  ask(input, 'typed')
                }
              }}
              disabled={isLoading}
              rows={1}
              maxLength={2000}
              placeholder={isLoading ? 'The advisor is writing…' : 'What do you need a tool to do?'}
              aria-label="Your question"
              className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2 text-sm leading-6 text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:opacity-60 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send question"
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className="mt-2.5 px-1 text-center text-[11px] leading-4 text-zinc-500 dark:text-zinc-500 sm:text-xs">
            Some recommendations use affiliate links. Granola signups through them give you 3 months free and support the site.
          </p>
        </form>
      </div>
    </section>
  )
}
