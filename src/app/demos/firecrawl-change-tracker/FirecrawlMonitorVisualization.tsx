'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Timer,
  Radio,
  ChevronRight,
} from 'lucide-react'

import FirecrawlMonitorArchitecture, { type MonitorPhase } from './FirecrawlMonitorArchitecture'
import { CATEGORY_META } from './data'
import {
  type MonitoredPage,
  type ChangeEvent,
  type MonitorFrequency,
  FREQUENCY_LABEL,
  FREQUENCY_SECONDS,
  STATUS_META,
  formatTimestamp,
  formatCountdown,
} from './utils'

type Props = {
  page: MonitoredPage
  events: ChangeEvent[]
  selectedEventId: string | null
  onSelectEvent: (id: string | null) => void
  frequency: MonitorFrequency
  onFrequencyChange: (f: MonitorFrequency) => void
}

// Tone -> tailwind class maps (every color has a dark: variant).
const DOT_BG: Record<string, string> = {
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
  zinc: 'bg-zinc-400 dark:bg-zinc-600',
}

const BADGE: Record<string, string> = {
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  red: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  zinc: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
}

// The phase sequence each "check" walks through when a check fires.
const CHECK_PHASES: MonitorPhase[] = ['schedule', 'scrape', 'compare', 'diff', 'alert']

