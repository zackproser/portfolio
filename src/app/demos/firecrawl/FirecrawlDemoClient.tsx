'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe,
  Code2,
  FileText,
  Zap,
  ArrowRight,
  Play,
  RotateCcw,
  Search,
  Database,
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Flame,
  Link as LinkIcon,
  Layers,
  Cpu
} from 'lucide-react'
import Link from 'next/link'
import { track } from '@vercel/analytics'
import { getAffiliateLink } from '@/lib/affiliate'

// ─── Types ─────────────────────────────────────────────────────────────────────
type DemoStep = 'idle' | 'crawling' | 'extracting' | 'structuring' | 'done'
type ComparisonTool = 'diy' | 'firecrawl'
type UseCase = 'rag' | 'agent' | 'monitor' | 'dataset'

interface CrawlNode {
  url: string
  depth: number
  status: 'pending' | 'crawling' | 'done'
  x: number
  y: number
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const RAW_HTML = `<!DOCTYPE html>
<html>
<head>
  <title>Acme AI Blog</title>
  <script src="bundle.js"></script>
  <link rel="stylesheet" href="styles.css">
  <meta name="viewport" content="...">
</head>
<body>
  <nav class="header">...</nav>
  <div id="app">
    <article class="post">
      <h1>Building RAG Pipelines</h1>
      <div class="meta">
        <span>Jan 15, 2026</span>
        <span>12 min read</span>
      </div>
      <p>Retrieval-Augmented Generation
      combines the power of LLMs with
      external knowledge bases...</p>
      <div class="sidebar">
        <div class="ad">Buy now!</div>
        <div class="related">...</div>
      </div>
    </article>
  </div>
  <footer>...</footer>
  <script>analytics.track()</script>
</body>
</html>`

const CLEAN_MARKDOWN = `# Building RAG Pipelines

**Published:** Jan 15, 2026 | **Read time:** 12 min

Retrieval-Augmented Generation combines the
power of LLMs with external knowledge bases
to produce grounded, factual responses.

## Why RAG Matters

Traditional LLMs are limited to their training
data. RAG lets you connect them to live,
up-to-date sources...

## Key Components

1. **Document ingestion** - crawl and clean
2. **Chunking** - split into passages
3. **Embedding** - vectorize for retrieval
4. **Generation** - LLM + retrieved context

[Read more](/blog/rag-pipeline)
`

const STRUCTURED_JSON = `{
  "title": "Building RAG Pipelines",
  "author": "Acme AI Team",
  "date": "2026-01-15",
  "readTime": "12 min",
  "content": "Retrieval-Augmented Generation...",
  "links": ["/blog/rag-pipeline"],
  "metadata": {
    "language": "en",
    "wordCount": 2847,
    "topics": ["RAG", "LLM", "AI"]
  }
}`

const USE_CASES: Record<UseCase, { title: string; icon: typeof Database; desc: string; example: string }> = {
  rag: {
    title: 'RAG Pipelines',
    icon: Database,
    desc: 'Feed clean, structured web content into your vector database. Firecrawl strips nav, ads, and boilerplate so your embeddings contain only signal.',
    example: 'Crawl docs.example.com → 847 pages → Clean markdown → Chunk & embed → Vector DB → Your AI answers questions about the docs'
  },
  agent: {
    title: 'AI Agent Research',
    icon: Bot,
    desc: 'Give your AI agents the ability to research the web. Firecrawl returns structured data that agents can reason over without parsing HTML.',
    example: 'Agent needs competitor pricing → Firecrawl scrapes 12 competitor sites → Structured JSON → Agent compares & summarizes findings'
  },
  monitor: {
    title: 'Change Monitoring',
    icon: Search,
    desc: 'Track changes across websites at scale. Crawl periodically and diff the structured output to catch updates, new pages, or removed content.',
    example: 'Monitor 50 regulatory sites daily → Detect policy changes → Alert compliance team → AI summarizes what changed'
  },
  dataset: {
    title: 'Dataset Building',
    icon: Layers,
    desc: 'Build high-quality training and evaluation datasets from web content. Clean extraction means less time on data cleaning.',
    example: 'Crawl 10K technical blogs → Extract article + metadata → Filter by topic → Fine-tuning dataset ready in hours, not weeks'
  }
}

const DIY_STEPS = [
  { label: 'Set up Puppeteer/Playwright', time: '2-4 hours', pain: 'Browser management, memory leaks' },
  { label: 'Handle JS rendering', time: '4-8 hours', pain: 'SPAs, dynamic content, infinite scroll' },
  { label: 'Build content extractor', time: '8-16 hours', pain: 'Site-specific selectors break constantly' },
  { label: 'Strip boilerplate', time: '4-8 hours', pain: 'Nav, ads, footers, cookie banners' },
  { label: 'Manage rate limiting', time: '2-4 hours', pain: 'Respect robots.txt, avoid bans' },
  { label: 'Handle errors & retries', time: '4-8 hours', pain: 'Timeouts, CAPTCHAs, redirects' },
  { label: 'Scale infrastructure', time: '8-16 hours', pain: 'Queues, workers, proxy rotation' },
]

// ─── Hooks ─────────────────────────────────────────────────────────────────────
function useIntersectionObserver(threshold = 0.3): [React.RefCallback<HTMLElement>, boolean] {
  const [isVisible, setIsVisible] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)

