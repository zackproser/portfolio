'use client'

import { motion } from 'framer-motion'
import {
  Globe,
  Map as MapIcon,
  ListOrdered,
  MonitorPlay,
  FileText,
  Database,
} from 'lucide-react'

// The crawl pipeline, left to right. The active stage is derived from the
// simulation's current phase so the diagram lights up as the crawl runs.
export type CrawlStageId = 'seed' | 'map' | 'queue' | 'render' | 'markdown' | 'app'

type Stage = {
  id: CrawlStageId
  label: string
  sub: string
  icon: typeof Globe
  accent: string
  stroke: string
}

const STAGES: Stage[] = [
  { id: 'seed', label: 'Seed URL', sub: 'where the crawl starts', icon: Globe, accent: 'text-blue-600 dark:text-blue-400', stroke: '#3b82f6' },
  { id: 'map', label: '/map', sub: 'link + sitemap discovery', icon: MapIcon, accent: 'text-cyan-600 dark:text-cyan-400', stroke: '#06b6d4' },
  { id: 'queue', label: 'Crawl queue', sub: 'breadth-first by depth', icon: ListOrdered, accent: 'text-amber-600 dark:text-amber-400', stroke: '#f59e0b' },
  { id: 'render', label: 'JS render', sub: 'load the real DOM', icon: MonitorPlay, accent: 'text-violet-600 dark:text-violet-400', stroke: '#8b5cf6' },
  { id: 'markdown', label: 'Markdown', sub: 'clean, LLM-ready text', icon: FileText, accent: 'text-emerald-600 dark:text-emerald-400', stroke: '#10b981' },
  { id: 'app', label: 'Your RAG / app', sub: 'index, embed, ship', icon: Database, accent: 'text-rose-600 dark:text-rose-400', stroke: '#f43f5e' },
]

// Map the simulation phase to the stage(s) that should be active.
export type CrawlPhase = 'idle' | 'mapping' | 'crawling' | 'complete'

function activeStageForPhase(phase: CrawlPhase, lastEventType?: string): Set<CrawlStageId> {
  if (phase === 'idle') return new Set(['seed'])
  if (phase === 'mapping') return new Set(['seed', 'map'])
  if (phase === 'complete') return new Set(['markdown', 'app'])

  // crawling — drive the lit stage off the most recent event type
  switch (lastEventType) {
    case 'discovered':
    case 'queued':
      return new Set(['map', 'queue'])
    case 'rendering':
      return new Set(['queue', 'render'])
    case 'markdown':
    case 'done':
      return new Set(['render', 'markdown'])
    default:
      return new Set(['queue', 'render'])
  }
}

export default function FirecrawlCrawlArchitecture({
  phase,
  lastEventType,
}: {
  phase: CrawlPhase
  lastEventType?: string
}) {
  const active = activeStageForPhase(phase, lastEventType)

  return (
    <div className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Crawl pipeline
        </h3>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {phase === 'idle' && 'Ready'}
          {phase === 'mapping' && 'Mapping links'}
          {phase === 'crawling' && 'Crawling'}
          {phase === 'complete' && 'Complete'}
        </span>
      </div>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-stretch lg:gap-1">
        {STAGES.map((stage, index) => {
          const Icon = stage.icon
          const isActive = active.has(stage.id)
          return (
            <div key={stage.id} className="flex flex-1 items-center gap-2 lg:flex-col">
              <motion.div
                animate={{
                  scale: isActive ? 1.02 : 1,
                  borderColor: isActive ? stage.stroke : undefined,
                }}
                transition={{ duration: 0.3 }}
                className={`relative flex w-full flex-1 flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors ${
                  isActive
                    ? 'border-2 bg-white shadow-sm dark:bg-zinc-900'
                    : 'border border-zinc-200 bg-white/60 dark:border-zinc-800 dark:bg-zinc-900/40'
                }`}
                style={isActive ? { borderColor: stage.stroke } : undefined}
              >
                {isActive && (
                  <motion.span
                    layoutId="crawl-stage-glow"
                    className="absolute inset-0 -z-10 rounded-xl opacity-20"
                    style={{ backgroundColor: stage.stroke }}
                  />
                )}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    isActive ? stage.accent : 'text-zinc-400 dark:text-zinc-600'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.4 : 2} />
                  {isActive && (
                    <motion.span
                      className="absolute h-9 w-9 rounded-lg"
                      style={{ border: `1.5px solid ${stage.stroke}` }}
                      initial={{ opacity: 0.6, scale: 1 }}
                      animate={{ opacity: 0, scale: 1.5 }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                </div>
                <div>
                  <p
                    className={`text-xs font-semibold ${
                      isActive ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-500 dark:text-zinc-500'
                    }`}
                  >
                    {stage.label}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-tight text-zinc-400 dark:text-zinc-600">
                    {stage.sub}
                  </p>
                </div>
              </motion.div>

              {/* Connector arrow between stages */}
              {index < STAGES.length - 1 && (
                <div className="flex shrink-0 items-center justify-center lg:h-2 lg:w-full lg:py-1">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-90 text-zinc-300 dark:text-zinc-700 lg:rotate-0">
                    <motion.path
                      d="M4 12 H18 M14 8 L18 12 L14 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      animate={
                        active.has(stage.id) && active.has(STAGES[index + 1].id)
                          ? { opacity: [0.3, 1, 0.3] }
                          : { opacity: 0.4 }
                      }
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />
                  </svg>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
