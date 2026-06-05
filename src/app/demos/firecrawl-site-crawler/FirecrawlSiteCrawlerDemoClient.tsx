'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { track } from '@vercel/analytics'
import {
  Flame,
  ChevronDown,
  MousePointerClick,
  ArrowRight,
  Globe,
  Map as MapIcon,
  FileText,
  Gauge,
  Filter,
  Coins,
  Sparkles,
} from 'lucide-react'

import Newsletter from '@/components/Newsletter'
import { getAffiliateLink, type AffiliatePlacement } from '@/lib/affiliate'

import { SEED_SITES } from './data'
import { DEFAULT_CONFIG, simulateCrawl, type CrawlConfig } from './utils'
import FirecrawlCrawlVisualization from './FirecrawlCrawlVisualization'
import FirecrawlCrawlInspector from './FirecrawlCrawlInspector'

const CAMPAIGN = 'firecrawl-site-crawler'

function affiliateHref(placement: AffiliatePlacement) {
  return getAffiliateLink({ product: 'firecrawl', campaign: CAMPAIGN, medium: 'demo', placement })
}

function trackAffiliate(placement: string) {
  track('affiliate_click', { product: 'firecrawl', demo: 'site-crawler', placement })
}

export default function FirecrawlSiteCrawlerDemoClient() {
  const [siteIndex, setSiteIndex] = useState(0)
  const site = SEED_SITES[siteIndex]

  // Shared crawl config. Selecting a new site resets it to that site's defaults.
  const [config, setConfig] = useState<CrawlConfig>({
    ...DEFAULT_CONFIG,
    includePaths: site.defaultIncludePaths,
    excludePaths: site.defaultExcludePaths,
  })

  const [pendingConfig, setPendingConfig] = useState<CrawlConfig>(config)
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null)
  const [showIntroDetails, setShowIntroDetails] = useState(false)

  // Debounce config edits so dragging a slider doesn't thrash the simulation.
  useEffect(() => {
    const id = setTimeout(() => setConfig(pendingConfig), 350)
    return () => clearTimeout(id)
  }, [pendingConfig])

  // Re-run the (pure) simulation whenever the committed config or site changes.
  const result = useMemo(() => simulateCrawl(site, config), [site, config])

  const handleSelectSite = (index: number) => {
    const next = SEED_SITES[index]
    setSiteIndex(index)
    const nextConfig: CrawlConfig = {
      ...DEFAULT_CONFIG,
      includePaths: next.defaultIncludePaths,
      excludePaths: next.defaultExcludePaths,
    }
    setConfig(nextConfig)
    setPendingConfig(nextConfig)
    setSelectedUrl(null)
  }

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="space-y-3 pt-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
          <Flame className="h-3.5 w-3.5" />
          Firecrawl demo
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
          Crawl an entire website into LLM-ready data
        </h1>
        <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
          Watch Firecrawl discover every URL on a site, render each page, and turn it into clean markdown you can drop
          straight into a RAG pipeline.
        </p>
      </div>

      {/* Hero affiliate card */}
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center justify-between gap-3 rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 to-rose-50 p-5 dark:border-orange-900/40 dark:from-orange-950/30 dark:to-rose-950/20 sm:flex-row">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              This demo simulates Firecrawl. The real API does it for any site.
            </p>
            <p className="mt-0.5 text-xs text-zinc-600 dark:text-zinc-400">
              Start on the free tier — 500 credits, no credit card.
            </p>
          </div>
          <a
            href={affiliateHref('hero-card')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAffiliate('hero-card')}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            Try Firecrawl free
          </a>
        </div>
      </div>

      {/* Intro card: what + how */}
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 via-amber-50 to-rose-50 p-[1px] shadow-lg shadow-orange-500/10 dark:border-transparent dark:from-orange-600 dark:via-rose-600 dark:to-amber-700 dark:shadow-orange-500/20">
          <div className="relative rounded-[15px] bg-gradient-to-br from-white via-orange-50/50 to-rose-50/50 p-5 dark:from-slate-900 dark:via-rose-950/80 dark:to-slate-900 sm:p-6">
            <div className="relative flex flex-col items-start gap-6 lg:flex-row">
              {/* What */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-rose-600 shadow-lg shadow-orange-500/30">
                    <MapIcon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">What crawling does</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-orange-100/90">
                  A crawl starts at one URL, finds every linked page (and the sitemap), renders each one, and returns
                  clean markdown. <strong className="text-zinc-900 dark:text-white">/map</strong> lists the URLs;{' '}
                  <strong className="text-zinc-900 dark:text-white">/crawl</strong> fetches and converts them.
                </p>
                <button
                  onClick={() => setShowIntroDetails((v) => !v)}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 transition-colors hover:text-orange-800 dark:text-orange-300 dark:hover:text-white"
                >
                  <span className="border-b border-orange-400/50 group-hover:border-orange-600 dark:border-orange-400/50 dark:group-hover:border-white/50">
                    {showIntroDetails ? 'Hide details' : 'Why scrape page-by-page?'}
                  </span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showIntroDetails ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showIntroDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-3 pt-2 sm:grid-cols-2">
                        <div className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-100/80 p-3 dark:border-rose-500/20 dark:bg-rose-500/10">
                          <Filter className="mt-0.5 h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                          <div>
                            <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">Hand-rolled scraping</p>
                            <p className="mt-0.5 text-xs text-rose-600/80 dark:text-rose-200/70">
                              You write a queue, a renderer, retry logic, and a HTML-to-markdown step for every site.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-100/80 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                          <div>
                            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">One crawl call</p>
                            <p className="mt-0.5 text-xs text-emerald-600/80 dark:text-emerald-200/70">
                              Firecrawl handles JS rendering and chrome stripping; you get markdown back.
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden w-px self-center bg-gradient-to-b from-transparent via-orange-300/40 to-transparent dark:via-orange-400/30 lg:block lg:h-32" />
              <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-300/40 to-transparent dark:via-orange-400/30 lg:hidden" />

              {/* How to use */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-600 shadow-lg shadow-rose-500/30">
                    <MousePointerClick className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">How to use this demo</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    'Pick a site, then press Play crawl to watch URLs get discovered by depth.',
                    'Click any crawled page to open it in the inspector below.',
                    'Change maxDepth, limit, or path filters — the crawl re-runs instantly.',
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-orange-100/90">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 dark:bg-orange-500/30 dark:text-orange-200">
                        {i + 1}
                      </div>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Site picker */}
      <div className="mx-auto flex max-w-4xl flex-col gap-3 sm:flex-row">
        {SEED_SITES.map((s, i) => {
          const isActive = i === siteIndex
          return (
            <button
              key={s.id}
              onClick={() => handleSelectSite(i)}
              className={`flex flex-1 flex-col rounded-xl border p-3 text-left transition ${
                isActive
                  ? 'border-orange-400 bg-orange-50 shadow-sm dark:border-orange-700 dark:bg-orange-900/20'
                  : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-2">
                <Globe className={`h-4 w-4 ${isActive ? 'text-orange-500' : 'text-zinc-400'}`} />
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{s.name}</span>
              </div>
              <span className="mt-1 font-mono text-[11px] text-zinc-500">{s.domain}</span>
              <span className="mt-1 inline-block w-fit rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {s.kind}
              </span>
            </button>
          )
        })}
      </div>

      {/* Visualization */}
      <FirecrawlCrawlVisualization
        site={site}
        result={result}
        selectedUrl={selectedUrl}
        onSelectPage={(url) => {
          setSelectedUrl(url)
          if (typeof document !== 'undefined') {
            document.getElementById('crawl-inspector')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }}
      />

      {/* Inline CTA */}
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 p-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:flex-row">
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            Every page above became clean markdown. Point the real API at your own docs and get the same output.
          </p>
          <a
            href={affiliateHref('inline-cta')}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAffiliate('inline-cta')}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-orange-300 bg-white px-4 py-2 text-sm font-semibold text-orange-700 transition hover:bg-orange-50 dark:border-orange-800 dark:bg-zinc-900 dark:text-orange-300"
          >
            Crawl your site
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Inspector */}
      <div id="crawl-inspector">
        <FirecrawlCrawlInspector
          site={site}
          result={result}
          config={pendingConfig}
          setConfig={setPendingConfig}
          selectedUrl={selectedUrl}
          onSelectPage={setSelectedUrl}
        />
      </div>

      {/* Closing CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-rose-50/30 dark:from-orange-950/20 dark:via-transparent dark:to-rose-950/10" />
        <div className="relative mx-auto max-w-4xl px-6 py-12 md:py-16">
          <div className="space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 backdrop-blur-sm dark:bg-orange-900/40 dark:text-orange-200">
              Build the real thing
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
              Turn any site into a corpus in one API call
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg">
              Firecrawl is the crawler I reach for on applied-AI projects. It renders JavaScript, follows links by
              depth, respects your path filters, and returns markdown that is ready to chunk and embed. The free tier
              gives you 500 credits to crawl your first site today.
            </p>

            <div className="mx-auto grid max-w-3xl gap-3 text-zinc-600 dark:text-zinc-300 sm:grid-cols-3">
              <Feature icon={MapIcon} text="One call maps every URL — sitemap plus on-page links." />
              <Feature icon={Gauge} text="Depth, limit, and path globs keep crawls fast and on-budget." />
              <Feature icon={Coins} text="Clean markdown means fewer tokens and lower model cost." />
            </div>

            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              <a
                href={affiliateHref('inline-cta')}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackAffiliate('closing-cta')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-rose-500 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-orange-600 hover:to-rose-600 hover:shadow-xl"
              >
                <Flame className="h-5 w-5" />
                Start crawling free — 500 credits
              </a>
              <Link
                href="/demos/firecrawl-knowledge-base"
                className="inline-flex items-center justify-center rounded-lg border border-orange-300/60 bg-white/80 px-6 py-3 text-base font-medium text-orange-700 backdrop-blur-sm transition-all hover:border-orange-400 hover:bg-orange-50/80 dark:border-orange-700/60 dark:bg-zinc-900/80 dark:text-orange-200 dark:hover:bg-zinc-800/80"
              >
                See the knowledge-base demo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8">
        <Newsletter
          title="Build with web data"
          body="Crawling, structured extraction, and RAG pipelines that hold up in production. Weekly, no spam."
          successMessage="You're in! Web-scraping and RAG content coming your way."
          onSubscribe={() => track('site_crawler_demo_newsletter_subscribe')}
          position="firecrawl-site-crawler-demo-footer"
          tags={['interest:web-scraping', 'source:demo']}
        />
      </div>
    </div>
  )
}

function Feature({ icon: Icon, text }: { icon: typeof MapIcon; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-950/20">
      <Icon className="h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
      <span className="text-sm leading-relaxed">{text}</span>
    </div>
  )
}
