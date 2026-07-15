'use client'

import Link from 'next/link'
import {
  cloneElement,
  isValidElement,
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
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
  'What do you actually use daily?',
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
const AFFILIATE_NAME_PATTERN = /\b(Granola|Wispr\s?Flow|Firecrawl)\b/gi
const SESSION_ID_PATTERN = /^[a-zA-Z0-9_-]+$/
const SESSION_ID_STORAGE_KEY = 'advisorSessionId'
const SESSION_TURN_STORAGE_KEY = 'advisorSessionTurn'
const INPUT_FOCUS_STORAGE_KEY = 'advisorInputFocusSessionId'

function affiliateProductForName(name: string): AffiliateProduct {
  const normalized = name.toLowerCase().replace(/\s/g, '')
  if (normalized === 'wisprflow') return 'wisprflow'
  if (normalized === 'firecrawl') return 'firecrawl'
  return 'granola'
}

function linkifyAffiliateNames(
  node: ReactNode,
  linkedProducts: Set<AffiliateProduct>,
): ReactNode {
  if (typeof node === 'string') {
    const parts: ReactNode[] = []
    let cursor = 0

    for (const match of node.matchAll(AFFILIATE_NAME_PATTERN)) {
      const index = match.index ?? 0
      const product = affiliateProductForName(match[0])
      if (index > cursor) parts.push(node.slice(cursor, index))

      if (linkedProducts.has(product)) {
        parts.push(match[0])
      } else {
        linkedProducts.add(product)
        const href = getAffiliateLink({
          product,
          campaign: 'advisor-chat',
          medium: 'tools',
          placement: 'text-link',
        })
        parts.push(
          <a
            key={`${product}-${index}`}
            href={href}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={() => track('advisor_text_link_click', { product })}
            className={styles.affiliateTextLink}
            style={{ '--text-link-accent': PRODUCT_DATA[product].accent } as React.CSSProperties}
          >
            {match[0]}
          </a>,
        )
      }
      cursor = index + match[0].length
    }

    if (cursor === 0) return node
    if (cursor < node.length) parts.push(node.slice(cursor))
    return parts
  }

  if (Array.isArray(node)) {
    return node.map((child) => linkifyAffiliateNames(child, linkedProducts))
  }

  if (isValidElement<{ children?: ReactNode }>(node) && node.props.children) {
    return cloneElement(
      node,
      undefined,
      linkifyAffiliateNames(node.props.children, linkedProducts),
    )
  }

  return node
}

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
  const impressionTracked = useRef(false)
  const post = ADVISOR_POSTS_BY_SLUG[slug]

  useEffect(() => {
    if (impressionTracked.current) return
    impressionTracked.current = true
    track('advisor_post_impression', { slug })
  }, [slug])

  return (
    <Link
      href={`/blog/${slug}`}
      onClick={() => track('advisor_post_click', { slug })}
      className={`group ${styles.postCard}`}
      style={{ '--post-index': entranceIndex } as React.CSSProperties}
    >
      <span className={styles.postLabel}>
        From my writing
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
                // Fresh Set per invocation keeps render pure — a shared Set
                // breaks under StrictMode double-invocation (anchor rendered
                // on the discarded pass, plain text on the committed one).
                // Dedupe is per paragraph: first mention of each product links.
                p: ({ children }) => <p>{linkifyAffiliateNames(children, new Set<AffiliateProduct>())}</p>,
                li: ({ children }) => <li>{linkifyAffiliateNames(children, new Set<AffiliateProduct>())}</li>,
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
  surface = 'advisor',
  autoFocus = true,
}: {
  onSignalChange?: (signal: AdvisorSignal) => void
  surface?: string
  autoFocus?: boolean
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const shouldAutoScroll = useRef(true)
  const sessionIdRef = useRef('')
  const turnRef = useRef(0)
  const activeTurnRef = useRef(0)
  const suggestionImpressionTracked = useRef(false)
  const inputFocusTracked = useRef(false)

  const ensureSession = () => {
    if (sessionIdRef.current) return sessionIdRef.current

    let sessionId = ''
    let storedTurn = 0
    try {
      const storedSessionId = sessionStorage.getItem(SESSION_ID_STORAGE_KEY) ?? ''
      const parsedTurn = Number(sessionStorage.getItem(SESSION_TURN_STORAGE_KEY) ?? '0')
      if (
        SESSION_ID_PATTERN.test(storedSessionId) &&
        Number.isInteger(parsedTurn) &&
        parsedTurn >= 0 &&
        parsedTurn < 100
      ) {
        sessionId = storedSessionId
        storedTurn = parsedTurn
      }
    } catch {
      // The in-memory session still works when storage is unavailable.
    }

    if (!sessionId) sessionId = crypto.randomUUID()
    sessionIdRef.current = sessionId
    turnRef.current = storedTurn

    try {
      sessionStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId)
      sessionStorage.setItem(SESSION_TURN_STORAGE_KEY, String(storedTurn))
    } catch {
      // The in-memory session still works when storage is unavailable.
    }

    return sessionId
  }

  const { messages, input, setInput, append, isLoading, error } = useChat({
    api: '/api/advisor-chat',
    onFinish: (message) => {
      const sessionId = ensureSession()
      const turn = activeTurnRef.current
      const segments = parseMessage(message.content, false)
      const tools = [...new Set(
        segments
          .filter((segment): segment is Extract<ParsedSegment, { type: 'tool' }> => segment.type === 'tool')
          .map((segment) => segment.product),
      )].join(',')
      const posts = [...new Set(
        segments
          .filter((segment): segment is Extract<ParsedSegment, { type: 'post' }> => segment.type === 'post')
          .map((segment) => segment.slug),
      )].join(',')

      track('advisor_reply_complete', {
        sessionId,
        turn,
        tools,
        posts,
        chars: message.content.length,
      })
      if (!tools) track('advisor_clarify_shown', { sessionId, turn })
    },
    onError: (chatError) => {
      track('advisor_error', {
        sessionId: ensureSession(),
        message: chatError.message.slice(0, 120),
      })
    },
  })

  useEffect(() => {
    ensureSession()
  }, [])

  useEffect(() => {
    if (messages.length > 0 || suggestionImpressionTracked.current) return
    suggestionImpressionTracked.current = true
    track('advisor_suggestion_impression')
  }, [messages.length])

  useEffect(() => {
    if (!autoFocus) return
    const desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (desktopPointer.matches) inputRef.current?.focus({ preventScroll: true })
  }, [autoFocus])

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
    const sessionId = ensureSession()
    const turn = turnRef.current + 1
    turnRef.current = turn
    activeTurnRef.current = turn
    try {
      sessionStorage.setItem(SESSION_TURN_STORAGE_KEY, String(turn))
    } catch {
      // The in-memory turn counter still works when storage is unavailable.
    }
    shouldAutoScroll.current = true
    onSignalChange?.({ phase: 'listening' })
    const attributedVia = `${surface}-${via}`.slice(0, 40)
    if (turn === 1) track('advisor_session_start', { sessionId, via, surface })
    track('advisor_chat_question', {
      q: trimmed.slice(0, 100),
      via,
      surface,
      sessionId,
      turn,
    })
    void append(
      { role: 'user', content: trimmed },
      { body: { sessionId, turn, via: attributedVia } },
    )
    setInput('')
  }

  const trackInputFocus = () => {
    if (inputFocusTracked.current) return
    const sessionId = ensureSession()
    try {
      if (sessionStorage.getItem(INPUT_FOCUS_STORAGE_KEY) === sessionId) {
        inputFocusTracked.current = true
        return
      }
      sessionStorage.setItem(INPUT_FOCUS_STORAGE_KEY, sessionId)
    } catch {
      // The ref still prevents duplicate events for this mount.
    }
    inputFocusTracked.current = true
    track('advisor_input_focus', { sessionId })
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
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onFocus={trackInputFocus}
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
            Some recommendations use affiliate links. Granola signups through them give you 3 months free and support the site. Conversations are saved to improve recommendations — please skip anything confidential.
          </p>
        </form>
      </div>
    </section>
  )
}
