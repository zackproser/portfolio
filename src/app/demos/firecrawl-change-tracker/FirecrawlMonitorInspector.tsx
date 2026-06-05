'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileDiff,
  Braces,
  Code2,
  Bell,
  Settings2,
  ChevronRight,
  Copy,
  Check,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

import { CATEGORY_META } from './data'
import {
  type MonitoredPage,
  type ChangeEvent,
  type DiffMode,
  type MonitorFrequency,
  type Snapshot,
  FREQUENCY_LABEL,
  STATUS_META,
  buildScrapeRequest,
  buildChangeTrackingResponse,
  buildAlertPayload,
  formatTimestamp,
} from './utils'

type TabId = 'git-diff' | 'json-diff' | 'response' | 'alert'

const TABS: { id: TabId; label: string; icon: typeof FileDiff }[] = [
  { id: 'git-diff', label: 'Git-diff', icon: FileDiff },
  { id: 'json-diff', label: 'JSON Diff', icon: Braces },
  { id: 'response', label: 'changeTracking Response', icon: Code2 },
  { id: 'alert', label: 'Alert', icon: Bell },
]

type Props = {
  page: MonitoredPage
  event: ChangeEvent | null
  snapshot: Snapshot | null
  modes: DiffMode[]
  onModesChange: (modes: DiffMode[]) => void
  schema: string
  onSchemaChange: (schema: string) => void
  frequency: MonitorFrequency
  onFrequencyChange: (f: MonitorFrequency) => void
}

