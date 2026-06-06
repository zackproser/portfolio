'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { track } from '@vercel/analytics'
import {
  FileText,
  Scissors,
  Code2,
  Info,
  Settings2,
  Link as LinkIcon,
  Hash,
  Gauge,
  Eye,
  EyeOff,
  ChevronRight,
  Terminal,
  Copy,
  Check,
  Download,
} from 'lucide-react'

import type { SeedSite } from './data'
import {
  buildCrawlCode,
  buildCrawlRequestBody,
  buildCrawlResponse,
  buildJsonl,
  buildMapRequestBody,
  bytesToReadable,
  prettyJson,
  type CodeLang,
  type CrawlConfig,
  type CrawledPage,
  type CrawlFormat,
  type CrawlResult,
} from './utils'

type TabId = 'markdown' | 'rawclean' | 'code' | 'api' | 'metadata'

const TABS: { id: TabId; label: string; icon: typeof FileText }[] = [
  { id: 'markdown', label: 'Rendered Markdown', icon: FileText },
  { id: 'rawclean', label: 'Raw vs Clean', icon: Scissors },
  { id: 'code', label: 'Code', icon: Terminal },
  { id: 'api', label: 'API Request', icon: Code2 },
  { id: 'metadata', label: 'Page Metadata', icon: Info },
]

type Props = {
  site: SeedSite
  /** Seed URL to crawl — the live URL when in live mode, else the sample seed. */
  seedUrl: string
  /** Whether the inspector is showing live data from a user-supplied URL. */
  isLive: boolean
  result: CrawlResult
  config: CrawlConfig
  setConfig: (next: CrawlConfig) => void
  selectedUrl: string | null
  onSelectPage: (url: string) => void
}

