'use client'

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

// ─── Content defaults ─────────────────────────────────────────────────────
// These are defaults used when no props are passed — the component is
// reusable across posts by overriding `text`, `intrusiveThoughts`,
// `notifications`, and `memoryFragments`.

const DEFAULT_TEXT = `The alert fired at 2:47 AM. Response times had spiked to 14 seconds across the payment service. You pull up the dashboard, squinting at the latency graph. The p99 jumped from 200ms to 14,000ms in under three minutes. No deploy happened. You check the database connections — pool utilization is at 98%. Something is holding connections open. You trace the slow queries log and find a full table scan on the transactions table. An index was dropped during last night's migration. The ORM generated a query plan that bypassed the covering index entirely. You draft the fix: recreate the index, but you need to do it concurrently to avoid locking the table in production. You run CREATE INDEX CONCURRENTLY and watch the p99 start to drop. 14 seconds. 8 seconds. 3 seconds. 400ms. The pager goes silent. You document the incident, tag the migration PR, and add a check to the CI pipeline so an index drop can never ship without explicit approval again.`

const DEFAULT_INTRUSIVE_THOUGHTS = [
  'why did they say that shit to me',
  'why did I say that in the meeting',
  'they must hate me by now',
  'am I the asshole here',
  'that was so fucking cringe',
  'everyone saw me stumble on that word',
  "they're judging me right now",
  'I came across as a fraud',
  'did I sound stupid on the call',
  'why am I like this',
  'I should have said it differently',
  "I'm a fuckup",
  "I can't do anything right",
  "why can't I just focus",
  'everyone else has their shit together',
  'I should be further along by now',
  'did I lock the door',
  'is the stove on',
  'what if I get fired over this',
  "I haven't called my mom in weeks",
  'am I a bad parent',
  'that email from three weeks ago',
  'I need to reply to them',
  'I should be exercising',
  'that song from 2013',
  'that thing I said in 2014',
  'what was I doing',
  'why did I open this tab',
  'is that mole cancer',
  'the mortgage is due',
  'did I remember to feed the cat',
  'what if the plane crashes',
  'I should have gone to therapy',
  'that friendship that just faded',
  'they stopped texting me back',
]

type NotificationDef = {
  app: string
  title: string
  body: string
  accent: string
  emoji: string
}

const DEFAULT_NOTIFICATIONS: NotificationDef[] = [
  { app: 'Slack',        title: '#general',              body: 'Hey are you coming to the…',               accent: 'from-purple-500 to-pink-500', emoji: '💬' },
  { app: 'iMessage',     title: 'Mom',                   body: 'can you call me when you get a sec',       accent: 'from-green-400 to-emerald-500', emoji: '💬' },
  { app: 'Gmail',        title: 'IRS Notice',            body: 'Action required on your tax return',       accent: 'from-red-500 to-orange-500', emoji: '✉️' },
  { app: 'Calendar',     title: 'In 5 min',              body: '1:1 with manager (you haven\'t prepped)',  accent: 'from-blue-400 to-indigo-500', emoji: '📅' },
  { app: 'Calendar',     title: 'LATE · 14 min ago',     body: 'team standup — you missed it',             accent: 'from-red-400 to-rose-500', emoji: '⏰' },
  { app: 'Battery',      title: 'Low Power Mode',        body: '10% remaining',                            accent: 'from-yellow-400 to-amber-500', emoji: '🔋' },
  { app: 'Amazon',       title: 'Delivered',             body: 'The thing you forgot you ordered',         accent: 'from-orange-400 to-amber-500', emoji: '📦' },
  { app: 'Ring',         title: 'Front Door',            body: 'Motion detected',                          accent: 'from-sky-400 to-cyan-500', emoji: '🔔' },
  { app: 'Venmo',        title: 'Friend requested $45',  body: 'from dinner last month',                   accent: 'from-sky-300 to-blue-500', emoji: '💸' },
  { app: 'Photos',       title: 'On this day',           body: '3 memories from 2018',                     accent: 'from-pink-400 to-fuchsia-500', emoji: '📸' },
  { app: 'Weather',      title: 'Severe Alert',          body: 'Thunderstorm warning in your area',        accent: 'from-slate-400 to-gray-600', emoji: '⛈️' },
  { app: 'Twitter',      title: '@zackproser',           body: 'Someone replied to your tweet',            accent: 'from-blue-400 to-sky-500', emoji: '🐦' },
  { app: 'Twitch',       title: 'Live now',              body: 'streamer you follow is live',              accent: 'from-violet-500 to-purple-600', emoji: '📺' },
  { app: 'Google Pay',   title: '$124.50 charged',       body: 'Whole Foods · 12:41 AM',                   accent: 'from-green-300 to-teal-500', emoji: '💳' },
  { app: 'Apple News',   title: 'Breaking',              body: 'An unrelated national tragedy',            accent: 'from-red-500 to-rose-600', emoji: '📰' },
  { app: 'Zoom',         title: 'Recording ready',       body: 'from yesterday\'s call',                    accent: 'from-blue-400 to-indigo-600', emoji: '🎥' },
]

