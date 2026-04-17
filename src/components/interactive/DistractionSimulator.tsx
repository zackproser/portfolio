'use client'

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

// --- Constants ---

const ORIGINAL_TEXT = `The alert fired at 2:47 AM. Response times had spiked to 14 seconds across the payment service. You pull up the dashboard, squinting at the latency graph. The p99 jumped from 200ms to 14,000ms in under three minutes. No deploy happened. You check the database connections — pool utilization is at 98%. Something is holding connections open. You trace the slow queries log and find a full table scan on the transactions table. An index was dropped during last night's migration. The ORM generated a query plan that bypassed the covering index entirely. You draft the fix: recreate the index, but you need to do it concurrently to avoid locking the table in production. You run CREATE INDEX CONCURRENTLY and watch the p99 start to drop. 14 seconds. 8 seconds. 3 seconds. 400ms. The pager goes silent. You document the incident, tag the migration PR, and add a check to the CI pipeline so an index drop can never ship without explicit approval again.`

const INTRUSIVE_THOUGHTS = [
  'did I lock the door',
  'that song from 2013',
  'is the stove on',
  'reply to that email',
  'what time is pickup',
  'I should exercise more',
  'that thing I said in 2014',
  'did I pay rent',
  'call the dentist',
  'why did I open this tab',
  'what was I doing',
  'I need groceries',
]

const VISUAL_AUDIO_CUES = ['🔔', '💬', '📱', '🎵']

const AUDIO_LABELS = ['🔔 ding', '💬 buzz', '📱 vibrate', '🎵 playing']

const REVEAL_TEXT =
  'This is what reading feels like with ADHD. Every word costs energy you don\'t see.'

// --- Helpers ---

/** Deterministic pseudo-random from seed so replacements are stable per scroll band */
function seededRandom(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return (s - 1) / 2147483646
  }
}

function pickIndices(
  wordCount: number,
  count: number,
  seed: number,
): number[] {
  const rand = seededRandom(seed)
  const indices = new Set<number>()
  let attempts = 0
  while (indices.size < count && attempts < count * 4) {
    indices.add(Math.floor(rand() * wordCount))
    attempts++
  }
  return Array.from(indices)
}

// --- Sub-components ---

interface NotificationProps {
  visible: boolean
}

function FakeNotification({ visible }: NotificationProps) {
  return (
    <div
      className="pointer-events-none absolute right-4 top-4 z-30 flex w-72 items-start gap-3 rounded-xl border border-white/10 bg-zinc-800/80 p-3 shadow-2xl backdrop-blur-xl transition-all duration-500"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-120%)',
        opacity: visible ? 1 : 0,
      }}
    >
      <div className="mt-0.5 h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-zinc-200">
          Slack — #general
        </p>
        <p className="truncate text-xs text-zinc-400">
          Hey are you coming to the...
        </p>
      </div>
    </div>
  )
}

interface ThoughtBubbleProps {
  text: string
  style: React.CSSProperties
}

function ThoughtBubble({ text, style }: ThoughtBubbleProps) {
  return (
    <span
      className="thought-bubble pointer-events-none absolute z-20 whitespace-nowrap rounded-full bg-orange-500/20 px-3 py-1 text-xs font-medium text-orange-300 backdrop-blur-sm"
      style={style}
    >
      {text}
    </span>
  )
}

interface MarginCueProps {
  emoji: string
  side: 'left' | 'right'
  topPercent: number
  visible: boolean
  delay: number
}