export default function FirecrawlMonitorVisualization({
  page,
  events,
  selectedEventId,
  onSelectEvent,
  frequency,
  onFrequencyChange,
}: Props) {
  // Index into events of the latest check that has "run" in the simulation.
  const [runUpTo, setRunUpTo] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [phase, setPhase] = useState<MonitorPhase>('idle')
  // Countdown (seconds) until the next check fires.
  const [countdown, setCountdown] = useState(FREQUENCY_SECONDS[frequency])

  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const phaseTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const totalChecks = events.length

  const clearPhaseTimers = useCallback(() => {
    phaseTimers.current.forEach((t) => clearTimeout(t))
    phaseTimers.current = []
  }, [])

  // Reset the whole simulation when the page or frequency changes.
  useEffect(() => {
    clearPhaseTimers()
    setRunUpTo(0)
    setIsPlaying(false)
    setPhase('idle')
    setCountdown(FREQUENCY_SECONDS[frequency])
  }, [page.id, frequency, clearPhaseTimers])

  // Animate the architecture diagram through the 5 phases, then advance the
  // check pointer and select the newly-detected event.
  const runCheck = useCallback(
    (nextIndex: number) => {
      clearPhaseTimers()
      CHECK_PHASES.forEach((p, i) => {
        const t = setTimeout(() => setPhase(p), i * 650)
        phaseTimers.current.push(t)
      })
      const settle = setTimeout(() => {
        setRunUpTo(nextIndex + 1)
        onSelectEvent(events[nextIndex].id)
        setPhase('idle')
        setCountdown(FREQUENCY_SECONDS[frequency])
      }, CHECK_PHASES.length * 650 + 400)
      phaseTimers.current.push(settle)
    },
    [clearPhaseTimers, events, frequency, onSelectEvent]
  )

  // Countdown ticker. When it hits zero (and there are more checks), run one.
  useEffect(() => {
    if (!isPlaying) {
      if (tickRef.current) clearInterval(tickRef.current)
      return
    }
    if (runUpTo >= totalChecks) {
      setIsPlaying(false)
      return
    }

    tickRef.current = setInterval(() => {
      setCountdown((prev) => {
        // Compress simulated time: drop a chunk of the interval each tick so a
        // weekly check still resolves in a few seconds on screen.
        const step = Math.max(1, Math.floor(FREQUENCY_SECONDS[frequency] / 8))
        const next = prev - step
        if (next <= 0) {
          // Fire a check on the next event.
          if (tickRef.current) clearInterval(tickRef.current)
          runCheck(runUpTo)
          return 0
        }
        return next
      })
    }, 450)

    return () => {
      if (tickRef.current) clearInterval(tickRef.current)
    }
  }, [isPlaying, runUpTo, totalChecks, frequency, runCheck])

  useEffect(() => () => clearPhaseTimers(), [clearPhaseTimers])

  const handlePlayPause = () => {
    if (runUpTo >= totalChecks) {
      // Restart from the beginning.
      setRunUpTo(0)
      setCountdown(FREQUENCY_SECONDS[frequency])
      onSelectEvent(null)
      setIsPlaying(true)
      return
    }
    setIsPlaying((p) => !p)
  }

  const handleStep = () => {
    if (runUpTo >= totalChecks) return
    setIsPlaying(false)
    runCheck(runUpTo)
  }

  const handleReset = () => {
    setIsPlaying(false)
    clearPhaseTimers()
    setRunUpTo(0)
    setPhase('idle')
    setCountdown(FREQUENCY_SECONDS[frequency])
    onSelectEvent(null)
  }

  // Events revealed so far, newest first for the feed.
  const revealedEvents = useMemo(
    () => events.slice(0, runUpTo),
    [events, runUpTo]
  )
  const feedEvents = useMemo(() => [...revealedEvents].reverse(), [revealedEvents])

  const changeCount = revealedEvents.filter((e) => e.changeStatus === 'changed').length
  const isComplete = runUpTo >= totalChecks
  const progressPct = totalChecks > 0 ? (runUpTo / totalChecks) * 100 : 0

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200/60 bg-white shadow-sm ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-t-xl border-b border-zinc-100 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlayPause}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isComplete ? 'Replay' : isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={handleStep}
            disabled={isComplete}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            <SkipForward className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Run next check</span>
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-md border border-orange-500 bg-white px-2.5 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 dark:border-orange-700 dark:bg-zinc-900 dark:text-orange-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Frequency control */}
        <div className="flex items-center gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
          {(['hourly', 'daily', 'weekly'] as MonitorFrequency[]).map((f) => (
            <button
              key={f}
              onClick={() => onFrequencyChange(f)}
              className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition ${
                frequency === f
                  ? 'bg-white text-orange-600 shadow-sm dark:bg-zinc-700 dark:text-orange-400'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {FREQUENCY_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Page header + next-check ticker */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-100 bg-zinc-50/60 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${BADGE[CATEGORY_META[page.category].tone]}`}>
                {CATEGORY_META[page.category].label}
              </span>
              <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">{page.label}</h3>
            </div>
            <p className="mt-0.5 truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">{page.url}</p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1.5 dark:border-orange-900/50 dark:bg-orange-950/30">
            <Timer className={`h-4 w-4 text-orange-500 ${isPlaying && !isComplete ? 'animate-pulse' : ''}`} />
            <div className="leading-tight">
              <div className="text-[10px] font-medium uppercase tracking-wide text-orange-600/80 dark:text-orange-400/80">
                {isComplete ? 'Monitoring complete' : 'Next check in'}
              </div>
              <div className="font-mono text-sm font-bold text-orange-700 dark:text-orange-300">
                {isComplete ? '—' : formatCountdown(countdown)}
              </div>
            </div>
          </div>
        </div>

        {/* Architecture diagram driven by the current phase */}
        <FirecrawlMonitorArchitecture phase={phase} />

        {/* Snapshot timeline */}
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Snapshot timeline
            </h4>
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              {runUpTo} / {totalChecks} checks · {changeCount} change{changeCount === 1 ? '' : 's'}
            </span>
          </div>

          {/* progress rail */}
          <div className="mb-3 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-orange-500 to-red-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="relative">
            {/* baseline */}
            <div className="absolute left-0 right-0 top-3 h-px bg-zinc-200 dark:bg-zinc-700" />
            <div className="relative flex items-start justify-between gap-1">
              {events.map((event, index) => {
                const revealed = index < runUpTo
                const tone = STATUS_META[event.changeStatus].tone
                const isSelected = event.id === selectedEventId
                const isChange = event.changeStatus === 'changed'
                return (
                  <button
                    key={event.id}
                    onClick={() => revealed && onSelectEvent(event.id)}
                    disabled={!revealed}
                    className="group flex flex-1 flex-col items-center focus:outline-none"
                    title={`${formatTimestamp(event.currentScrapeAt)} — ${event.summary}`}
                  >
                    <motion.span
                      initial={false}
                      animate={{
                        scale: revealed ? 1 : 0.55,
                        opacity: revealed ? 1 : 0.35,
                      }}
                      transition={{ type: 'spring', stiffness: 320, damping: 20 }}
                      className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full ring-2 transition ${
                        isSelected
                          ? 'ring-orange-500'
                          : 'ring-white dark:ring-zinc-900'
                      }`}
                    >
                      <span className={`h-3 w-3 rounded-full ${DOT_BG[tone] ?? DOT_BG.zinc}`} />
                      {revealed && isChange && (
                        <motion.span
                          className={`absolute inset-0 rounded-full ${DOT_BG[tone] ?? DOT_BG.zinc}`}
                          initial={{ opacity: 0.5, scale: 1 }}
                          animate={{ opacity: 0, scale: 2.1 }}
                          transition={{ duration: 1.4, repeat: Infinity }}
                        />
                      )}
                    </motion.span>
                    <span className="mt-1.5 text-[9px] font-medium text-zinc-500 dark:text-zinc-400">
                      {formatTimestamp(event.currentScrapeAt).split(',')[0]}
                    </span>
                    <span className={`mt-0.5 hidden text-[8px] font-semibold uppercase tracking-wide sm:block ${
                      tone === 'amber' ? 'text-amber-600 dark:text-amber-400'
                        : tone === 'red' ? 'text-red-600 dark:text-red-400'
                        : tone === 'blue' ? 'text-blue-600 dark:text-blue-400'
                        : 'text-zinc-400 dark:text-zinc-500'
                    }`}>
                      {revealed ? STATUS_META[event.changeStatus].label : ''}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Live change-event feed */}
        <div className="mt-5">
          <div className="mb-2 flex items-center gap-2">
            <Radio className={`h-3.5 w-3.5 text-orange-500 ${isPlaying ? 'animate-pulse' : ''}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              Change-event feed
            </h4>
          </div>
          <div className="space-y-2">
            {feedEvents.length === 0 && (
              <p className="rounded-lg border border-dashed border-zinc-200 px-4 py-6 text-center text-xs text-zinc-400 dark:border-zinc-700 dark:text-zinc-500">
                Press Play to advance simulated time. Events appear here as the monitor detects them.
              </p>
            )}
            <AnimatePresence initial={false}>
              {feedEvents.map((event) => {
                const tone = STATUS_META[event.changeStatus].tone
                const isSelected = event.id === selectedEventId
                return (
                  <motion.button
                    key={event.id}
                    layout
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => onSelectEvent(event.id)}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left transition ${
                      isSelected
                        ? 'border-orange-300 bg-orange-50/70 dark:border-orange-700 dark:bg-orange-950/30'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60'
                    }`}
                  >
                    <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${DOT_BG[tone] ?? DOT_BG.zinc}`} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${BADGE[tone] ?? BADGE.zinc}`}>
                          {STATUS_META[event.changeStatus].label}
                        </span>
                        <span className="font-mono text-[10px] text-zinc-400 dark:text-zinc-500">
                          {formatTimestamp(event.currentScrapeAt)}
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-zinc-700 dark:text-zinc-300">{event.summary}</p>
                    </div>
                    {(event.addedCount > 0 || event.removedCount > 0) && (
                      <div className="flex shrink-0 items-center gap-1.5 font-mono text-[10px]">
                        <span className="text-emerald-600 dark:text-emerald-400">+{event.addedCount}</span>
                        <span className="text-red-600 dark:text-red-400">−{event.removedCount}</span>
                      </div>
                    )}
                    <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-400" />
                  </motion.button>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
