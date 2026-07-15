'use client'

import Link from 'next/link'
import { memo, useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { useChat } from 'ai/react'
import { track } from '@vercel/analytics'
import {
  ArrowUpRight,
  CalendarDays,
  Focus,
  Flame,
  Mic2,
  Send,
  type LucideIcon,
} from 'lucide-react'
import { getAffiliateLink, type AffiliateProduct } from '@/lib/affiliate'
import {
  ADVISOR_POSTS_BY_SLUG,
  type AdvisorPostSlug,
} from '@/lib/advisor-catalog'
import type { AdvisorSignal } from './advisor-types'
import styles from './AdvisorChat.module.css'

const SUGGESTIONS = [
  'Which AI meeting notes app should I use?',
  'I want meeting notes but no bot joining my calls',
  'Best voice dictation for coding?',
  'I need to turn websites into data for a RAG pipeline',
  'What does Zack actually use daily?',
]

const SUGGESTION_ACCENTS = ['#43d3bc', '#43d3bc', '#a78bfa', '#fb923c', '#6ae1ff']

const PLACEHOLDERS = [
  'meeting notes without a call bot',
  'dictation that works well for code',
  'clean web data for a RAG pipeline',
  'the tool you would choose for daily work',
]

const PRODUCT_DATA: Record<
  AffiliateProduct,
  {
    name: string
    benefit: string
    cta: string
    description: string
    icon: LucideIcon
    accent: string
  }
> = {
  granola: {
    name: 'Granola',
    benefit: 'First 3 months free for new users',
    cta: 'Get 3 Months Free',
    description: 'AI meeting notes with no bot joining the call.',
    icon: CalendarDays,
    accent: '#43d3bc',
  },
  wisprflow: {
    name: 'WisprFlow',
    benefit: 'Free to try',
    cta: 'Try WisprFlow Free',
    description: 'Voice-to-text everywhere you type, including code and long-form writing.',
    icon: Mic2,
    accent: '#a78bfa',
  },
  firecrawl: {
    name: 'Firecrawl',
    benefit: 'Free to try',
    cta: 'Try Firecrawl Free',
    description: 'Web crawling that returns clean, LLM-ready content for apps and agents.',
    icon: Flame,
    accent: '#fb923c',
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
  const safeContent = content.replace(/\[\[[^\]\n]*$/, '')
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
    <aside
      className={styles.toolCard}
      style={{ '--tool-accent': data.accent } as React.CSSProperties}
      data-recommendation-card
    >
      <div className={styles.toolSweep} aria-hidden="true" />
      <div className={styles.toolBody}>
        <div className={styles.toolLead}>
          <div className={styles.toolIcon}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className={styles.toolCopy}>
            <div className={styles.toolTitleRow}>
              <h3>
                {data.name}
              </h3>
              <span className={styles.toolBenefit}>
                {data.benefit}
              </span>
            </div>
            <p className={styles.toolDescription}>
              {data.description}
            </p>
          </div>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer sponsored"
          onClick={() => track('advisor_rec_click', { product })}
          className={styles.toolCta}
        >
          {data.cta}
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </aside>
  )
}

function PostCard({ slug, entranceIndex }: { slug: AdvisorPostSlug; entranceIndex: number }) {
  const post = ADVISOR_POSTS_BY_SLUG[slug]

  return (
    <Link
      href={`/blog/${slug}`}
      onClick={() => track('advisor_post_click', { slug })}
      className={`group ${styles.postCard}`}
      style={{ '--post-index': entranceIndex } as React.CSSProperties}
    >
      <span className={styles.postLabel}>
        From Zack’s writing
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
      </span>
      <span className={styles.postTitle}>
        {post.title}
      </span>
      <span className={styles.postDescription}>
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
          return <PostCard key={`post-${segment.slug}-${index}`} slug={segment.slug} entranceIndex={index} />
        }
        if (!segment.value.trim()) return null
        return (
          <div
            key={`text-${index}`}
            className={`prose prose-sm max-w-none prose-p:my-2 prose-p:leading-7 prose-ul:my-2 ${styles.assistantProse}`}
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
    <div className={styles.typing} role="status" aria-label="Advisor is writing">
      {[0, 1, 2, 3, 4].map((dot) => (
        <span
          key={dot}
          style={{
            '--dot': dot,
            '--dot-rest': `${3 + dot * 10}px`,
            '--dot-collapse': `${(2 - dot) * 10}px`,
            '--dot-reduced': `${14 + dot * 4}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

function CyclingPlaceholder({ hidden }: { hidden: boolean }) {
  const [index, setIndex] = useState(0)
  const [previous, setPrevious] = useState<number | null>(null)
  const indexRef = useRef(0)

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (query.matches) return
    let clearPrevious = 0
    const timer = window.setInterval(() => {
      const current = indexRef.current
      const next = (current + 1) % PLACEHOLDERS.length
      setPrevious(current)
      setIndex(next)
      indexRef.current = next
      window.clearTimeout(clearPrevious)
      clearPrevious = window.setTimeout(() => setPrevious(null), 520)
    }, 3200)
    return () => {
      window.clearInterval(timer)
      window.clearTimeout(clearPrevious)
    }
  }, [])

  if (hidden) return null
  return (
    <span className={styles.placeholderStage} aria-hidden="true">
      {previous !== null && (
        <span key={`old-${previous}`} className={`${styles.placeholder} ${styles.placeholderOut}`}>
          {PLACEHOLDERS[previous]}
        </span>
      )}
      <span key={index} className={styles.placeholder}>
        {PLACEHOLDERS[index]}
      </span>
    </span>
  )
}

export default function AdvisorChat({
  onSignalChange,
}: {
  onSignalChange?: (signal: AdvisorSignal) => void
}) {
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

  useEffect(() => {
    if (!onSignalChange) return
    if (messages.length === 0) {
      onSignalChange({ phase: 'idle' })
      return
    }

    let lastUserIndex = -1
    for (let index = messages.length - 1; index >= 0; index--) {
      if (messages[index].role === 'user') {
        lastUserIndex = index
        break
      }
    }

    let recommended: AffiliateProduct | undefined
    for (let index = messages.length - 1; index > lastUserIndex; index--) {
      const message = messages[index]
      if (message.role !== 'assistant') continue
      const matches = [...message.content.matchAll(/\[\[tool:(granola|wisprflow|firecrawl)\]\]/g)]
      const latest = matches[matches.length - 1]?.[1]
      if (latest) {
        recommended = latest as AffiliateProduct
        break
      }
    }

    if (recommended) {
      onSignalChange({ phase: 'resolved', accent: PRODUCT_DATA[recommended].accent })
    } else if (isLoading) {
      onSignalChange({ phase: 'thinking' })
    } else {
      onSignalChange({ phase: 'listening' })
    }
  }, [isLoading, messages, onSignalChange])

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
    onSignalChange?.({ phase: 'listening' })
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
      className={styles.shell}
      aria-label="AI tool advisor chat"
    >
      <header className={styles.chatHeader}>
        <div className={styles.advisorMark}>
          <Focus className="h-4 w-4" aria-hidden="true" />
        </div>
        <div className={styles.headerCopy}>
          <h2>Tool Advisor</h2>
          <p>Straight answers, with the tradeoffs included</p>
        </div>
        <span className={styles.headerSignal} aria-hidden="true"><i /><i /><i /></span>
      </header>

      <div
        ref={scrollRef}
        onScroll={updateScrollIntent}
        className={styles.scroll}
        aria-live="polite"
      >
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyCopy}>
              <p className={styles.emptyTitle}>
                Tell me what you are trying to get done.
              </p>
              <p className={styles.emptyDescription}>
                I may ask one or two questions before giving you a recommendation.
              </p>
            </div>
            <div className={styles.suggestions}>
              {SUGGESTIONS.map((suggestion, index) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={isLoading}
                  onClick={() => ask(suggestion, 'chip')}
                  className={styles.suggestion}
                  style={{
                    '--chip-index': index,
                    '--chip-accent': SUGGESTION_ACCENTS[index],
                  } as React.CSSProperties}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={styles.messages}>
          {messages.map((message, index) => {
            const streamingAssistant =
              isLoading && index === messages.length - 1 && message.role === 'assistant'

            if (message.role === 'user') {
              return (
                <div key={message.id} className={`${styles.messageIn} ${styles.userRow}`}>
                  <div className={styles.userBubble}>
                    {message.content}
                  </div>
                </div>
              )
            }

            return (
              <div key={message.id} className={`${styles.messageIn} ${styles.assistantMessageIn} ${styles.assistantRow}`}>
                <div className={styles.assistantMark}>
                  <Focus className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <AssistantMessage content={message.content} isStreaming={streamingAssistant} />
              </div>
            )
          })}

          {isLoading && lastMessage?.role === 'user' && (
            <div className={styles.typingRow}>
              <TypingIndicator />
            </div>
          )}
          {isLoading && lastMessage?.role === 'assistant' && (
            <div className={styles.typingRow}>
              <TypingIndicator />
            </div>
          )}
          {error && (
            <div role="alert" className={styles.error}>
              The advisor could not answer that one. Wait a moment and try again.
            </div>
          )}
        </div>
      </div>

      <div className={styles.composerArea}>
        <form onSubmit={submit} className={styles.form}>
          <div className={styles.composer}>
            <div className={styles.inputWrap}>
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
              placeholder={isLoading ? 'The advisor is writing…' : ''}
              aria-label="Your question"
              className={styles.textarea}
            />
              <CyclingPlaceholder hidden={Boolean(input) || isLoading} />
            </div>
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              aria-label="Send question"
              className={`${styles.sendButton} ${input.trim() ? styles.sendCharged : ''}`}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <p className={styles.disclosure}>
            Some recommendations use affiliate links. Granola signups through them give you 3 months free and support the site.
          </p>
        </form>
      </div>
    </section>
  )
}
