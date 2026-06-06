'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Radio,
  Loader2,
  AlertTriangle,
  Globe,
  Braces,
  ChevronRight,
  Copy,
  Check,
  Info,
} from 'lucide-react'
import { track } from '@vercel/analytics'

import { type DiffMode } from './utils'

// LIVE MODE: scrape a real URL through the existing /api/firecrawl-demo
// endpoint. The first scrape of any URL is the BASELINE — changeStatus comes
// back "new" and previousScrapeAt is null because there is nothing to diff
// against yet. Firecrawl detects changes on the next scrape of the same URL.

type LiveData = {
  markdown?: string
  changeTracking?: {
    previousScrapeAt: string | null
    changeStatus: string
    visibility: string
  }
  json?: Record<string, unknown>
}

type Props = {
  // Seed the URL field from the current sample page so live mode feels connected.
  initialUrl: string
  // Seed the schema field from the current page's schema.
  initialSchema: string
  // Whether json mode is currently requested in the inspector.
  modes: DiffMode[]
}

const STATUS_TONE: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  same: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
  changed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  removed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

function CopyButton({ text, label = 'Copy' }: { text: string; label?: string }) {
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
      {copied ? 'Copied' : label}
    </button>
  )
}

export default function FirecrawlLiveScrape({ initialUrl, initialSchema, modes }: Props) {
  const [url, setUrl] = useState(initialUrl)
  const [useSchema, setUseSchema] = useState(modes.includes('json'))
  const [schema, setSchema] = useState(initialSchema)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<LiveData | null>(null)
  const [showSchema, setShowSchema] = useState(false)

  const schemaValid = useMemo(() => {
    if (!useSchema) return true
    try {
      JSON.parse(schema)
      return true
    } catch {
      return false
    }
  }, [useSchema, schema])

  const canSubmit = url.trim().length > 0 && schemaValid && !loading

  async function handleScrape() {
    if (!canSubmit) return
    setLoading(true)
    setError(null)
    setResult(null)
    track('demo_live_scrape', { demo: 'change-tracker' })

    let schemaObject: Record<string, unknown> | undefined
    if (useSchema) {
      try {
        schemaObject = JSON.parse(schema)
      } catch {
        setError('The schema is not valid JSON. Fix it and try again.')
        setLoading(false)
        return
      }
    }

    try {
      const res = await fetch('/api/firecrawl-demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'monitor',
          url: url.trim(),
          ...(schemaObject ? { schema: schemaObject } : {}),
        }),
      })

      if (!res.ok) {
        let message = 'The live scrape failed. Try a different URL or use the simulation above.'
        try {
          const body = await res.json()
          if (body?.error) message = body.error
        } catch {
          // keep the default friendly message
        }
        if (res.status === 429) {
          message = message || 'Rate limit reached. Wait a bit, then try again.'
        }
        setError(message)
        setLoading(false)
        return
      }

      const body = await res.json()
      setResult((body?.data ?? {}) as LiveData)
    } catch {
      setError('Could not reach the scrape endpoint. The simulation above still works.')
    } finally {
      setLoading(false)
    }
  }

  const ct = result?.changeTracking

  return (
    <div className="overflow-hidden rounded-2xl border border-orange-200/70 bg-white shadow-sm dark:border-orange-900/40 dark:bg-zinc-900/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-gradient-to-r from-orange-50 to-red-50 p-4 dark:border-zinc-800 dark:from-orange-950/30 dark:to-red-950/20">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/15 text-orange-600 dark:text-orange-400">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Scrape your own URL now</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">Runs the real Firecrawl API against a live page.</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-red-600 dark:text-red-300">
          <Radio className="h-3 w-3" />
          Live
        </span>
      </div>

      <div className="space-y-4 p-5">
        {/* Baseline explainer */}
        <div className="flex items-start gap-2 rounded-lg border border-blue-200 bg-blue-50/60 p-3 text-[11px] leading-relaxed text-blue-800 dark:border-blue-900/50 dark:bg-blue-950/20 dark:text-blue-200">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            The first scrape of a URL captures the <strong>baseline</strong>: <code className="font-mono">changeStatus</code> comes back{' '}
            <code className="font-mono">&quot;new&quot;</code> and <code className="font-mono">previousScrapeAt</code> is <code className="font-mono">null</code>, because there is no prior snapshot to compare against. Firecrawl detects changes on the next scrape of the same URL. Use the simulation above to see a populated diff across snapshots.
          </span>
        </div>

        {/* URL input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">URL to scrape</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleScrape()
              }}
              placeholder="https://example.com/pricing"
              spellCheck={false}
              className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 font-mono text-xs text-zinc-800 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-200"
            />
            <button
              onClick={handleScrape}
              disabled={!canSubmit}
              className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Radio className="h-3.5 w-3.5" />}
              {loading ? 'Scraping…' : 'Scrape live'}
            </button>
          </div>
          {loading && (
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Live scrapes usually take 10–20 seconds. The simulation above stays usable while you wait.
            </p>
          )}
        </div>

        {/* Optional schema */}
        <div className="space-y-2 border-t border-zinc-200/60 pt-3 dark:border-zinc-800/60">
          <button
            onClick={() => setShowSchema((v) => !v)}
            className="flex w-full items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300"
          >
            <span className="flex items-center gap-2">
              <Braces className="h-3.5 w-3.5" />
              JSON extraction schema (optional)
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
                  <label className="flex items-center gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
                    <input
                      type="checkbox"
                      checked={useSchema}
                      onChange={(e) => setUseSchema(e.target.checked)}
                      className="h-3.5 w-3.5 rounded border-zinc-300 text-orange-500 focus:ring-orange-400 dark:border-zinc-600 dark:bg-zinc-800"
                    />
                    Send a schema so Firecrawl extracts structured fields (json mode)
                  </label>
                  <textarea
                    value={schema}
                    onChange={(e) => setSchema(e.target.value)}
                    disabled={!useSchema}
                    rows={8}
                    spellCheck={false}
                    className={`w-full resize-none rounded-lg border bg-white p-3 font-mono text-[11px] leading-relaxed text-zinc-800 shadow-sm focus:outline-none focus:ring-1 disabled:opacity-50 dark:bg-zinc-950 dark:text-zinc-200 ${
                      schemaValid
                        ? 'border-zinc-200 focus:border-orange-400 focus:ring-orange-400 dark:border-zinc-800'
                        : 'border-red-300 focus:border-red-400 focus:ring-red-400 dark:border-red-800'
                    }`}
                  />
                  {!schemaValid && (
                    <p className="flex items-center gap-1.5 text-[11px] text-red-600 dark:text-red-400">
                      <AlertTriangle className="h-3 w-3" />
                      Invalid JSON — fix the schema before scraping.
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50/60 p-3 text-[11px] leading-relaxed text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-4 border-t border-zinc-200/60 pt-4 dark:border-zinc-800/60">
            {ct && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">changeTracking</span>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_TONE[ct.changeStatus] ?? STATUS_TONE.same}`}>
                  changeStatus: {ct.changeStatus}
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-mono text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  previousScrapeAt: {ct.previousScrapeAt === null ? 'null' : String(ct.previousScrapeAt)}
                </span>
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 font-mono text-[11px] text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                  visibility: {ct.visibility}
                </span>
              </div>
            )}

            {ct?.changeStatus === 'new' && (
              <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                Baseline captured. Scrape this same URL again later and Firecrawl will return a populated git-diff and (if a schema was sent) JSON field diffs.
              </p>
            )}

            {/* Extracted JSON */}
            {result.json && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Extracted JSON fields</h5>
                  <CopyButton text={JSON.stringify(result.json, null, 2)} />
                </div>
                <pre className="max-h-[220px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                  {JSON.stringify(result.json, null, 2)}
                </pre>
              </div>
            )}

            {/* Markdown */}
            {result.markdown && (
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Scraped markdown</h5>
                  <CopyButton text={result.markdown} />
                </div>
                <pre className="max-h-[320px] overflow-auto whitespace-pre-wrap break-words rounded-lg border border-zinc-200 bg-zinc-50 p-3 font-mono text-[11px] leading-relaxed text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
                  {result.markdown}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