type MemoryFragmentDef = { emoji: string; label: string; tint: string }
const DEFAULT_MEMORY_FRAGMENTS: MemoryFragmentDef[] = [
  { emoji: '📸', label: '2018 wedding',           tint: 'from-rose-400/60 to-pink-600/60' },
  { emoji: '🎂', label: "dad's 65th",             tint: 'from-amber-400/60 to-orange-600/60' },
  { emoji: '🏃',  label: "5k I DNF'd",             tint: 'from-emerald-400/60 to-teal-600/60' },
  { emoji: '🎸', label: 'that song · 2013',       tint: 'from-violet-400/60 to-purple-600/60' },
  { emoji: '🚗', label: 'the accident',           tint: 'from-red-400/60 to-rose-600/60' },
  { emoji: '💔', label: 'the breakup',            tint: 'from-pink-400/60 to-fuchsia-600/60' },
  { emoji: '📧', label: 'email never sent',       tint: 'from-slate-400/60 to-zinc-600/60' },
  { emoji: '🐛', label: '3-day bug',              tint: 'from-lime-400/60 to-green-600/60' },
  { emoji: '🎓', label: 'graduation day',         tint: 'from-blue-400/60 to-indigo-600/60' },
  { emoji: '💸', label: 'overdraft · 2019',       tint: 'from-green-400/60 to-emerald-600/60' },
  { emoji: '👨‍👧', label: 'her first steps',        tint: 'from-orange-300/60 to-amber-500/60' },
  { emoji: '🚑', label: 'ER at 4 AM',             tint: 'from-red-500/60 to-rose-700/60' },
  { emoji: '📞', label: 'the call from work',     tint: 'from-sky-400/60 to-blue-600/60' },
  { emoji: '🍾', label: 'funded · 2021',          tint: 'from-yellow-300/60 to-amber-500/60' },
  { emoji: '🧍', label: 'alone at the party',     tint: 'from-violet-300/60 to-indigo-500/60' },
  { emoji: '🫣', label: 'what I said in \'19',     tint: 'from-fuchsia-400/60 to-pink-600/60' },
]

const REVEAL_TEXT =
  "This is what reading feels like with ADHD. Every word costs energy you don't see."

// ─── Helpers ──────────────────────────────────────────────────────────────