export default function FirecrawlCrawlInspector({
  site,
  seedUrl,
  isLive,
  result,
  config,
  setConfig,
  selectedUrl,
  onSelectPage,
}: Props) {
  const [tab, setTab] = useState<TabId>('markdown')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const crawledPages = useMemo(
    () => result.pages.filter((p) => p.status === 'done' || p.status === 'error'),
    [result.pages],
  )

  const selected = useMemo(() => {
    const found = result.pages.find((p) => p.url === selectedUrl)
    if (found && (found.status === 'done' || found.status === 'error')) return found
    return crawledPages[0] ?? null
  }, [result.pages, selectedUrl, crawledPages])

  const update = (patch: Partial<CrawlConfig>) => setConfig({ ...config, ...patch })

  const toggleFormat = (fmt: CrawlFormat) => {
    const has = config.formats.includes(fmt)
    if (has && config.formats.length === 1) return // keep at least one
    update({
      formats: has ? config.formats.filter((f) => f !== fmt) : [...config.formats, fmt],
    })
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10 text-orange-600 dark:text-orange-400">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Page inspector</h3>
            <p className="text-xs text-zinc-500">Inspect any crawled page and tune the crawl</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 sm:inline">
          {crawledPages.length} pages crawled
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* LEFT: config + page list */}
        <div className="space-y-6 border-r border-zinc-100 bg-zinc-50/30 p-5 dark:border-zinc-800 dark:bg-zinc-900/30 lg:col-span-4">
          {/* Site picker hint */}
          <div className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              Crawling
              {isLive && (
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  LIVE
                </span>
              )}
            </p>
            <p className="mt-0.5 truncate font-mono text-xs text-zinc-800 dark:text-zinc-200">{seedUrl}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {isLive ? 'Live results from your URL via the Firecrawl API.' : site.description}
            </p>
          </div>

          {/* Crawl config */}
          <div className="space-y-4">
            <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              <Settings2 className="h-3.5 w-3.5" />
              Crawl settings
            </h4>

            {/* maxDepth */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">maxDepth</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">{config.maxDepth}</span>
              </div>
              <input
                type="range"
                min={0}
                max={3}
                step={1}
                value={config.maxDepth}
                onChange={(e) => update({ maxDepth: parseInt(e.target.value, 10) })}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-orange-500 dark:bg-zinc-700"
              />
            </div>

            {/* limit */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-zinc-600 dark:text-zinc-400">limit (pages)</span>
                <span className="font-mono text-zinc-700 dark:text-zinc-300">{config.limit}</span>
              </div>
              <input
                type="range"
                min={1}
                max={25}
                step={1}
                value={config.limit}
                onChange={(e) => update({ limit: parseInt(e.target.value, 10) })}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-zinc-200 accent-orange-500 dark:bg-zinc-700"
              />
            </div>

            {/* formats */}
            <div className="space-y-2">
              <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">formats</span>
              <div className="flex flex-wrap gap-2">
                {(['markdown', 'html', 'links'] as CrawlFormat[]).map((fmt) => {
                  const on = config.formats.includes(fmt)
                  return (
                    <button
                      key={fmt}
                      onClick={() => toggleFormat(fmt)}
                      className={`rounded-md border px-2.5 py-1 text-xs font-medium transition ${
                        on
                          ? 'border-orange-400 bg-orange-50 text-orange-700 dark:border-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                          : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400'
                      }`}
                    >
                      {fmt}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* onlyMainContent */}
            <button
              onClick={() => update({ onlyMainContent: !config.onlyMainContent })}
              className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
            >
              <span className="flex items-center gap-2 font-medium text-zinc-700 dark:text-zinc-300">
                {config.onlyMainContent ? <Eye className="h-3.5 w-3.5 text-emerald-500" /> : <EyeOff className="h-3.5 w-3.5 text-zinc-400" />}
                onlyMainContent
              </span>
              <span
                className={`relative h-4 w-8 rounded-full transition ${
                  config.onlyMainContent ? 'bg-emerald-500' : 'bg-zinc-300 dark:bg-zinc-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
                    config.onlyMainContent ? 'left-4' : 'left-0.5'
                  }`}
                />
              </span>
            </button>

            {/* Advanced: path globs + sitemap */}
            <button
              onClick={() => setShowAdvanced((v) => !v)}
              className="flex w-full items-center justify-between text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <span>Path filters &amp; sitemap</span>
              <ChevronRight className={`h-3 w-3 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} />
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="space-y-3 pt-1">
                    <GlobInput
                      label="includePaths"
                      hint="One regex per line. A path must match one to be crawled."
                      value={config.includePaths}
                      onChange={(includePaths) => update({ includePaths })}
                      placeholder={'^/docs/.*$'}
                    />
                    <GlobInput
                      label="excludePaths"
                      hint="One regex per line. Matching paths are skipped."
                      value={config.excludePaths}
                      onChange={(excludePaths) => update({ excludePaths })}
                      placeholder={'^/admin.*$'}
                    />
                    <button
                      onClick={() => update({ ignoreSitemap: !config.ignoreSitemap })}
                      className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      <span className="font-medium text-zinc-700 dark:text-zinc-300">ignoreSitemap</span>
                      <span
                        className={`relative h-4 w-8 rounded-full transition ${
                          config.ignoreSitemap ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
                            config.ignoreSitemap ? 'left-4' : 'left-0.5'
                          }`}
                        />
                      </span>
                    </button>
                    {!isLive && !site.hasSitemap && (
                      <p className="text-[10px] text-zinc-400">
                        {site.domain} has no sitemap, so discovery relies on links either way.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Page list */}
          <div className="space-y-2 border-t border-zinc-200/60 pt-4 dark:border-zinc-800/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-300">
              Crawled pages
            </h4>
            <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
              {crawledPages.map((page) => (
                <button
                  key={page.url}
                  onClick={() => onSelectPage(page.url)}
                  className={`flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs transition ${
                    selected?.url === page.url
                      ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className="truncate font-mono">{page.path}</span>
                  <span
                    className={`shrink-0 font-mono text-[10px] ${
                      page.statusCode >= 400 ? 'text-rose-500' : 'text-zinc-400'
                    }`}
                  >
                    {page.statusCode}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: tabbed inspection */}
        <div className="lg:col-span-8">
          {/* Tab bar */}
          <div className="flex items-center gap-1 overflow-x-auto border-b border-zinc-100 px-3 py-2 dark:border-zinc-800">
            {TABS.map((t) => {
              const Icon = t.icon
              const active = tab === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition ${
                    active
                      ? 'bg-orange-50 text-orange-700 ring-1 ring-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:ring-orange-800'
                      : 'text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </button>
              )
            })}
          </div>

          <div className="min-h-[460px] p-5">
            {!selected ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center text-sm text-zinc-400">
                <FileText className="mb-2 h-8 w-8" />
                No pages crawled yet. Adjust the settings or play the crawl.
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${tab}-${selected.url}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">{selected.title}</p>
                    <p className="truncate font-mono text-sm text-zinc-800 dark:text-zinc-200">{selected.url}</p>
                  </div>

                  {tab === 'markdown' && <MarkdownTab page={selected} config={config} crawled={crawledPages} />}
                  {tab === 'rawclean' && <RawCleanTab page={selected} isLive={isLive} />}
                  {tab === 'code' && <CodeTab seedUrl={seedUrl} config={config} />}
                  {tab === 'api' && <ApiTab seedUrl={seedUrl} config={config} result={result} isLive={isLive} />}
                  {tab === 'metadata' && <MetadataTab page={selected} onSelectPage={onSelectPage} crawled={crawledPages} />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Copy / download helpers ──────────────────────────────────────────────────
function CopyButton({
  text,
  label = 'Copy',
  onCopied,
}: {
  text: string
  label?: string
  onCopied?: () => void
}) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      onCopied?.()
      setTimeout(() => setCopied(false), 1600)
    } catch {
      // Clipboard can be blocked; fail quietly.
    }
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied' : label}
    </button>
  )
}

// ── Tab: Rendered Markdown ───────────────────────────────────────────────────
function MarkdownTab({
  page,
  config,
  crawled,
}: {
  page: CrawledPage
  config: CrawlConfig
  crawled: CrawledPage[]
}) {
  const downloadJsonl = () => {
    const jsonl = buildJsonl(crawled)
    const blob = new Blob([jsonl], { type: 'application/x-ndjson' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'crawl-pages.jsonl'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    track('demo_export', { demo: 'site-crawler', kind: 'jsonl' })
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 text-xs text-emerald-800 dark:border-emerald-900/30 dark:bg-emerald-900/10 dark:text-emerald-200">
        <FileText className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>
          This is the clean markdown Firecrawl returns for this page
          {config.onlyMainContent ? ' with onlyMainContent on' : ' with onlyMainContent off (nav/footer included)'}.
          Drop it straight into a chunker or an LLM prompt.
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <CopyButton
          text={page.markdown}
          label="Copy as Markdown"
          onCopied={() => track('demo_export', { demo: 'site-crawler', kind: 'markdown' })}
        />
        <button
          onClick={downloadJsonl}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <Download className="h-3.5 w-3.5" />
          Download all as JSONL
        </button>
        <span className="text-[10px] text-zinc-400">
          JSONL = one {'{ url, markdown, metadata }'} object per crawled page, ready for RAG ingestion.
        </span>
      </div>
      <pre className="max-h-[360px] overflow-auto rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-xs leading-relaxed text-zinc-800 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-200">
        <code>{page.markdown || '— (page skipped)'}</code>
      </pre>
    </div>
  )
}

// ── Tab: Code export ─────────────────────────────────────────────────────────
function CodeTab({ seedUrl, config }: { seedUrl: string; config: CrawlConfig }) {
  const [lang, setLang] = useState<CodeLang>('node')
  const code = useMemo(() => buildCrawlCode(seedUrl, config, lang), [seedUrl, config, lang])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
        <Terminal className="h-4 w-4 shrink-0 text-orange-500" />
        <span>Real Firecrawl SDK code for your current settings. Change the crawl settings on the left and this updates live.</span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="inline-flex rounded-md border border-zinc-200 p-0.5 dark:border-zinc-700">
          {(['node', 'python'] as CodeLang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                lang === l
                  ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                  : 'text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              {l === 'node' ? 'Node.js' : 'Python'}
            </button>
          ))}
        </div>
        <CopyButton
          text={code}
          label="Copy code"
          onCopied={() => track('demo_code_copy', { demo: 'site-crawler', lang })}
        />
      </div>
      <p className="font-mono text-[10px] text-zinc-400">
        {lang === 'node' ? 'npm i @mendable/firecrawl-js' : 'pip install firecrawl-py'}
      </p>
      <pre className="max-h-[360px] overflow-auto rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-[11px] leading-relaxed text-zinc-200">
        <code>{code}</code>
      </pre>
    </div>
  )
}

// ── Tab: Raw vs Clean ────────────────────────────────────────────────────────
function RawCleanTab({ page, isLive }: { page: CrawledPage; isLive: boolean }) {
  if (isLive) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          <Scissors className="h-4 w-4 shrink-0 text-orange-500" />
          <span>
            Live results already come back chrome-stripped with <strong>onlyMainContent</strong>, so there is no raw
            version to compare here. Try a sample site to see the before/after split.
          </span>
        </div>
        <pre className="max-h-[320px] overflow-auto rounded-lg border border-emerald-200/60 bg-emerald-50/30 p-3 text-[11px] leading-relaxed text-zinc-700 dark:border-emerald-900/30 dark:bg-emerald-950/10 dark:text-zinc-300">
          <code>{page.markdown || '— (no markdown)'}</code>
        </pre>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
        <Scissors className="h-4 w-4 shrink-0 text-orange-500" />
        <span>
          <strong>onlyMainContent</strong> strips the nav, cookie banner, footer, and ad slots on the left so only
          the article on the right reaches your model.
        </span>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500">Raw (with chrome)</span>
            <span className="font-mono text-[10px] text-zinc-400">{page.chromeMarkdown.length} chars</span>
          </div>
          <pre className="max-h-[320px] overflow-auto rounded-lg border border-rose-200/60 bg-rose-50/30 p-3 text-[11px] leading-relaxed text-zinc-700 dark:border-rose-900/30 dark:bg-rose-950/10 dark:text-zinc-300">
            <code>{page.chromeMarkdown}</code>
          </pre>
        </div>
        <div>
          <div className="mb-1 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">Clean (onlyMainContent)</span>
            <span className="font-mono text-[10px] text-zinc-400">{page.cleanMarkdown.length} chars</span>
          </div>
          <pre className="max-h-[320px] overflow-auto rounded-lg border border-emerald-200/60 bg-emerald-50/30 p-3 text-[11px] leading-relaxed text-zinc-700 dark:border-emerald-900/30 dark:bg-emerald-950/10 dark:text-zinc-300">
            <code>{page.cleanMarkdown}</code>
          </pre>
        </div>
      </div>
      <p className="text-center text-[11px] text-zinc-500">
        Chrome stripping removed{' '}
        <strong className="text-zinc-700 dark:text-zinc-300">
          {page.chromeMarkdown.length - page.cleanMarkdown.length} characters
        </strong>{' '}
        of boilerplate from this page.
      </p>
    </div>
  )
}

// ── Tab: API Request ─────────────────────────────────────────────────────────
function ApiTab({ seedUrl, config, result, isLive }: { seedUrl: string; config: CrawlConfig; result: CrawlResult; isLive: boolean }) {
  const mapBody = useMemo(() => buildMapRequestBody(seedUrl), [seedUrl])
  const scrapeBody = useMemo(() => ({
    url: seedUrl,
    formats: ['markdown', 'links'],
    onlyMainContent: true,
  }), [seedUrl])
  const crawlBody = useMemo(() => buildCrawlRequestBody(seedUrl, config), [seedUrl, config])
  const asyncResponse = { success: true, id: 'crawl_abc123', url: 'https://api.firecrawl.dev/v1/crawl/crawl_abc123' }
  const pollResponse = useMemo(() => ({ success: true, ...buildCrawlResponse(result) }), [result])

  if (isLive) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 text-xs text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-300">
          <Info className="h-4 w-4 shrink-0 text-orange-500" />
          <span>
            Live mode runs <strong>/v1/map</strong> (to discover URLs) plus one <strong>/v1/scrape</strong> on the seed page. It does not start a full crawl job.
          </span>
        </div>
        <ApiBlock
          method="POST"
          endpoint="https://api.firecrawl.dev/v1/map"
          body={prettyJson(mapBody)}
          note="Discover every URL on a domain — sitemap plus on-page links — in one call."
        />
        <ApiBlock
          method="POST"
          endpoint="https://api.firecrawl.dev/v1/scrape"
          body={prettyJson(scrapeBody)}
          note="Scrape the seed URL with markdown and links extraction."
        />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ApiBlock
        method="POST"
        endpoint="https://api.firecrawl.dev/v1/map"
        body={prettyJson(mapBody)}
        note="Discover every URL on a domain — sitemap plus on-page links — in one call."
      />
      <ApiBlock
        method="POST"
        endpoint="https://api.firecrawl.dev/v1/crawl"
        body={prettyJson(crawlBody)}
        note="Kick off the crawl. This body updates live as you change the settings on the left."
      />
      <div className="grid gap-4 md:grid-cols-2">
        <ApiBlock
          method="200"
          endpoint="async response"
          body={prettyJson(asyncResponse)}
          note="Crawl returns a job id immediately; poll the url for progress."
        />
        <ApiBlock
          method="GET"
          endpoint="/v1/crawl/crawl_abc123"
          body={prettyJson(pollResponse)}
          note="Polling returns status, counts, and the per-page data array."
        />
      </div>
    </div>
  )
}

function ApiBlock({
  method,
  endpoint,
  body,
  note,
}: {
  method: string
  endpoint: string
  body: string
  note: string
}) {
  const methodColor =
    method === 'POST'
      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
      : method === 'GET'
        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
        : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-800 dark:bg-zinc-900">
        <span className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${methodColor}`}>{method}</span>
        <span className="truncate font-mono text-[11px] text-zinc-700 dark:text-zinc-300">{endpoint}</span>
      </div>
      <pre className="max-h-56 overflow-auto bg-zinc-950 p-3 text-[11px] leading-relaxed text-zinc-200">
        <code>{body}</code>
      </pre>
      <p className="border-t border-zinc-200 bg-zinc-50 px-3 py-1.5 text-[10px] text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900">
        {note}
      </p>
    </div>
  )
}

// ── Tab: Page Metadata ───────────────────────────────────────────────────────
function MetadataTab({
  page,
  crawled,
  onSelectPage,
}: {
  page: CrawledPage
  crawled: CrawledPage[]
  onSelectPage: (url: string) => void
}) {
  const crawledUrls = new Set(crawled.map((p) => p.url))
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat icon={Gauge} label="Status" value={`${page.statusCode}`} accent={page.statusCode >= 400 ? 'text-rose-500' : 'text-emerald-500'} />
        <Stat icon={Hash} label="Depth" value={`${page.depth}`} accent="text-blue-500" />
        <Stat icon={FileText} label="Tokens" value={page.tokens.toLocaleString()} accent="text-amber-500" />
        <Stat icon={LinkIcon} label="Links" value={`${page.discoveredLinks.length}`} accent="text-violet-500" />
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Raw HTML size</p>
          <p className="mt-0.5 font-mono text-zinc-800 dark:text-zinc-200">{bytesToReadable(page.rawHtmlBytes)}</p>
        </div>
        <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Render + extract</p>
          <p className="mt-0.5 font-mono text-zinc-800 dark:text-zinc-200">{page.elapsedMs} ms</p>
        </div>
      </div>

      {page.discoveredFrom && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50/60 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-900/40">
          <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Discovered from</p>
          <p className="mt-0.5 truncate font-mono text-zinc-700 dark:text-zinc-300">{page.discoveredFrom}</p>
        </div>
      )}

      <div>
        <p className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
          <LinkIcon className="h-3 w-3" />
          Discovered links ({page.discoveredLinks.length})
        </p>
        {page.discoveredLinks.length === 0 ? (
          <p className="text-xs text-zinc-400">This is a leaf page — it links nowhere new.</p>
        ) : (
          <div className="space-y-1">
            {page.discoveredLinks.map((link) => {
              const wasCrawled = crawledUrls.has(link)
              return (
                <button
                  key={link}
                  onClick={() => wasCrawled && onSelectPage(link)}
                  disabled={!wasCrawled}
                  className={`flex w-full items-center justify-between gap-2 rounded-md border px-2.5 py-1.5 text-left text-xs transition ${
                    wasCrawled
                      ? 'cursor-pointer border-zinc-200 bg-white hover:border-orange-300 dark:border-zinc-800 dark:bg-zinc-900'
                      : 'cursor-default border-dashed border-zinc-200 bg-zinc-50/40 dark:border-zinc-800 dark:bg-zinc-900/30'
                  }`}
                >
                  <span className="truncate font-mono text-zinc-600 dark:text-zinc-400">{link}</span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[9px] font-medium ${
                      wasCrawled
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                        : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'
                    }`}
                  >
                    {wasCrawled ? 'crawled' : 'filtered'}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function Stat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Gauge
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="flex flex-col items-center rounded-lg border border-zinc-100 bg-zinc-50/60 p-3 text-center dark:border-zinc-800 dark:bg-zinc-900/40">
      <Icon className={`mb-1.5 h-4 w-4 ${accent}`} />
      <span className="text-[9px] font-medium uppercase tracking-wide text-zinc-500">{label}</span>
      <span className="font-mono text-sm font-semibold text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
  )
}

// ── Glob textarea ────────────────────────────────────────────────────────────
function GlobInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
}: {
  label: string
  hint: string
  value: string[]
  onChange: (next: string[]) => void
  placeholder: string
}) {
  return (
    <div className="space-y-1">
      <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">{label}</span>
      <textarea
        rows={2}
        value={value.join('\n')}
        onChange={(e) =>
          onChange(
            e.target.value
              .split('\n')
              .map((s) => s.trim())
              .filter(Boolean),
          )
        }
        placeholder={placeholder}
        className="w-full resize-none rounded-lg border border-zinc-200 bg-white p-2 font-mono text-[11px] text-zinc-800 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
      />
      <p className="text-[10px] text-zinc-400">{hint}</p>
    </div>
  )
}
