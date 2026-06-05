'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  ChevronRight,
  FileText,
  Coins,
  Timer,
  Layers,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  CircleDashed,
} from 'lucide-react'

import FirecrawlCrawlArchitecture, { type CrawlPhase } from './FirecrawlCrawlArchitecture'
import type { SeedSite } from './data'
import type { CrawlEvent, CrawledPage, CrawlResult, PageStatus } from './utils'
import { bytesToReadable } from './utils'

type Props = {
  site: SeedSite
  result: CrawlResult
  selectedUrl: string | null
  onSelectPage: (url: string) => void
}

// How long each event "ticks" during auto-play, in ms.
const TICK_MS = 420

const STATUS_PILL: Record<PageStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  queued: {
    label: 'queued',
    className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
    icon: CircleDashed,
  },
  rendering: {
    label: 'rendering',
    className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
    icon: Loader2,
  },
  markdown: {
    label: 'markdown',
    className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    icon: FileText,
  },
  done: {
    label: 'done',
    className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
    icon: CheckCircle2,
  },
  skipped: {
    label: 'skipped',
    className: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500',
    icon: CircleDashed,
  },
  error: {
    label: 'error',
    className: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
    icon: AlertTriangle,
  },
}

const ACCENT_DOT: Record<string, string> = {
  blue: 'bg-blue-500',
  emerald: 'bg-emerald-500',
  violet: 'bg-violet-500',
}

// Derive the live status of each page given how many events have been processed.
function statusAtEvent(events: CrawlEvent[], cursor: number): Map<string, PageStatus> {
  const map = new Map<string, PageStatus>()
  for (let i = 0; i <= cursor && i < events.length; i++) {
    const ev = events[i]
    switch (ev.type) {
      case 'queued':
        map.set(ev.url, 'queued')
        break
      case 'rendering':
        map.set(ev.url, 'rendering')
        break
      case 'markdown':
        map.set(ev.url, 'markdown')
        break
      case 'done':
        map.set(ev.url, 'done')
        break
      case 'skipped':
        map.set(ev.url, 'skipped')
        break
      default:
        break
    }
  }
  return map
}

