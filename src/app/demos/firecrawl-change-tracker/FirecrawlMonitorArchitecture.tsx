'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, Flame, GitCompare, FileDiff, Bell } from 'lucide-react'

// Animated architecture diagram for the change-tracking pipeline:
// Scheduler (cron / Cloudflare Worker) -> scrape with changeTracking ->
// compare to previousScrapeAt -> diff -> alert (webhook / Slack).
//
// The active stage animates based on the simulation phase passed in.

export type MonitorPhase = 'idle' | 'schedule' | 'scrape' | 'compare' | 'diff' | 'alert'

type StageId = 'scheduler' | 'scrape' | 'compare' | 'diff' | 'alert'

interface Stage {
  id: StageId
  label: string
  sublabel: string
  icon: typeof Clock
  x: number
  color: string
}

// Horizontal pipeline across a 320x120 viewBox.
const STAGES: Stage[] = [
  { id: 'scheduler', label: 'Scheduler', sublabel: 'cron / CF Worker', icon: Clock, x: 30, color: 'blue' },
  { id: 'scrape', label: 'Scrape', sublabel: 'changeTracking', icon: Flame, x: 100, color: 'orange' },
  { id: 'compare', label: 'Compare', sublabel: 'vs previousScrapeAt', icon: GitCompare, x: 170, color: 'purple' },
  { id: 'diff', label: 'Diff', sublabel: 'git-diff / json', icon: FileDiff, x: 240, color: 'amber' },
  { id: 'alert', label: 'Alert', sublabel: 'webhook / Slack', icon: Bell, x: 300, color: 'emerald' },
]

const Y = 50

// Which stages are "lit" for a given phase.
const PHASE_ACTIVE: Record<MonitorPhase, StageId[]> = {
  idle: [],
  schedule: ['scheduler'],
  scrape: ['scheduler', 'scrape'],
  compare: ['scrape', 'compare'],
  diff: ['compare', 'diff'],
  alert: ['diff', 'alert'],
}

// Which edge animates for a given phase.
const PHASE_EDGE: Record<MonitorPhase, [StageId, StageId] | null> = {
  idle: null,
  schedule: null,
  scrape: ['scheduler', 'scrape'],
  compare: ['scrape', 'compare'],
  diff: ['compare', 'diff'],
  alert: ['diff', 'alert'],
}

const EDGE_LABEL: Record<MonitorPhase, string> = {
  idle: '',
  schedule: '',
  scrape: 'POST /v2/scrape',
  compare: 'markdown + fields',
  diff: 'changeStatus',
  alert: 'page.changed',
}

function strokeFor(color: string): string {
  const map: Record<string, string> = {
    blue: '#3b82f6',
    orange: '#f97316',
    purple: '#a855f7',
    amber: '#f59e0b',
    emerald: '#10b981',
  }
  return map[color] || '#71717a'
}

function textClass(color: string): string {
  const map: Record<string, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    orange: 'text-orange-600 dark:text-orange-400',
    purple: 'text-purple-600 dark:text-purple-400',
    amber: 'text-amber-600 dark:text-amber-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
  }
  return map[color] || 'text-zinc-600 dark:text-zinc-400'
}