  const refCallback = useCallback((node: HTMLElement | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }
    if (!node) return
    observerRef.current = new IntersectionObserver(
      ([entry]) => { setIsVisible(entry.isIntersecting) },
      { threshold }
    )
    observerRef.current.observe(node)
  }, [threshold])

  return [refCallback, isVisible]
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function CrawlVisualization({ step, nodes }: { step: DemoStep; nodes: CrawlNode[] }) {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900">
      <svg className="h-full w-full" viewBox="0 0 600 250">
        {/* Draw edges */}
        {nodes.map((node, i) =>
          i > 0 ? (
            <motion.line
              key={`edge-${i}`}
              x1={nodes[NODE_PARENT_MAP[i]].x}
              y1={nodes[NODE_PARENT_MAP[i]].y}
              x2={node.x}
              y2={node.y}
              stroke={node.status === 'done' ? '#22c55e' : node.status === 'crawling' ? '#f97316' : '#a1a1aa'}
              strokeWidth={1.5}
              strokeDasharray={node.status === 'pending' ? '4 4' : '0'}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            />
          ) : null
        )}
        {/* Draw nodes */}
        {nodes.map((node, i) => (
          <motion.g key={`node-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={i === 0 ? 18 : 12}
              fill={
                node.status === 'done'
                  ? '#22c55e'
                  : node.status === 'crawling'
                    ? '#f97316'
                    : '#71717a'
              }
              animate={
                node.status === 'crawling'
                  ? { r: [12, 15, 12], opacity: [1, 0.7, 1] }
                  : {}
              }
              transition={{ repeat: Infinity, duration: 1 }}
            />
            {i === 0 && (
              <text x={node.x} y={node.y + 4} textAnchor="middle" fill="white" fontSize={12} fontWeight="bold">
                🔥
              </text>
            )}
            <text
              x={node.x}
              y={node.y + (i === 0 ? 32 : 26)}
              textAnchor="middle"
              fill="#a1a1aa"
              fontSize={9}
              className="font-mono"
            >
              {node.url}
            </text>
          </motion.g>
        ))}
      </svg>
      {/* Status overlay */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        {step === 'crawling' && (
          <motion.div
            className="flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
            animate={{ opacity: [1, 0.6, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Globe className="h-3 w-3" /> Crawling pages...
          </motion.div>
        )}
        {(step === 'extracting' || step === 'structuring' || step === 'done') && (
          <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
            <CheckCircle2 className="h-3 w-3" /> {nodes.filter(n => n.status === 'done').length} pages crawled
          </div>
        )}
      </div>
    </div>
  )
}

function CodeBlock({ code, label, highlight }: { code: string; label: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border ${highlight ? 'border-orange-300 dark:border-orange-600' : 'border-zinc-200 dark:border-zinc-700'} overflow-hidden`}>
      <div className={`flex items-center gap-2 px-4 py-2 text-xs font-medium ${highlight ? 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400'}`}>
        {highlight ? <Flame className="h-3 w-3" /> : <Code2 className="h-3 w-3" />}
        {label}
      </div>
      <pre className="max-h-72 overflow-auto bg-white p-4 text-xs leading-relaxed text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function FirecrawlCTA({ context, variant = 'default' }: { context: string; variant?: 'default' | 'hero' }) {
  const link = getAffiliateLink({
    product: 'firecrawl',
    campaign: 'firecrawl-demo',
    medium: 'demo',
    placement: variant === 'hero' ? 'hero-card' : 'compact-card'
  })

  const handleClick = () => {
    track('affiliate_click', {
      product: 'firecrawl',
      context,
      variant,
      campaign: 'firecrawl-demo'
    })
  }

  if (variant === 'hero') {
    return (
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="block"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="relative overflow-hidden rounded-2xl border-2 border-transparent bg-gradient-to-br from-orange-50 to-amber-50 p-6 shadow-lg transition-all hover:border-orange-300 hover:shadow-xl dark:from-zinc-800 dark:to-zinc-900 dark:hover:border-orange-600">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-orange-500 to-red-600 opacity-20 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                <Flame className="h-7 w-7 text-white" />
              </div>
              <Sparkles className="h-5 w-5 text-orange-500" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-zinc-900 dark:text-zinc-100">Firecrawl</h3>
            <p className="mt-1 text-sm font-medium text-zinc-600 dark:text-zinc-300">
              The web crawling API built for AI
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Turn any website into clean, structured data ready for LLMs. Crawl, scrape, and search at scale
              with a single API call. No browser management, no selector maintenance.
            </p>
            <ul className="mt-4 space-y-2">
              {['Clean markdown from any site', 'Handles JS rendering automatically', 'Built-in rate limiting & retries'].map((b, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg">
              Try Firecrawl Free
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </motion.a>
    )
  }

  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 shadow-sm transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800/80"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
        <Flame className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-zinc-900 dark:text-zinc-100">Firecrawl</div>
        <div className="truncate text-xs text-zinc-500 dark:text-zinc-400">Web crawling API for AI &mdash; new users get 10% off</div>
      </div>
      <ArrowRight className="h-4 w-4 text-zinc-400 transition-transform group-hover:translate-x-1" />
    </motion.a>
  )
}

const INITIAL_NODES: CrawlNode[] = [
    { url: 'acme.com', depth: 0, status: 'pending', x: 300, y: 40 },
    { url: '/blog', depth: 1, status: 'pending', x: 120, y: 110 },
    { url: '/docs', depth: 1, status: 'pending', x: 300, y: 110 },
    { url: '/pricing', depth: 1, status: 'pending', x: 480, y: 110 },
    { url: '/blog/rag', depth: 2, status: 'pending', x: 60, y: 190 },
    { url: '/blog/agents', depth: 2, status: 'pending', x: 180, y: 190 },
    { url: '/docs/api', depth: 2, status: 'pending', x: 260, y: 190 },
    { url: '/docs/sdk', depth: 2, status: 'pending', x: 360, y: 190 },
    { url: '/pricing/startup', depth: 2, status: 'pending', x: 460, y: 190 },
    { url: '/pricing/enterprise', depth: 2, status: 'pending', x: 560, y: 190 },
]

// Map of node index to parent index for correct tree structure
const NODE_PARENT_MAP: Record<number, number> = {
  1: 0, 2: 0, 3: 0,        // /blog, /docs, /pricing → acme.com
  4: 1, 5: 1,              // /blog/* → /blog
  6: 2, 7: 2,              // /docs/* → /docs
  8: 3, 9: 3,              // /pricing/* → /pricing
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FirecrawlDemoClient() {
  const [demoStep, setDemoStep] = useState<DemoStep>('idle')
  const [selectedUseCase, setSelectedUseCase] = useState<UseCase>('rag')
  const [comparisonTool, setComparisonTool] = useState<ComparisonTool>('firecrawl')
  const [nodes, setNodes] = useState<CrawlNode[]>([])
  const [pipelineRef, pipelineVisible] = useIntersectionObserver(0.3)
  const [comparisonRef, comparisonVisible] = useIntersectionObserver(0.3)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const hasAutoStartedRef = useRef(false) // Track if demo has auto-started

  const startDemo = useCallback(() => {
    setDemoStep('crawling')
    setNodes(INITIAL_NODES.map((n, i) => ({ ...n, status: i === 0 ? 'crawling' : 'pending' })))

    let step = 0
    const totalNodes = INITIAL_NODES.length

    timerRef.current = setInterval(() => {
      step++
      if (step <= totalNodes) {
        setNodes(prev =>
          prev.map((n, i) => ({
            ...n,
            status: i < step ? 'done' : i === step ? 'crawling' : 'pending'
          }))
        )
      } else if (step === totalNodes + 1) {
        setNodes(prev => prev.map(n => ({ ...n, status: 'done' as const })))
        setDemoStep('extracting')
      } else if (step === totalNodes + 4) {
        setDemoStep('structuring')
      } else if (step === totalNodes + 7) {
        setDemoStep('done')
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }, 400)
  }, [])

  const resetDemo = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setDemoStep('idle')
    setNodes([])
    hasAutoStartedRef.current = true // Prevent auto-restart after manual reset
  }, [])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  // Auto-start on scroll (only once, not after manual reset)
  useEffect(() => {
    if (pipelineVisible && demoStep === 'idle' && !hasAutoStartedRef.current) {
      hasAutoStartedRef.current = true
      startDemo()
    }
  }, [pipelineVisible, demoStep, startDemo])

  return (
    <div className="space-y-16">
      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <header className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
            <Flame className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            Web Scraping for AI
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            See how{' '}
            <span className="font-semibold text-orange-600 dark:text-orange-400">Firecrawl</span>{' '}
            turns messy websites into clean, structured data that LLMs can actually reason with.
            No Puppeteer. No CSS selectors. One API call.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/blog/evolving-web-scraping-pageripper-api"
              className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              Why scraping JS sites is hard →
            </Link>
            <Link
              href="/blog/introducing-pageripper-api"
              className="rounded-full bg-zinc-100 px-4 py-1.5 text-sm text-zinc-700 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
            >
              My history building scrapers →
            </Link>
          </div>
        </motion.div>
      </header>

      {/* Personal context */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl border border-orange-200 bg-orange-50/50 p-5 dark:border-orange-800/50 dark:bg-orange-900/10"
      >
        <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <strong>From someone who built scrapers for years:</strong> I built and maintained{' '}
          <Link href="/blog/introducing-pageripper-api" className="font-medium text-orange-600 underline dark:text-orange-400">
            Pageripper
          </Link>
          , a commercial web scraping API that used Puppeteer to handle JavaScript-heavy sites.
          The infrastructure headaches were real &mdash; browser memory leaks, selector rot, proxy management.
          Firecrawl solves the exact same problems I spent years wrestling with, but as a managed API
          that delivers clean markdown and structured data ready for AI pipelines.
        </p>
      </motion.div>

      {/* ── Section 1: Crawl Pipeline ──────────────────────────────── */}
      <section id="pipeline" ref={pipelineRef}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Crawl Any Website
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Watch Firecrawl spider through a site, following links and discovering pages
            </p>
          </div>
        </div>

        <CrawlVisualization step={demoStep} nodes={nodes} />

        {/* Pipeline steps indicator */}
        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { step: 'crawling' as DemoStep, icon: Globe, label: 'Crawl', desc: 'Spider pages' },
            { step: 'extracting' as DemoStep, icon: Code2, label: 'Extract', desc: 'Parse content' },
            { step: 'structuring' as DemoStep, icon: FileText, label: 'Structure', desc: 'Clean markdown' },
            { step: 'done' as DemoStep, icon: Zap, label: 'Ready', desc: 'For your AI' },
          ].map(({ step: s, icon: Icon, label, desc }) => {
            const isActive = demoStep === s
            const isDone = ['crawling', 'extracting', 'structuring', 'done'].indexOf(demoStep) >=
              ['crawling', 'extracting', 'structuring', 'done'].indexOf(s)
            return (
              <div
                key={s}
                className={`rounded-lg border p-3 text-center transition-colors ${isDone
                    ? 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20'
                    : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-800'
                  }`}
              >
                <Icon className={`mx-auto h-5 w-5 ${isDone ? 'text-orange-600 dark:text-orange-400' : 'text-zinc-400'} ${isActive ? 'animate-pulse' : ''}`} />
                <div className={`mt-1 text-sm font-medium ${isDone ? 'text-orange-700 dark:text-orange-300' : 'text-zinc-500'}`}>{label}</div>
                <div className="text-xs text-zinc-400">{desc}</div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            onClick={demoStep === 'idle' ? startDemo : resetDemo}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg"
          >
            {demoStep === 'idle' ? <Play className="h-4 w-4" /> : <RotateCcw className="h-4 w-4" />}
            {demoStep === 'idle' ? 'Start Crawl' : 'Reset Demo'}
          </button>
        </div>

        <div className="mt-6">
          <FirecrawlCTA context="pipeline-section" />
        </div>
      </section>

      {/* ── Section 2: HTML → Clean Markdown ───────────────────────── */}
      <section id="extraction">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              From Messy HTML to Clean Data
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Firecrawl strips ads, navigation, scripts, and boilerplate &mdash; leaving only content
            </p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <CodeBlock code={RAW_HTML} label="Raw HTML (what you get)" />
          <CodeBlock code={CLEAN_MARKDOWN} label="Firecrawl output (markdown)" highlight />
          <CodeBlock code={STRUCTURED_JSON} label="Structured data (JSON)" highlight />
        </div>

        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 dark:text-green-400" />
            <div className="text-sm text-green-800 dark:text-green-300">
              <strong>No selectors needed.</strong> Firecrawl uses AI to identify main content and strips everything else.
              The output is clean markdown or structured JSON &mdash; ready to chunk and embed for RAG, or feed directly to an LLM.
            </div>
          </div>
        </div>

        <div className="mt-6">
          <FirecrawlCTA context="extraction-section" />
        </div>
      </section>

      {/* ── Section 3: DIY vs Firecrawl ────────────────────────────── */}
      <section id="comparison" ref={comparisonRef}>
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              DIY Scraping vs Firecrawl
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              I built scrapers for years. Here&apos;s what you&apos;re signing up for with DIY
            </p>
          </div>
        </div>

        {/* Toggle */}
        <div className="mb-6 flex rounded-lg border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-700 dark:bg-zinc-800">
          {(['diy', 'firecrawl'] as const).map(tool => (
            <button
              key={tool}
              onClick={() => setComparisonTool(tool)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-all ${comparisonTool === tool
                  ? tool === 'firecrawl'
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                    : 'bg-white text-zinc-900 shadow-md dark:bg-zinc-700 dark:text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
                }`}
            >
              {tool === 'diy' ? '🔧 DIY (Puppeteer + Custom)' : '🔥 Firecrawl API'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {comparisonTool === 'diy' ? (
            <motion.div
              key="diy"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-3"
            >
              {DIY_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-bold text-zinc-500 dark:bg-zinc-700">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">{step.label}</div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-zinc-500">
                        <Clock className="h-3 w-3" /> {step.time}
                      </span>
                      <span className="flex items-center gap-1 text-red-500">
                        <AlertTriangle className="h-3 w-3" /> {step.pain}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <div className="text-sm font-medium text-red-800 dark:text-red-300">
                  Total: 32&ndash;64 hours of engineering time, plus ongoing maintenance as sites change their markup
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="firecrawl"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div className="rounded-xl border border-orange-200 bg-white p-6 dark:border-orange-800 dark:bg-zinc-800">
                <CodeBlock
                  code={`import Firecrawl from '@mendable/firecrawl-js'

const app = new Firecrawl({ apiKey: 'fc-...' })

// Crawl an entire site
const result = await app.crawlUrl('https://acme.com', {
  limit: 100,
  scrapeOptions: {
    formats: ['markdown', 'html']
  }
})

// Each page: clean markdown + metadata
result.data.forEach(page => {
  console.log(page.markdown)  // Clean content
  console.log(page.metadata)  // Title, desc, links
})`}
                  label="That's it. ~10 lines of code."
                  highlight
                />
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { label: 'Setup time', value: '5 min', icon: Clock },
                    { label: 'JS rendering', value: 'Automatic', icon: Zap },
                    { label: 'Maintenance', value: 'Zero', icon: CheckCircle2 },
                  ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="rounded-lg border border-green-200 bg-green-50 p-3 text-center dark:border-green-800 dark:bg-green-900/20">
                      <Icon className="mx-auto h-5 w-5 text-green-600 dark:text-green-400" />
                      <div className="mt-1 text-sm font-bold text-green-800 dark:text-green-300">{value}</div>
                      <div className="text-xs text-green-600 dark:text-green-400">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-6">
          <FirecrawlCTA context="comparison-section" />
        </div>
      </section>

      {/* ── Section 4: Use Cases ───────────────────────────────────── */}
      <section id="use-cases">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              What You Can Build
            </h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Clean web data unlocks powerful AI applications
            </p>
          </div>
        </div>

        {/* Use case tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {(Object.keys(USE_CASES) as UseCase[]).map(uc => {
            const { title, icon: Icon } = USE_CASES[uc]
            return (
              <button
                key={uc}
                onClick={() => setSelectedUseCase(uc)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${selectedUseCase === uc
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md'
                    : 'border border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {title}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedUseCase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {USE_CASES[selectedUseCase].title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {USE_CASES[selectedUseCase].desc}
            </p>
            <div className="mt-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-900">
              <div className="text-xs font-medium uppercase tracking-wide text-zinc-400">Example Pipeline</div>
              <p className="mt-1 font-mono text-sm text-zinc-700 dark:text-zinc-300">
                {USE_CASES[selectedUseCase].example}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────────── */}
      <section className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 p-8 dark:from-zinc-800 dark:to-zinc-900">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            Stop building scrapers. Start building AI.
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            Firecrawl handles the crawling, rendering, and extraction so you can focus on
            what matters &mdash; building intelligent applications with clean data.
          </p>
        </div>
        <div className="mx-auto mt-8 max-w-md">
          <FirecrawlCTA context="final-cta" variant="hero" />
        </div>

        {/* Related content */}
        <div className="mt-8">
          <h3 className="mb-4 text-center text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Related reading
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link
              href="/blog/evolving-web-scraping-pageripper-api"
              className="group rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="text-sm font-medium text-zinc-900 group-hover:text-orange-600 dark:text-zinc-100 dark:group-hover:text-orange-400">
                Evolving Web Scraping: How to Handle JavaScript-Heavy Sites
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                The technical challenges of scraping SPAs and how modern tools solve them
              </p>
            </Link>
            <Link
              href="/blog/introducing-pageripper-api"
              className="group rounded-lg border border-zinc-200 bg-white p-4 transition-all hover:shadow-md dark:border-zinc-700 dark:bg-zinc-800"
            >
              <div className="text-sm font-medium text-zinc-900 group-hover:text-orange-600 dark:text-zinc-100 dark:group-hover:text-orange-400">
                Building a Commercial Web Scraping API
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                My experience building Pageripper and lessons learned about scraping at scale
              </p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