export default function FirecrawlCrawlVisualization({ site, result, selectedUrl, onSelectPage }: Props) {
  const { events } = result
  const [cursor, setCursor] = useState<number>(events.length - 1)
  const [isPlaying, setIsPlaying] = useState(false)
  const intervalRef = useRef<number | null>(null)

  // Reset playback whenever the underlying simulation changes (config edit).
  useEffect(() => {
    setCursor(events.length - 1)
    setIsPlaying(false)
  }, [events])

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  useEffect(() => () => clearTimer(), [clearTimer])

  // Auto-play advances the cursor one event at a time.
  useEffect(() => {
    clearTimer()
    if (!isPlaying) return
    intervalRef.current = window.setInterval(() => {
      setCursor((c) => {
        if (c >= events.length - 1) {
          setIsPlaying(false)
          return c
        }
        return c + 1
      })
    }, TICK_MS)
    return () => clearTimer()
  }, [isPlaying, events.length, clearTimer])

  const handlePlay = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false)
      return
    }
    if (cursor >= events.length - 1) setCursor(0)
    setIsPlaying(true)
  }, [isPlaying, cursor, events.length])

  const handleStep = useCallback(() => {
    setIsPlaying(false)
    setCursor((c) => Math.min(events.length - 1, c + 1))
  }, [events.length])

  const handleReset = useCallback(() => {
    setIsPlaying(false)
    setCursor(0)
  }, [])

  const currentEvent = events[Math.min(cursor, events.length - 1)]
  const statuses = useMemo(() => statusAtEvent(events, cursor), [events, cursor])

  // Phase for the architecture diagram.
  const phase: CrawlPhase = useMemo(() => {
    if (!currentEvent) return 'idle'
    if (currentEvent.type === 'map' && cursor === 0) return 'mapping'
    if (cursor >= events.length - 1) return 'complete'
    return 'crawling'
  }, [currentEvent, cursor, events.length])

  // Pages grouped by depth, but only those discovered up to the cursor.
  const visiblePages = useMemo(() => {
    const discovered = new Set<string>()
    for (let i = 0; i <= cursor && i < events.length; i++) {
      if (events[i].type === 'discovered' || events[i].type === 'skipped') {
        discovered.add(events[i].url)
      }
    }
    return result.pages.filter((p) => discovered.has(p.url))
  }, [result.pages, events, cursor])

  const pagesByDepth = useMemo(() => {
    const groups = new Map<number, CrawledPage[]>()
    visiblePages.forEach((p) => {
      const list = groups.get(p.depth) ?? []
      list.push(p)
      groups.set(p.depth, list)
    })
    return Array.from(groups.entries()).sort((a, b) => a[0] - b[0])
  }, [visiblePages])

  // Live counters reflect the cursor position, not the final totals.
  const liveCompleted = currentEvent?.pagesCompleted ?? 0
  const liveTokens = currentEvent?.tokensExtracted ?? 0
  const liveElapsed = currentEvent?.elapsedMs ?? 0
  const liveSkipped = visiblePages.filter((p) => p.status === 'skipped').length

  const accentDot = ACCENT_DOT[site.accent] ?? 'bg-blue-500'

  return (
    <div className="space-y-4 rounded-xl border border-zinc-200/60 bg-white shadow-sm ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Controls + counters */}
      <div className="flex flex-col gap-3 border-b border-zinc-100 bg-white/80 px-4 py-3 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePlay}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isPlaying ? 'Pause' : 'Play crawl'}
          </button>
          <button
            onClick={handleStep}
            disabled={cursor >= events.length - 1}
            className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          >
            Step
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1 rounded-md border border-orange-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-orange-700 transition hover:bg-orange-50 dark:border-orange-800 dark:bg-zinc-900 dark:text-orange-300"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
          <Counter icon={FileText} color="text-emerald-500" label="Pages" value={`${liveCompleted}`} />
          <Counter icon={Coins} color="text-amber-500" label="Tokens" value={liveTokens.toLocaleString()} />
          <Counter icon={Timer} color="text-blue-500" label="Elapsed" value={`${liveElapsed.toLocaleString()} ms`} />
          <Counter icon={Layers} color="text-zinc-500" label="Skipped" value={`${liveSkipped}`} />
        </div>
      </div>

      <div className="px-4 pb-2">
        <FirecrawlCrawlArchitecture phase={phase} lastEventType={currentEvent?.type} />
      </div>

      {/* Progress scrubber */}
      <div className="px-4">
        <div className="mb-1 flex items-center justify-between text-[11px] text-zinc-500">
          <span>
            Event {Math.min(cursor + 1, events.length)} / {events.length}
          </span>
          <span className="truncate pl-2 font-mono">{currentEvent?.message}</span>
        </div>
        <input
          type="range"
          min={0}
          max={events.length - 1}
          value={cursor}
          onChange={(e) => {
            setIsPlaying(false)
            setCursor(parseInt(e.target.value, 10))
          }}
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-orange-500 dark:bg-zinc-700"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-2">
        {/* Site map tree */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="mb-3 flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${accentDot}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              Site map (grows by depth)
            </h4>
          </div>

          {pagesByDepth.length === 0 ? (
            <div className="py-10 text-center text-sm text-zinc-400">
              Press <strong>Play crawl</strong> to discover pages.
            </div>
          ) : (
            <div className="space-y-4">
              {pagesByDepth.map(([depth, pages]) => (
                <div key={depth} className="space-y-1.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Depth {depth}
                  </p>
                  <div className="space-y-1">
                    <AnimatePresence initial={false}>
                      {pages.map((page) => {
                        const status = statuses.get(page.url) ?? 'queued'
                        const pill = STATUS_PILL[status]
                        const PillIcon = pill.icon
                        const isSelected = selectedUrl === page.url
                        const isClickable = status === 'done' || status === 'error'
                        return (
                          <motion.button
                            key={page.url}
                            layout
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => isClickable && onSelectPage(page.url)}
                            disabled={!isClickable}
                            style={{ marginLeft: `${depth * 14}px` }}
                            className={`flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-1.5 text-left transition ${
                              isSelected
                                ? 'border-orange-400 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
                                : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/60 dark:hover:border-zinc-700'
                            } ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
                          >
                            <span className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-700 dark:text-zinc-300">
                              {page.path}
                            </span>
                            <span
                              className={`inline-flex shrink-0 items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium ${pill.className}`}
                            >
                              <PillIcon className={`h-2.5 w-2.5 ${status === 'rendering' ? 'animate-spin' : ''}`} />
                              {pill.label}
                            </span>
                          </motion.button>
                        )
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Worker / event feed */}
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/40 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="mb-3 flex items-center gap-2">
            <Loader2 className={`h-3.5 w-3.5 text-orange-500 ${isPlaying ? 'animate-spin' : ''}`} />
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              Crawler activity
            </h4>
          </div>

          <div className="max-h-[320px] space-y-1 overflow-y-auto pr-1">
            {events.slice(0, cursor + 1).slice(-40).map((ev) => (
              <div
                key={ev.index}
                className={`flex items-start gap-2 rounded-md px-2 py-1 text-[11px] ${
                  ev.index === cursor ? 'bg-orange-50 dark:bg-orange-900/20' : ''
                }`}
              >
                <EventBadge type={ev.type} />
                <span className="flex-1 text-zinc-600 dark:text-zinc-400">{ev.message}</span>
                <span className="shrink-0 font-mono text-[10px] text-zinc-400">{ev.elapsedMs}ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer summary */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 dark:border-zinc-800">
        <span>
          Crawling <span className="font-mono text-zinc-700 dark:text-zinc-300">{site.domain}</span>
        </span>
        <span>
          Raw HTML processed: {bytesToReadable(
            visiblePages.filter((p) => p.status === 'done' || p.status === 'error').reduce((s, p) => s + p.rawHtmlBytes, 0),
          )}
        </span>
      </div>
    </div>
  )
}

function Counter({
  icon: Icon,
  color,
  label,
  value,
}: {
  icon: typeof FileText
  color: string
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-zinc-100 bg-white px-3 py-1.5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <div className="flex flex-col leading-none">
        <span className="text-[9px] font-medium uppercase tracking-wide text-zinc-500">{label}</span>
        <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100">{value}</span>
      </div>
    </div>
  )
}

function EventBadge({ type }: { type: CrawlEvent['type'] }) {
  const map: Record<CrawlEvent['type'], { label: string; className: string }> = {
    map: { label: 'MAP', className: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300' },
    discovered: { label: 'FIND', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
    queued: { label: 'QUEUE', className: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400' },
    rendering: { label: 'RENDER', className: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
    markdown: { label: 'MD', className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    done: { label: 'DONE', className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
    skipped: { label: 'SKIP', className: 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500' },
  }
  const badge = map[type]
  return (
    <span className={`shrink-0 rounded px-1 py-0.5 text-[8px] font-bold tracking-wider ${badge.className}`}>
      {badge.label}
    </span>
  )
}