function seededRandom(seed: number): () => number {
  let s = seed || 1
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function pickIndices(wordCount: number, count: number, seed: number): number[] {
  const rand = seededRandom(seed)
  const indices = new Set<number>()
  let attempts = 0
  while (indices.size < count && attempts < count * 4) {
    indices.add(Math.floor(rand() * wordCount))
    attempts++
  }
  return Array.from(indices)
}

// ─── Sub-components ───────────────────────────────────────────────────────

function NotificationCard({
  n,
  style,
}: {
  n: NotificationDef
  style: React.CSSProperties
}) {
  return (
    <div
      className="pointer-events-none absolute z-30 flex w-72 items-start gap-3 rounded-xl border border-white/10 bg-zinc-900/90 p-3 shadow-2xl backdrop-blur-xl"
      style={style}
    >
      <div
        className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${n.accent} text-sm`}
      >
        {n.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-zinc-100">
          {n.app} — <span className="text-zinc-300">{n.title}</span>
        </p>
        <p className="truncate text-xs text-zinc-400">{n.body}</p>
      </div>
    </div>
  )
}

function MemoryFragment({
  frag,
  style,
}: {
  frag: MemoryFragmentDef
  style: React.CSSProperties
}) {
  return (
    <div
      className={`pointer-events-none absolute z-20 flex flex-col items-center justify-center gap-1 rounded-lg border border-white/10 bg-gradient-to-br ${frag.tint} px-3 py-2 shadow-xl backdrop-blur-[2px]`}
      style={style}
    >
      <span className="text-2xl leading-none">{frag.emoji}</span>
      <span className="text-[10px] font-mono font-semibold text-white/90">{frag.label}</span>
    </div>
  )
}

function ThoughtBubble({
  text,
  style,
}: {
  text: string
  style: React.CSSProperties
}) {
  return (
    <span
      className="thought-bubble pointer-events-none absolute z-20 whitespace-nowrap rounded-full bg-orange-500/25 px-3 py-1 text-xs font-medium text-orange-200 backdrop-blur-sm"
      style={style}
    >
      {text}
    </span>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────

type ViewMode = 'nt' | 'nd'

export type DistractionSimulatorProps = {
  /** The clean paragraph shown at baseline and deteriorated over scroll. */
  text?: string
  /** Pool of intrusive thoughts that replace words + float as bubbles. */
  intrusiveThoughts?: string[]
  /** Notification cards that stack onto the page as chaos escalates. */
  notifications?: NotificationDef[]
  /** Memory-fragment tiles that drift across the page at peak overwhelm. */
  memoryFragments?: MemoryFragmentDef[]
  /** Final takeaway line shown after the scroll completes. */
  revealText?: string
}

export function DistractionSimulator({
  text = DEFAULT_TEXT,
  intrusiveThoughts = DEFAULT_INTRUSIVE_THOUGHTS,
  notifications = DEFAULT_NOTIFICATIONS,
  memoryFragments = DEFAULT_MEMORY_FRAGMENTS,
  revealText = REVEAL_TEXT,
}: DistractionSimulatorProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('nd')
  const [started, setStarted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleScroll = useCallback(() => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const windowH = window.innerHeight
    const total = rect.height + windowH
    const traveled = windowH - rect.top
    const progress = Math.min(1, Math.max(0, traveled / total))
    setScrollProgress(progress)
  }, [])

  // Only track scroll after the demo has been started in ND mode.
  const scrollActive = started && viewMode === 'nd' && !isMobile

  useEffect(() => {
    const el = containerRef.current
    if (!el || !scrollActive || !mounted) return

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
  }, [handleScroll, scrollActive, mounted])

  // Raw scroll (0-100). Remap so the first 30% of scroll stays pristine —
  // no effects fire until past 30% — then 30-100 → 0-100 so the ramp is
  // fully expressed across the remaining scroll range.
  const rawPct = scrollProgress * 100
  const pct = scrollActive
    ? rawPct <= 30
      ? 0
      : Math.min(100, ((rawPct - 30) / 70) * 100)
    : 0

  // ── Word replacement — aggressive ramp
  const words = text.split(' ')
  const wordCount = words.length
  let replaceRatio = 0
  if (pct > 10 && pct <= 25) replaceRatio = 0.08
  else if (pct > 25 && pct <= 40) replaceRatio = 0.22
  else if (pct > 40 && pct <= 55) replaceRatio = 0.4
  else if (pct > 55 && pct <= 70) replaceRatio = 0.6
  else if (pct > 70) replaceRatio = 0.8
  const replacedIndices = pickIndices(wordCount, Math.floor(wordCount * replaceRatio), 42)
  const replacedSet = new Set(replacedIndices)

  const renderedWords: ReactNode[] = words.map((word, i) => {
    if (replacedSet.has(i)) {
      const thought = intrusiveThoughts[(i * 7) % intrusiveThoughts.length]
      const color =
        pct > 70 ? '#fb923c' : pct > 50 ? '#f87171' : '#ef4444'
      return (
        <span key={i} className="font-semibold italic" style={{ color }}>
          {thought}
        </span>
      )
    }
    return <span key={i}>{word}</span>
  })

  // ── Vibration
  let vibrateClass = ''
  if (pct > 25 && pct <= 45) vibrateClass = 'vibrate-mild'
  else if (pct > 45 && pct <= 65) vibrateClass = 'vibrate-medium'
  else if (pct > 65) vibrateClass = 'vibrate-heavy'

  // ── Notification stack — scales with scroll, accumulates downward
  // Each notification has a "spawn threshold" — once pct passes it, the card
  // is visible. Later cards stack on top of earlier ones with slight offsets.
  const notifVisible: { n: NotificationDef; style: React.CSSProperties }[] = []
  {
    const rand = seededRandom(7)
    for (let i = 0; i < notifications.length; i++) {
      const threshold = 10 + i * 5 // first notif at 10%, last around 85%
      if (pct > threshold) {
        const ageFactor = Math.min(1, (pct - threshold) / 20) // fade in
        const lane = i % 2 // two columns: 0=right, 1=left
        const row = Math.floor(i / 2)
        const top = 6 + row * 7.5 + rand() * 2
        const horizOffset = rand() * 2
        notifVisible.push({
          n: notifications[i],
          style: {
            [lane === 0 ? 'right' : 'left']: `${1 + horizOffset}rem`,
            top: `${top}%`,
            opacity: ageFactor * (pct > 90 ? 1 : 0.95),
            transform: `translateY(${(1 - ageFactor) * -24}px) rotate(${(rand() - 0.5) * 4}deg)`,
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          },
        })
      }
    }
  }

  // ── Thought bubbles (orange pill overlays)
  const thoughtBubbles: { text: string; style: React.CSSProperties }[] = []
  if (pct > 35) {
    const bubbleCount = pct > 80 ? 10 : pct > 60 ? 6 : 3
    const rand = seededRandom(99)
    for (let i = 0; i < bubbleCount; i++) {
      thoughtBubbles.push({
        text: intrusiveThoughts[(i * 3 + 5) % intrusiveThoughts.length],
        style: {
          top: `${10 + rand() * 75}%`,
          left: `${5 + rand() * 70}%`,
          animation: `float-bubble ${2 + rand() * 2}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.2}s`,
        },
      })
    }
  }

  // ── Memory fragments — colored tilted boxes from 55% onward
  const memoryItems: { frag: MemoryFragmentDef; style: React.CSSProperties }[] = []
  if (pct > 55) {
    const count = pct > 90 ? 14 : pct > 75 ? 9 : pct > 65 ? 5 : 2
    const rand = seededRandom(31)
    for (let i = 0; i < count; i++) {
      const frag = memoryFragments[i % memoryFragments.length]
      const size = 80 + rand() * 80 // 80-160 px wide
      const rotation = (rand() - 0.5) * 30
      memoryItems.push({
        frag,
        style: {
          top: `${5 + rand() * 85}%`,
          left: `${2 + rand() * 85}%`,
          width: `${size}px`,
          '--rot': `rotate(${rotation}deg)`,
          animation: `drift ${3 + rand() * 3}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.15}s`,
          opacity: Math.min(1, (pct - 55) / 25),
        } as React.CSSProperties,
      })
    }
  }

  const showReveal = pct > 90

  // Color interpolation — container background and text fade from normal
  // paragraph (light bg, dark text) into chaos (dark bg, dim text) as scroll
  // advances. Splits at 50% so the mid is an ominous purple.
  const tScroll = pct / 100
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t
  const lerp3 = (a: number[], b: number[], t: number) => [
    lerp(a[0], b[0], t),
    lerp(a[1], b[1], t),
    lerp(a[2], b[2], t),
  ]
  const rgb = (c: number[]) => `rgb(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0})`
  const bgLight = [252, 252, 252]
  const bgMid = [80, 30, 110]
  const bgDark = [8, 2, 20]
  const bg = tScroll < 0.5
    ? lerp3(bgLight, bgMid, tScroll / 0.5)
    : lerp3(bgMid, bgDark, (tScroll - 0.5) / 0.5)
  const textLight = [24, 24, 27]   // zinc-900
  const textMid = [190, 190, 200]  // mid-gray (peak overwhelm)
  const textDark = [110, 100, 130] // dim zinc-500-ish
  const textColor = tScroll < 0.5
    ? lerp3(textLight, textMid, tScroll / 0.5)
    : lerp3(textMid, textDark, (tScroll - 0.5) / 0.5)
  const borderOpacity = Math.min(0.3, 0.05 + tScroll * 0.6)

  if (!mounted) return null

  if (isMobile) {
    return (
      <div className="my-8 rounded-2xl bg-zinc-900/50 p-6">
        <p className="mb-4 text-sm leading-relaxed text-zinc-300">
          {text.slice(0, 200)}…
        </p>
        <p className="mb-3 text-sm text-zinc-500">
          On desktop, scroll through this section slowly — the paragraph
          progressively breaks down under intrusive thoughts, stacked
          notifications, and memory fragments until the underlying text is
          almost unreadable. That&apos;s what reading with ADHD feels like.
        </p>
        <p className="border-t border-zinc-700 pt-4 text-base font-medium text-orange-400">
          {revealText}
        </p>
      </div>
    )
  }

  // Controls bar — shared across all demo states. Mode toggle + start/reset.
  const controls = (
    <div className="mb-3 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
      <div className="flex overflow-hidden rounded-full border border-white/15 bg-black/20">
        {(['nt', 'nd'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setViewMode(m)
              if (m === 'nt') setStarted(true)
            }}
            className={`px-4 py-1.5 transition-colors ${
              viewMode === m
                ? 'bg-orange-500/80 text-white'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {m === 'nt' ? 'Read as Neurotypical' : 'Read as ADHD'}
          </button>
        ))}
      </div>
      {viewMode === 'nd' && !started && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="rounded-full border border-orange-400/60 bg-orange-500/20 px-4 py-1.5 font-semibold text-orange-200 shadow-[0_0_16px_rgba(249,115,22,0.35)] transition-all hover:bg-orange-500/30"
        >
          ▶ Start demo — scroll slowly
        </button>
      )}
      {viewMode === 'nd' && started && (
        <button
          type="button"
          onClick={() => {
            setStarted(false)
            setScrollProgress(0)
          }}
          className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-zinc-300 hover:border-white/40 hover:text-white"
        >
          reset
        </button>
      )}
    </div>
  )

  // Pre-start state (ND mode not yet started) OR NT mode: render a clean,
  // readable paragraph so the user can experience what the passage is
  // actually saying before (or without) the distractions.
  if (!started || viewMode === 'nt') {
    const isNt = viewMode === 'nt'
    return (
      <div className="my-8">
        {controls}
        <div
          className={`rounded-2xl px-8 py-10 md:px-14 border ${
            isNt
              ? 'border-teal-400/30 bg-gradient-to-b from-[#0a1820] to-[#0a1416]'
              : 'border-white/10 bg-[#f8f8fa]'
          }`}
        >
          <p
            className={`mx-auto max-w-[42rem] text-base leading-loose md:text-lg ${
              isNt ? 'text-teal-100' : 'text-zinc-800'
            }`}
          >
            {text}
          </p>
          {isNt ? (
            <p className="mx-auto mt-6 max-w-[42rem] text-sm font-mono text-teal-300/70">
              This is what reading a technical paragraph feels like with an
              intact prefrontal cortex: linear, sustained, uninterrupted.
              Now toggle to <span className="font-semibold text-teal-200">Read as ADHD</span> and
              click <span className="font-semibold text-teal-200">Start demo</span>.
            </p>
          ) : (
            <p className="mx-auto mt-6 max-w-[42rem] text-sm font-mono text-zinc-500">
              Above is the paragraph as it would read to a neurotypical
              brain. Click <span className="font-semibold text-orange-500">▶ Start demo</span>{' '}
              and then scroll slowly — the first 30% of the scroll stays
              normal, then the ADHD load begins accumulating.
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <style>{`
        @keyframes vibrate-mild {
          0% { transform: translate(0, 0); }
          25% { transform: translate(0.5px, -0.5px); }
          50% { transform: translate(-0.5px, 0.5px); }
          75% { transform: translate(0.5px, 0.5px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes vibrate-medium {
          0% { transform: translate(0, 0); }
          25% { transform: translate(1px, -1px); }
          50% { transform: translate(-1px, 1px); }
          75% { transform: translate(0.5px, 0.5px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes vibrate-heavy {
          0% { transform: translate(0, 0); }
          20% { transform: translate(-2px, 1px); }
          40% { transform: translate(2px, -2px); }
          60% { transform: translate(-1px, 2px); }
          80% { transform: translate(2px, 1px); }
          100% { transform: translate(0, 0); }
        }
        @keyframes float-bubble {
          0% { transform: translateY(0) scale(1); opacity: 0.85; }
          100% { transform: translateY(-14px) scale(1.06); opacity: 1; }
        }
        @keyframes drift {
          0% { transform: translate(0, 0) var(--rot, rotate(0deg)); }
          100% { transform: translate(4px, -6px) var(--rot, rotate(0deg)); }
        }
        .vibrate-mild { animation: vibrate-mild 0.09s linear infinite; }
        .vibrate-medium { animation: vibrate-medium 0.06s linear infinite; }
        .vibrate-heavy { animation: vibrate-heavy 0.04s linear infinite; }
        .thought-bubble { animation: float-bubble 3s ease-in-out infinite alternate; }
      `}</style>

      <div className="my-8">
        {controls}

      <div
        ref={containerRef}
        className="relative my-4 overflow-hidden rounded-2xl px-8 py-12 md:px-14 transition-colors duration-150"
        style={{
          height: '60rem',
          backgroundColor: rgb(bg),
          borderWidth: '1px',
          borderColor: `rgba(255,255,255,${borderOpacity})`,
        }}
      >
        {/* Noise overlay (very subtle) */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{
            backgroundImage:
              'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0.5px, transparent 0.5px)',
            backgroundSize: '4px 4px',
          }}
        />

        {/* Memory fragment overlay — emerges as chaos peaks */}
        {memoryItems.map((m, i) => (
          <MemoryFragment key={`mem-${i}`} frag={m.frag} style={m.style} />
        ))}

        {/* Stacked notifications */}
        {notifVisible.map((entry, i) => (
          <NotificationCard key={`n-${i}`} n={entry.n} style={entry.style} />
        ))}

        {/* Thought bubbles */}
        {thoughtBubbles.map((b, i) => (
          <ThoughtBubble key={`t-${i}`} text={b.text} style={b.style} />
        ))}

        {/* Main text block */}
        <div className={`relative z-10 mx-auto max-w-[42rem] pr-24 ${vibrateClass}`}>
          <p className="text-base leading-loose md:text-lg" style={{ color: rgb(textColor) }}>
            {renderedWords.reduce<ReactNode[]>((acc, node, i) => {
              if (i > 0) acc.push(' ')
              acc.push(node)
              return acc
            }, [])}
          </p>
        </div>

        {/* Progress bar along bottom */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-orange-500/60 transition-all duration-150"
          style={{ width: `${pct}%` }}
        />

        {/* Reveal */}
        <div
          className="absolute bottom-10 left-8 right-8 z-40 transition-all duration-700"
          style={{
            opacity: showReveal ? 1 : 0,
            transform: showReveal ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <div className="mx-auto max-w-[40rem] rounded-xl border border-orange-400/30 bg-black/80 px-6 py-4 backdrop-blur-md">
            <p className="text-center text-lg font-medium leading-relaxed text-orange-300 md:text-xl">
              {revealText}
            </p>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}
