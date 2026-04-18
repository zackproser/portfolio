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
//
// Paragraphs are separated by double newlines so the simulator can split
// long text into several <p> blocks for more scroll runway.

const DEFAULT_TEXT = `The alert fired at 2:47 AM. Response times had spiked to 14 seconds across the payment service. You roll out of bed, pull the laptop onto your knees, and squint at the latency graph. The p99 jumped from 200ms to 14,000ms in under three minutes. No deploy happened in the last hour. Something changed in the environment, not the code.

You check the database connections first. Pool utilization is at 98%. Connections are being held open somewhere, starving new requests. You trace the slow queries log and see dozens of queries taking 9+ seconds each — all hitting the same table. A full table scan on the transactions table, which should never scan because there's a covering index. You check the schema and find the index is gone. You cross-reference with last night's migration. The migration author meant to rebuild the index concurrently but fat-fingered a DROP without the CREATE.

You draft the fix with the pager still vibrating. CREATE INDEX CONCURRENTLY, so production writes aren't blocked while the index rebuilds. You triple-check the statement — there is no undo button on a production database at 2 AM. You run it, then watch the monitor. The p99 latency doesn't move for 30 seconds. Then it starts to drop. 14 seconds. 8 seconds. 3 seconds. 400ms. The pager goes silent. Traffic recovers. You exhale for the first time in forty minutes.

You document everything while the context is still hot: the query plan before and after, the migration diff, the timeline, the decisions. You tag the original migration PR with a link to the incident report. You add a check to the CI pipeline so an index drop can never ship without an explicit reviewer approval again. You close the laptop at 4:12 AM. The ceiling is still dark. You know you won't sleep, but the system is stable. Everyone else will wake up and never know.`

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

  // Scroll-derived progress (0–100). No remapping; distraction thresholds
  // are tuned to the scroll directly. First ~30% of scroll is clean; after
  // that every distraction type ramps in as a continuous function of pct so
  // the mount is smooth, not stepwise. Slower ramp than before — previous
  // version hit peak chaos by ~pct 70 and felt punishing.
  const pct = scrollActive ? scrollProgress * 100 : 0
  // Universal ramp: 0 at pct<=30, rising linearly toward 1 at pct=95.
  const t = Math.max(0, Math.min(1, (pct - 30) / 65))

  // ── Word replacement — smooth linear ramp, peaks at 55% replaced so
  // the underlying paragraph stays partially legible even at full chaos.
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
  const tokensPerParagraph = paragraphs.map((p) => p.split(/\s+/))
  const wordCount = tokensPerParagraph.reduce((acc, p) => acc + p.length, 0)

  const replaceRatio = t * 0.55
  const replacedIndices = pickIndices(wordCount, Math.floor(wordCount * replaceRatio), 42)
  const replacedSet = new Set(replacedIndices)

  // Render each paragraph, keyed off a running global word index so
  // replaced-word selections stay stable across paragraphs.
  let globalWordIdx = 0
  const renderedParagraphs: ReactNode[] = tokensPerParagraph.map((tokens, pi) => {
    const nodes: ReactNode[] = []
    tokens.forEach((word, wi) => {
      const i = globalWordIdx++
      if (wi > 0) nodes.push(' ')
      if (replacedSet.has(i)) {
        const thought = intrusiveThoughts[(i * 11) % intrusiveThoughts.length]
        const color = pct > 70 ? '#fb923c' : pct > 50 ? '#f87171' : '#ef4444'
        nodes.push(
          <span key={`${pi}-${wi}`} className="font-semibold italic" style={{ color }}>
            {thought}
          </span>,
        )
      } else {
        nodes.push(<span key={`${pi}-${wi}`}>{word}</span>)
      }
    })
    return nodes
  })

  // ── Vibration — continuous ramp. Mild starts at ~45, heavy past ~75.
  let vibrateClass = ''
  if (pct > 45 && pct <= 60) vibrateClass = 'vibrate-mild'
  else if (pct > 60 && pct <= 78) vibrateClass = 'vibrate-medium'
  else if (pct > 78) vibrateClass = 'vibrate-heavy'

  // Scroll-tracking base: all overlays position themselves relative to the
  // user's current scroll position within the 128rem container, so they
  // stay in the viewport instead of scrolling off the top as new ones
  // mount below. This IS the "sticky notification pile" behavior — each
  // card's stack position follows the scroll head, so by pct=80 the user
  // is looking at a growing pile of 10+ notifications in their viewport.
  //
  // The container is ~128rem tall; we let the base travel 0 → 108rem
  // (leaving ~20rem of runway at the bottom for the reveal card).
  const stickyBaseRem = scrollProgress * 108

  // ── Notifications — slower arrival, cap at 10 visible at once so the
  // pile doesn't overwhelm. First at pct=32; spaced 5.5% apart.
  const notifVisible: { n: NotificationDef; style: React.CSSProperties }[] = []
  {
    const rand = seededRandom(7)
    const firstAt = 32
    const step = 5.5
    const maxVisible = 10
    for (let i = 0; i < Math.min(notifications.length, maxVisible); i++) {
      const threshold = firstAt + i * step
      const lane = i % 2  // 0 = right column, 1 = left column
      const row = Math.floor(i / 2)
      const rowJitter = rand() * 0.6
      const horizOffset = rand() * 2
      const rotation = (rand() - 0.5) * 4
      if (pct > threshold) {
        const ageFactor = Math.min(1, (pct - threshold) / 5)
        const rowTopRem = stickyBaseRem + 2 + row * 4.5 + rowJitter
        notifVisible.push({
          n: notifications[i],
          style: {
            [lane === 0 ? 'right' : 'left']: `${1 + horizOffset}rem`,
            top: `${rowTopRem}rem`,
            opacity: ageFactor * (pct > 90 ? 1 : 0.95),
            transform: `translateY(${(1 - ageFactor) * -24}px) rotate(${rotation}deg)`,
            transition: 'opacity 0.4s ease, transform 0.4s ease, top 0.15s linear',
          },
        })
      }
    }
  }

  // ── Thought bubbles — scroll-tracking too; scattered around the sticky
  // base so the pile looks chaotic.
  const thoughtBubbles: { text: string; style: React.CSSProperties }[] = []
  {
    const bubbleStart = 55
    const bubbleCount = Math.max(0, Math.min(8, Math.floor((pct - bubbleStart) / 6)))
    const rand = seededRandom(99)
    for (let i = 0; i < bubbleCount; i++) {
      const ownThreshold = bubbleStart + i * 6
      const age = Math.min(1, (pct - ownThreshold) / 4)
      const verticalOffset = (rand() - 0.5) * 28
      const leftPct = 5 + rand() * 70
      const duration = 2 + rand() * 2
      const topRem = stickyBaseRem + 4 + verticalOffset
      thoughtBubbles.push({
        text: intrusiveThoughts[(i * 3 + 5) % intrusiveThoughts.length],
        style: {
          top: `${topRem}rem`,
          left: `${leftPct}%`,
          animation: `float-bubble ${duration}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.2}s`,
          opacity: age,
          transition: 'top 0.15s linear',
        },
      })
    }
  }

  // ── Memory fragments — scroll-tracking too. Scattered around the base
  // so they pile into the user's viewport at peak chaos.
  const memoryItems: { frag: MemoryFragmentDef; style: React.CSSProperties }[] = []
  {
    const memStart = 70
    const count = Math.max(0, Math.min(7, Math.floor((pct - memStart) / 4)))
    const rand = seededRandom(31)
    for (let i = 0; i < count; i++) {
      const ownThreshold = memStart + i * 4
      const age = Math.min(1, (pct - ownThreshold) / 4)
      const frag = memoryFragments[i % memoryFragments.length]
      const size = 80 + rand() * 80
      const rotation = (rand() - 0.5) * 30
      const verticalOffset = (rand() - 0.5) * 36
      const leftPct = 2 + rand() * 85
      const duration = 3 + rand() * 3
      const topRem = stickyBaseRem + 3 + verticalOffset
      memoryItems.push({
        frag,
        style: {
          top: `${topRem}rem`,
          left: `${leftPct}%`,
          width: `${size}px`,
          '--rot': `rotate(${rotation}deg)`,
          animation: `drift ${duration}s ease-in-out infinite alternate`,
          animationDelay: `${i * 0.15}s`,
          opacity: age,
          transition: 'top 0.15s linear',
        } as React.CSSProperties,
      })
    }
  }

  // Reveal appears earlier (pct > 65) and scroll-tracks in the user's
  // viewport so they actually have time to read it instead of zipping past
  // a card nailed to the bottom of the container.
  const showReveal = pct > 65
  const revealTopRem = stickyBaseRem + 14  // a bit below the thickest pile of distractions

  // Color interpolation — container background and text stay bright white
  // until pct=25, then fade smoothly into the chaos palette. Using `t`
  // (shared ramp) means background darkening mounts in sync with every
  // other distraction type.
  const lerp = (a: number, b: number, tt: number) => a + (b - a) * tt
  const lerp3 = (a: number[], b: number[], tt: number) => [
    lerp(a[0], b[0], tt),
    lerp(a[1], b[1], tt),
    lerp(a[2], b[2], tt),
  ]
  const rgb = (c: number[]) => `rgb(${c[0] | 0}, ${c[1] | 0}, ${c[2] | 0})`
  // Pure white at rest — matches the NT / pre-start card exactly, so the
  // only thing that visually shifts as the user scrolls is the load
  // building on top. No ambient gray tint. Ever.
  const bgLight = [255, 255, 255]
  const bgMid = [80, 30, 110]
  const bgDark = [8, 2, 20]
  const bg = t < 0.5
    ? lerp3(bgLight, bgMid, t / 0.5)
    : lerp3(bgMid, bgDark, (t - 0.5) / 0.5)
  const textLight = [24, 24, 27]   // zinc-900
  const textMid = [190, 190, 200]  // mid-gray (peak overwhelm)
  const textDark = [110, 100, 130] // dim zinc-500-ish
  const textColor = t < 0.5
    ? lerp3(textLight, textMid, t / 0.5)
    : lerp3(textMid, textDark, (t - 0.5) / 0.5)
  const borderOpacity = Math.min(0.3, 0.05 + t * 0.5)

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

  // Reset any in-progress demo when the user switches modes, so clicking
  // between NT and ND always returns to a known preview state instead of
  // leaking scroll progress (or a stale `started` flag) across modes.
  const switchMode = (m: ViewMode) => {
    setViewMode(m)
    setStarted(false)
    setScrollProgress(0)
  }

  // Controls bar — dark pill that reads clearly on both light and dark
  // page backgrounds. Shared across preview + chaos states.
  const controls = (
    <div className="mb-4 flex flex-wrap items-center justify-center gap-3 text-sm font-mono">
      <div className="flex overflow-hidden rounded-full border border-zinc-700 bg-zinc-900 shadow-lg">
        {(['nt', 'nd'] as const).map((m) => {
          const selected = viewMode === m
          return (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              className={`px-4 py-2 font-semibold transition-colors ${
                selected
                  ? m === 'nt'
                    ? 'bg-teal-500 text-white'
                    : 'bg-orange-500 text-white'
                  : 'bg-transparent text-zinc-200 hover:bg-zinc-800'
              }`}
            >
              {m === 'nt' ? 'Read as Neurotypical' : 'Read as ADHD'}
            </button>
          )
        })}
      </div>
      {viewMode === 'nd' && !started && (
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="rounded-full border border-orange-400 bg-orange-500 px-4 py-2 font-semibold text-white shadow-[0_0_16px_rgba(249,115,22,0.5)] transition-transform hover:scale-[1.02]"
        >
          ▶ Start demo — then scroll slowly
        </button>
      )}
      {viewMode === 'nd' && started && (
        <button
          type="button"
          onClick={() => {
            setStarted(false)
            setScrollProgress(0)
          }}
          className="rounded-full border border-zinc-500 bg-zinc-100 px-3 py-2 text-zinc-800 hover:bg-zinc-200 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700"
        >
          ↺ reset
        </button>
      )}
    </div>
  )

  // Pre-start state (ND mode not yet started) OR NT mode: render a clean,
  // readable paragraph so the user can experience what the passage is
  // actually saying before (or without) the distractions. Both modes use a
  // light "normal reading" background — the point is that NT reading and
  // pre-demo ND reading look IDENTICAL; the difference only shows up once
  // you start the ND demo and scroll.
  if (!started || viewMode === 'nt') {
    const isNt = viewMode === 'nt'
    return (
      <div className="my-8">
        {controls}
        <div
          className="rounded-2xl border border-zinc-200 px-8 py-10 md:px-14"
          style={{ backgroundColor: '#ffffff' }}
        >
          <div className="mx-auto max-w-[42rem] space-y-5 text-base leading-loose md:text-lg">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-zinc-900">
                {p}
              </p>
            ))}
          </div>
          {isNt ? (
            <p className="mx-auto mt-8 max-w-[42rem] text-sm font-mono text-zinc-600">
              This is what reading feels like with an intact prefrontal
              cortex: linear, sustained, uninterrupted. Toggle to{' '}
              <span className="font-semibold text-orange-600">Read as ADHD</span> and
              click <span className="font-semibold text-orange-600">Start demo</span>{' '}
              to see what the same passage feels like to my brain.
            </p>
          ) : (
            <p className="mx-auto mt-8 max-w-[42rem] text-sm font-mono text-zinc-600">
              Above is the passage as it would read to a neurotypical
              brain. Click{' '}
              <span className="font-semibold text-orange-600">▶ Start demo</span>{' '}
              and then scroll slowly — the first third of the scroll stays
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
      `}</style>

      <div className="my-8">
        {controls}

      <div
        ref={containerRef}
        className="relative my-4 overflow-hidden rounded-2xl px-8 py-12 md:px-14 transition-colors duration-150"
        style={{
          // Long runway so the distraction ramp has room to mount one
          // element at a time instead of hitting the user all at once.
          height: '128rem',
          backgroundColor: rgb(bg),
          borderWidth: '1px',
          // Border interpolates from zinc-200 at rest (visible on white) to
          // white-alpha at chaos peak (visible on dark).
          borderColor: t < 0.3
            ? `rgba(212, 212, 216, ${1 - t / 0.3})`
            : `rgba(255, 255, 255, ${borderOpacity})`,
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
        <div className={`relative z-10 mx-auto max-w-[42rem] space-y-6 pr-24 ${vibrateClass}`}>
          {renderedParagraphs.map((nodes, pi) => (
            <p
              key={pi}
              className="text-base leading-loose md:text-lg"
              style={{ color: rgb(textColor) }}
            >
              {nodes}
            </p>
          ))}
        </div>

        {/* Progress bar along bottom */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-orange-500/60 transition-all duration-150"
          style={{ width: `${pct}%` }}
        />

        {/* Reveal — scroll-sticky so it floats in the user's viewport from
            pct=65 onward, giving them plenty of time to read it as the
            chaos continues mounting around it. */}
        <div
          className="absolute left-8 right-8 z-40 transition-opacity duration-500"
          style={{
            top: `${revealTopRem}rem`,
            opacity: showReveal ? 1 : 0,
          }}
        >
          <div className="mx-auto max-w-[40rem] rounded-xl border border-orange-400/50 bg-black/85 px-6 py-4 shadow-[0_0_40px_rgba(249,115,22,0.3)] backdrop-blur-md">
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