export default function FirecrawlMonitorArchitecture({
  phase,
}: {
  phase: MonitorPhase
}) {
  const activeIds = PHASE_ACTIVE[phase] ?? []
  const activeEdge = PHASE_EDGE[phase]
  const [pulseKey, setPulseKey] = useState(0)

  // Bump a key so framer re-triggers the moving packet when the phase changes.
  useEffect(() => {
    setPulseKey((k) => k + 1)
  }, [phase])

  const phaseLabel: Record<MonitorPhase, string> = {
    idle: 'Monitor idle — press Play to advance time',
    schedule: 'Scheduler fires on the configured interval',
    scrape: 'Firecrawl scrapes the page with change tracking on',
    compare: 'Firecrawl compares this scrape to the previous one',
    diff: 'A diff is computed: changeStatus, git-diff, and json',
    alert: 'A change fires a webhook to Slack / your endpoint',
  }

  return (
    <div className="w-full">
      <div className="relative w-full rounded-lg border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50">
        <svg viewBox="0 0 330 110" className="w-full" preserveAspectRatio="xMidYMid meet" style={{ maxHeight: 280 }}>
          <defs>
            <marker
              id="mt-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 8 4 L 0 8" fill="currentColor" />
            </marker>
          </defs>

          {/* Static base rails between adjacent stages */}
          {STAGES.slice(0, -1).map((stage, i) => {
            const next = STAGES[i + 1]
            return (
              <line
                key={`rail-${stage.id}`}
                x1={stage.x + 12}
                y1={Y}
                x2={next.x - 12}
                y2={Y}
                stroke="#a1a1aa"
                strokeWidth="0.6"
                strokeOpacity="0.35"
                strokeDasharray="2 3"
              />
            )
          })}

          {/* Active animated edge */}
          {activeEdge &&
            (() => {
              const from = STAGES.find((s) => s.id === activeEdge[0])!
              const to = STAGES.find((s) => s.id === activeEdge[1])!
              const stroke = strokeFor(to.color)
              const midX = (from.x + to.x) / 2
              return (
                <g key={`edge-${pulseKey}`}>
                  <motion.line
                    x1={from.x + 12}
                    y1={Y}
                    x2={to.x - 12}
                    y2={Y}
                    stroke={stroke}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    markerEnd="url(#mt-arrow)"
                    style={{ color: stroke }}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                  {/* moving packet */}
                  <motion.circle
                    r="2.4"
                    fill={stroke}
                    initial={{ cx: from.x + 12, cy: Y, opacity: 0 }}
                    animate={{ cx: to.x - 12, cy: Y, opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  {/* edge label */}
                  {EDGE_LABEL[phase] && (
                    <g>
                      <rect
                        x={midX - 26}
                        y={Y - 18}
                        width="52"
                        height="11"
                        rx="5.5"
                        fill="white"
                        fillOpacity="0.97"
                        stroke={stroke}
                        strokeWidth="0.6"
                        className="dark:fill-zinc-900"
                      />
                      <text
                        x={midX}
                        y={Y - 10}
                        textAnchor="middle"
                        fontSize="6"
                        fontWeight="700"
                        fill={stroke}
                      >
                        {EDGE_LABEL[phase]}
                      </text>
                    </g>
                  )}
                </g>
              )
            })()}

          {/* Stage nodes */}
          {STAGES.map((stage) => {
            const Icon = stage.icon
            const isActive = activeIds.includes(stage.id)
            const stroke = strokeFor(stage.color)
            return (
              <g key={stage.id} opacity={isActive ? 1 : 0.4}>
                {isActive && (
                  <motion.circle
                    cx={stage.x}
                    cy={Y}
                    r="12"
                    fill="none"
                    stroke={stroke}
                    strokeWidth="1"
                    initial={{ r: 12, opacity: 0.6 }}
                    animate={{ r: 20, opacity: 0 }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  />
                )}
                <circle
                  cx={stage.x}
                  cy={Y}
                  r="12"
                  fill="white"
                  stroke={isActive ? stroke : '#d4d4d8'}
                  strokeWidth={isActive ? 1.6 : 1}
                  className="dark:fill-zinc-900"
                />
                <foreignObject x={stage.x - 8} y={Y - 8} width="16" height="16">
                  <div className={`flex h-full w-full items-center justify-center ${textClass(stage.color)}`}>
                    <Icon className="h-3.5 w-3.5" strokeWidth={isActive ? 2.4 : 2} />
                  </div>
                </foreignObject>
                <text
                  x={stage.x}
                  y={Y + 24}
                  textAnchor="middle"
                  fontSize="6.5"
                  fontWeight="700"
                  fill={isActive ? '#18181b' : '#71717a'}
                  className="dark:fill-zinc-200"
                >
                  {stage.label}
                </text>
                <text
                  x={stage.x}
                  y={Y + 32}
                  textAnchor="middle"
                  fontSize="4.6"
                  fill="#71717a"
                  className="dark:fill-zinc-500"
                >
                  {stage.sublabel}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Phase caption */}
        <div className="mt-2 text-center">
          <motion.p
            key={phase}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-medium text-zinc-600 dark:text-zinc-400"
          >
            {phaseLabel[phase]}
          </motion.p>
        </div>
      </div>
    </div>
  )
}