const FIELD_KIND_STYLE: Record<string, string> = {
  modified: 'border-amber-300 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/20',
  added: 'border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/20',
  removed: 'border-red-300 bg-red-50/60 dark:border-red-800 dark:bg-red-950/20',
  unchanged: 'border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40',
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="inline-flex items-center gap-1 rounded-md border border-zinc-200 bg-white px-2 py-1 text-[10px] font-medium text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
    >
      {copied ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}

export default function FirecrawlMonitorInspector({
  page,
  event,
  snapshot,
  modes,
  onModesChange,
  schema,
  onSchemaChange,
  frequency,
  onFrequencyChange,
}: Props) {
  const [activeTab, setActiveTab] = useState<TabId>('git-diff')
  const [showSchema, setShowSchema] = useState(false)

  const schemaValid = useMemo(() => {
    try {
      JSON.parse(schema)
      return true
    } catch {
      return false
    }
  }, [schema])

  const requestBody = useMemo(
    () => buildScrapeRequest(page, modes, schema),
    [page, modes, schema]
  )
  const responseBody = useMemo(
    () => (event && snapshot ? buildChangeTrackingResponse(event, snapshot, modes) : ''),
    [event, snapshot, modes]
  )
  const alertBody = useMemo(
    () => (event ? buildAlertPayload(event) : ''),
    [event]
  )

  const toggleMode = (mode: DiffMode) => {
    if (modes.includes(mode)) {
      // Keep at least one mode selected.
      if (modes.length === 1) return
      onModesChange(modes.filter((m) => m !== mode))
    } else {
      onModesChange([...modes, mode])
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <FileDiff className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Change-event inspector</h3>
            <p className="text-xs text-zinc-500">
              {event
                ? `${formatTimestamp(event.currentScrapeAt)} · ${event.summary}`
                : 'Select a snapshot or feed item to inspect'}
            </p>
          </div>
        </div>
        {event && (
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
            STATUS_META[event.changeStatus].tone === 'amber'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              : STATUS_META[event.changeStatus].tone === 'red'
              ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'
              : STATUS_META[event.changeStatus].tone === 'blue'
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
          }`}>
            changeStatus: {event.changeStatus}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT: controls */}
        <div className="space-y-6 border-b border-zinc-100 bg-zinc-50/30 p-5 dark:border-zinc-800 dark:bg-zinc-900/30 lg:col-span-4 lg:border-b-0 lg:border-r">
          {/* Mode toggle */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              <Settings2 className="h-3.5 w-3.5" />
              Diff modes
            </h4>
            <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Firecrawl returns whichever modes you request in <code className="font-mono">changeTracking.modes</code>.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(['git-diff', 'json'] as DiffMode[]).map((mode) => {
                const active = modes.includes(mode)
                return (
                  <button
                    key={mode}
                    onClick={() => toggleMode(mode)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                      active
                        ? 'border-orange-300 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-950/30 dark:text-orange-300'
                        : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    {mode === 'git-diff' ? 'git-diff' : 'json'}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Frequency */}
          <div className="space-y-2 border-t border-zinc-200/60 pt-4 dark:border-zinc-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              Monitoring frequency
            </h4>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-zinc-200/50 p-1 dark:bg-zinc-800">
              {(['hourly', 'daily', 'weekly'] as MonitorFrequency[]).map((f) => (
                <button
                  key={f}
                  onClick={() => onFrequencyChange(f)}
                  className={`rounded-md px-2 py-1.5 text-[10px] font-medium transition ${
                    frequency === f
                      ? 'bg-white text-orange-600 shadow-sm dark:bg-zinc-700 dark:text-orange-400'
                      : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  {FREQUENCY_LABEL[f]}
                </button>
              ))}
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
              Schedule the scrape on a cron trigger or Cloudflare Worker. More frequent checks catch changes sooner and use more credits.
            </p>
          </div>

          {/* JSON-mode schema editor */}
          <div className="space-y-2 border-t border-zinc-200/60 pt-4 dark:border-zinc-800/60">
            <button
              onClick={() => setShowSchema((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
            >
              <span className="flex items-center gap-2">
                <Braces className="h-3.5 w-3.5" />
                JSON-mode schema
              </span>
              <ChevronRight className={`h-3.5 w-3.5 transition-transform ${showSchema ? 'rotate-90' : ''}`} />
            </button>
            <AnimatePresence>
              {showSchema && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-1">
                    <textarea
                      value={schema}
                      onChange={(e) => onSchemaChange(e.target.value)}
                      rows={9}
                      spellCheck={false}
                      className={`w-full resize-none rounded-lg border bg-white p-3 font-mono text-[11px] leading-relaxed text-zinc-800 shadow-sm focus:outline-none focus:ring-1 dark:bg-zinc-950 dark:text-zinc-200 ${
                        schemaValid
                          ? 'border-zinc-200 focus:border-orange-400 focus:ring-orange-400 dark:border-zinc-800'
                          : 'border-red-300 focus:border-red-400 focus:ring-red-400 dark:border-red-800'
                      }`}
                    />
                    {!schemaValid && (
                      <p className="flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400">
                        <AlertTriangle className="h-3 w-3" />
                        Invalid JSON — the request body shows the parse error.
                      </p>
                    )}
                    <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                      The schema tells Firecrawl which fields to extract and diff in json mode.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Why monitor this page */}
          <div className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2">
              <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                CATEGORY_META[page.category].tone === 'emerald'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                  : CATEGORY_META[page.category].tone === 'blue'
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : CATEGORY_META[page.category].tone === 'purple'
                  ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
              }`}>
                {CATEGORY_META[page.category].label}
              </span>
              <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Why watch this?</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">{page.purpose}</p>
          </div>
        </div>

        {/* RIGHT: tabbed inspection */}
        <div className="lg:col-span-8">
          {/* Tab bar */}
          <div className="flex overflow-x-auto border-b border-zinc-100 bg-white dark:border-zinc-800 dark:bg-zinc-900 [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex shrink-0 items-center gap-1.5 border-b-2 px-4 py-2.5 text-xs font-medium transition ${
                    active
                      ? 'border-orange-500 text-orange-600 dark:text-orange-400'
                      : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          <div className="min-h-[420px] p-5">
            {!event ? (
              <div className="flex h-[380px] flex-col items-center justify-center text-center text-zinc-400 dark:text-zinc-500">
                <FileDiff className="mb-3 h-8 w-8" />
                <p className="text-sm">Run a check or click a snapshot to inspect a change event.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* GIT-DIFF TAB */}
                  {activeTab === 'git-diff' && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          Line-level unified diff of the page markdown, exactly like <code className="font-mono">git diff</code>.
                        </p>
                        <div className="flex items-center gap-3 font-mono text-[11px]">
                          <span className="text-emerald-600 dark:text-emerald-400">+{event.addedCount}</span>
                          <span className="text-red-600 dark:text-red-400">−{event.removedCount}</span>
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
                        <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-3 py-1.5 dark:border-zinc-800 dark:bg-zinc-900">
                          <span className="font-mono text-[10px] text-zinc-500">{event.url}</span>
                          <span className="font-mono text-[10px] text-zinc-400">
                            {event.previousScrapeAt ? formatTimestamp(event.previousScrapeAt) : 'baseline'} → {formatTimestamp(event.currentScrapeAt)}
                          </span>
                        </div>
                        <pre className="max-h-[320px] overflow-auto font-mono text-[11px] leading-relaxed">
                          {event.diffLines.map((line, i) => (
                            <div
                              key={i}
                              className={`flex px-3 ${
                                line.type === 'added'
                                  ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                                  : line.type === 'removed'
                                  ? 'bg-red-50 text-red-800 dark:bg-red-950/40 dark:text-red-300'
                                  : 'text-zinc-600 dark:text-zinc-400'
                              }`}
                            >
                              <span className="mr-2 select-none opacity-60">
                                {line.type === 'added' ? '+' : line.type === 'removed' ? '−' : ' '}
                              </span>
                              <span className="whitespace-pre-wrap break-all">{line.text || ' '}</span>
                            </div>
                          ))}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* JSON-DIFF TAB */}
                  {activeTab === 'json-diff' && (
                    <div className="space-y-3">
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Field-level changes against your schema. Each field reports <code className="font-mono">{'{ previous, current }'}</code>.
                      </p>
                      <div className="space-y-2">
                        {event.fieldDiffs.map((diff) => (
                          <div
                            key={diff.field}
                            className={`rounded-lg border p-3 ${FIELD_KIND_STYLE[diff.kind]}`}
                          >
                            <div className="flex items-center justify-between">
                              <code className="font-mono text-xs font-semibold text-zinc-800 dark:text-zinc-200">{diff.field}</code>
                              <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                                diff.kind === 'modified' ? 'bg-amber-200/70 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                                  : diff.kind === 'added' ? 'bg-emerald-200/70 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                                  : diff.kind === 'removed' ? 'bg-red-200/70 text-red-800 dark:bg-red-900/50 dark:text-red-300'
                                  : 'bg-zinc-200/70 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
                              }`}>
                                {diff.kind}
                              </span>
                            </div>
                            {diff.kind !== 'unchanged' ? (
                              <div className="mt-2 flex items-center gap-2 font-mono text-xs">
                                <span className="rounded bg-red-100 px-1.5 py-0.5 text-red-700 line-through dark:bg-red-950/40 dark:text-red-300">
                                  {diff.previous ?? 'null'}
                                </span>
                                <ArrowRight className="h-3 w-3 text-zinc-400" />
                                <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                                  {diff.current ?? 'null'}
                                </span>
                              </div>
                            ) : (
                              <p className="mt-1 font-mono text-xs text-zinc-500">{diff.current ?? 'null'}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RESPONSE TAB */}
                  {activeTab === 'response' && (
                    <div className="space-y-4">
                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Request — POST /v2/scrape</h5>
                          <CopyButton text={requestBody} />
                        </div>
                        <pre className="max-h-[170px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                          {requestBody}
                        </pre>
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Response — data.changeTracking</h5>
                          <CopyButton text={responseBody} />
                        </div>
                        <pre className="max-h-[230px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                          {responseBody}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* ALERT TAB */}
                  {activeTab === 'alert' && (
                    <div className="space-y-4">
                      <div className="rounded-lg border border-orange-200 bg-orange-50/60 p-3 dark:border-orange-900/50 dark:bg-orange-950/20">
                        <div className="flex items-center gap-2 text-sm font-semibold text-orange-700 dark:text-orange-300">
                          <Bell className="h-4 w-4" />
                          {event.pageLabel} changed
                        </div>
                        <p className="mt-1 text-xs text-orange-700/80 dark:text-orange-300/80">{event.summary}</p>
                        <p className="mt-2 font-mono text-[11px] text-orange-600/70 dark:text-orange-400/70">
                          posts to {page.alertChannel}
                        </p>
                      </div>
                      <div>
                        <div className="mb-1.5 flex items-center justify-between">
                          <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Webhook payload</h5>
                          <CopyButton text={alertBody} />
                        </div>
                        <pre className="max-h-[300px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                          {alertBody}
                        </pre>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