function MarginCue({ emoji, side, topPercent, visible, delay }: MarginCueProps) {
  return (
    <span
      className="margin-cue pointer-events-none absolute z-20 text-lg"
      style={{
        [side]: side === 'left' ? '-2rem' : '-2rem',
        top: `${topPercent}%`,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.4s ease ${delay}ms`,
        animationDelay: `${delay}ms`,
      }}
    >
      {emoji}
    </span>
  )
}

// --- Main Component ---

export function DistractionSimulator() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Mobile detection
  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Scroll progress via IntersectionObserver + scroll listener
  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const windowH = window.innerHeight
    // 0 when top of element hits bottom of viewport
    // 1 when bottom of element hits top of viewport
    const total = rect.height + windowH
    const traveled = windowH - rect.top
    const progress = Math.min(1, Math.max(0, traveled / total))
    setScrollProgress(progress)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || isMobile) return

    // Use IntersectionObserver to know when to attach/detach scroll listener
    let listening = false
    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries.some((e) => e.isIntersecting)
        if (isVisible && !listening) {
          window.addEventListener('scroll', handleScroll, { passive: true })
          listening = true
          handleScroll()
        } else if (!isVisible && listening) {
          window.removeEventListener('scroll', handleScroll)
          listening = false
        }
      },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll, isMobile])

  // Convert progress (0-1) to percentage band
  const pct = scrollProgress * 100

  // --- Build rendered words ---
  const words = ORIGINAL_TEXT.split(' ')
  const wordCount = words.length

  // Determine how many words to replace based on band
  let replaceCount = 0
  if (pct > 20 && pct <= 40) replaceCount = Math.floor(wordCount * 0.08)
  else if (pct > 40 && pct <= 60) replaceCount = Math.floor(wordCount * 0.18)
  else if (pct > 60 && pct <= 80) replaceCount = Math.floor(wordCount * 0.3)
  else if (pct > 80) replaceCount = Math.floor(wordCount * 0.5)

  const replacedIndices = pickIndices(wordCount, replaceCount, 42)
  const replacedSet = new Set(replacedIndices)

  const renderedWords: ReactNode[] = words.map((word, i) => {
    if (replacedSet.has(i)) {
      const thought = INTRUSIVE_THOUGHTS[i % INTRUSIVE_THOUGHTS.length]
      return (
        <span
          key={i}
          className="font-semibold italic"
          style={{ color: pct > 60 ? '#f97316' : '#ef4444' }}
        >
          {thought}
        </span>
      )
    }
    return <span key={i}>{word}</span>
  })

  // --- Vibration intensity ---
  let vibrateClass = ''
  if (pct > 40 && pct <= 60) vibrateClass = 'vibrate-mild'
  else if (pct > 60 && pct <= 80) vibrateClass = 'vibrate-medium'
  else if (pct > 80) vibrateClass = 'vibrate-heavy'

  // --- Notification visibility ---
  const showNotification = pct > 45

  // --- Thought overlay bubbles (60%+) ---
  const thoughtBubbles: { text: string; style: React.CSSProperties }[] = []
  if (pct > 60) {
    const bubbleCount = pct > 80 ? 6 : 3
    const rand = seededRandom(99)
    for (let i = 0; i < bubbleCount; i++) {
      thoughtBubbles.push({
        text: INTRUSIVE_THOUGHTS[(i * 3) % INTRUSIVE_THOUGHTS.length],
        style: {
          top: `${15 + rand() * 60}%`,
          left: `${5 + rand() * 70}%`,
          animation: `float-bubble ${2 + rand() * 2}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.3}s`,
        },
      })
    }
  }

  // --- Audio cue margin icons ---
  const visibleCueCount =
    pct > 80 ? 4 : pct > 60 ? 3 : pct > 50 ? 1 : 0

  // --- Reveal ---
  const showReveal = pct > 82

  // --- Mobile static fallback ---
  if (!mounted) return null

  if (isMobile) {
    return (
      <div className="my-8 rounded-2xl bg-zinc-900/50 p-6">
        <p className="mb-4 text-sm leading-relaxed text-zinc-300">
          {ORIGINAL_TEXT.slice(0, 200)}...
        </p>
        <p className="mb-3 text-sm text-zinc-500">
          On desktop, this component simulates the progressive distraction of
          reading with ADHD — intrusive thoughts replace words, text vibrates,
          notifications interrupt, and the paragraph becomes unreadable.
        </p>
        <p className="border-t border-zinc-700 pt-4 text-base font-medium text-orange-400">
          {REVEAL_TEXT}
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Inline keyframes */}
      <style>{`
        @keyframes vibrate-mild {
          0% { transform: translate(0, 0); }
          20% { transform: translate(0.5px, -0.5px); }
          40% { transform: translate(-0.5px, 0.5px); }
          60% { transform: translate(0.5px, 0.5px); }
          80% { transform: translate(-0.5px, -0.5px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes vibrate-medium {
          0% { transform: translate(0, 0); }
          10% { transform: translate(1px, -1px); }
          30% { transform: translate(-1px, 1px); }
          50% { transform: translate(1px, 0.5px); }
          70% { transform: translate(-0.5px, -1px); }
          90% { transform: translate(0.5px, 1px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes vibrate-heavy {
          0% { transform: translate(0, 0); }
          5% { transform: translate(-2px, 1px); }
          15% { transform: translate(2px, -2px); }
          25% { transform: translate(-1px, 2px); }
          35% { transform: translate(2px, 1px); }
          45% { transform: translate(-2px, -1px); }
          55% { transform: translate(1px, 2px); }
          65% { transform: translate(-2px, -2px); }
          75% { transform: translate(2px, -1px); }
          85% { transform: translate(-1px, 2px); }
          95% { transform: translate(2px, 0); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.85; }
          100% { transform: translateY(-12px) scale(1.05); opacity: 1; }
        }
        @keyframes pulse-cue {
          0%, 100% { transform: scale(1); opacity: 0.7; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        .vibrate-mild { animation: vibrate-mild 0.08s linear infinite; }
        .vibrate-medium { animation: vibrate-medium 0.06s linear infinite; }
        .vibrate-heavy { animation: vibrate-heavy 0.04s linear infinite; }
        .thought-bubble { animation: float-bubble 3s ease-in-out infinite alternate; }
        .margin-cue { animation: pulse-cue 1.5s ease-in-out infinite; }
      `}</style>

      <div
        ref={containerRef}
        className="relative my-8 overflow-hidden rounded-2xl bg-zinc-900/50 px-8 py-10 md:px-12"
        style={{ minHeight: '28rem' }}
      >
        {/* Fake macOS notification */}
        <FakeNotification visible={showNotification} />

        {/* Thought overlay bubbles */}
        {thoughtBubbles.map((b, i) => (
          <ThoughtBubble key={i} text={b.text} style={b.style} />
        ))}

        {/* Margin audio cues — left side */}
        {VISUAL_AUDIO_CUES.slice(0, visibleCueCount).map((emoji, i) => (
          <MarginCue
            key={`l-${i}`}
            emoji={emoji}
            side="left"
            topPercent={20 + i * 18}
            visible={true}
            delay={i * 200}
          />
        ))}

        {/* Margin audio cues — right side */}
        {visibleCueCount > 2 &&
          AUDIO_LABELS.slice(0, visibleCueCount - 2).map((label, i) => (
            <span
              key={`r-${i}`}
              className="margin-cue pointer-events-none absolute right-[-3rem] z-20 text-xs text-zinc-500"
              style={{
                top: `${30 + i * 20}%`,
                opacity: 1,
                animationDelay: `${i * 300}ms`,
              }}
            >
              {label}
            </span>
          ))}

        {/* Main text block */}
        <div className={`relative z-10 ${vibrateClass}`}>
          <p className="text-base leading-loose text-zinc-300 md:text-lg">
            {renderedWords.reduce<ReactNode[]>((acc, node, i) => {
              if (i > 0) acc.push(' ')
              acc.push(node)
              return acc
            }, [])}
          </p>
        </div>

        {/* Progress bar along bottom */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-orange-500/40 transition-all duration-150" style={{ width: `${pct}%` }} />

        {/* Reveal */}
        <div
          className="relative z-10 mt-8 border-t border-zinc-700/50 pt-6 transition-all duration-700"
          style={{
            opacity: showReveal ? 1 : 0,
            transform: showReveal ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <p className="text-center text-lg font-medium leading-relaxed text-orange-400 md:text-xl">
            {REVEAL_TEXT}
          </p>
        </div>
      </div>
    </>
  )
}
