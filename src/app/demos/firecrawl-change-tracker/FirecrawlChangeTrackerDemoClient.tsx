'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Flame,
  MousePointerClick,
  ChevronDown,
  Bell,
  GitCompare,
  Clock,
  ArrowRight,
  ShieldCheck,
  Gauge,
  Webhook,
  ExternalLink,
} from 'lucide-react'

import { track } from '@vercel/analytics'
import Newsletter from '@/components/Newsletter'
import { getAffiliateLink } from '@/lib/affiliate'

import { MONITORED_PAGES, CATEGORY_META } from './data'
import FirecrawlMonitorVisualization from './FirecrawlMonitorVisualization'
import FirecrawlMonitorInspector from './FirecrawlMonitorInspector'
import FirecrawlLiveScrape from './FirecrawlLiveScrape'
import FirecrawlCodeExport from './FirecrawlCodeExport'
import {
  buildChangeEvents,
  type DiffMode,
  type MonitorFrequency,
} from './utils'

const HERO_IMAGE = 'https://zackproser.b-cdn.net/images/fc-tracker-demo-hero.webp'

const VALID_FREQUENCIES: MonitorFrequency[] = ['hourly', 'daily', 'weekly']

const CAMPAIGN = 'firecrawl-change-tracker'

function fireAffiliate(placement: string) {
  track('affiliate_click', { product: 'firecrawl', demo: 'change-tracker', placement })
}

const CATEGORY_BADGE: Record<string, string> = {
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  purple: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

export default function FirecrawlChangeTrackerDemoClient() {
  const searchParams = useSearchParams()
  const embed = searchParams.get('embed') === '1'

  // Resolve deep-link params once on mount. `page` is an index or page id,
  // `mode` is the active diff mode, `freq` is the monitoring frequency.
  const initial = useMemo(() => {
    const pageParam = searchParams.get('page')
    let pageId = MONITORED_PAGES[0].id
    if (pageParam) {
      const byId = MONITORED_PAGES.find((p) => p.id === pageParam)
      const asIndex = Number.parseInt(pageParam, 10)
      if (byId) pageId = byId.id
      else if (!Number.isNaN(asIndex) && MONITORED_PAGES[asIndex]) pageId = MONITORED_PAGES[asIndex].id
    }

    const modeParam = searchParams.get('mode')
    let modes: DiffMode[] = ['git-diff', 'json']
    if (modeParam === 'git-diff' || modeParam === 'json') modes = [modeParam]

    const freqParam = searchParams.get('freq') as MonitorFrequency | null
    const frequency: MonitorFrequency =
      freqParam && VALID_FREQUENCIES.includes(freqParam) ? freqParam : 'daily'

    return { pageId, modes, frequency }
    // Intentionally read params only on mount; subsequent state changes write
    // back to the URL via the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Shared state across visualization + inspector.
  const [selectedPageId, setSelectedPageId] = useState(initial.pageId)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [modes, setModes] = useState<DiffMode[]>(initial.modes)
  const [frequency, setFrequency] = useState<MonitorFrequency>(initial.frequency)
  const [showIntroDetails, setShowIntroDetails] = useState(false)

  const page = useMemo(
    () => MONITORED_PAGES.find((p) => p.id === selectedPageId) ?? MONITORED_PAGES[0],
    [selectedPageId]
  )

  // Per-page schema editing state, seeded from the page's default schema.
  const [schema, setSchema] = useState(page.schema)

  const events = useMemo(() => buildChangeEvents(page), [page])

  // When the page changes, reset selection + schema to that page's defaults.
  useEffect(() => {
    setSelectedEventId(null)
    setSchema(page.schema)
  }, [page])

  // Write shareable state back to the URL without a navigation/scroll.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    params.set('page', selectedPageId)
    params.set('freq', frequency)
    // Only encode `mode` when a single diff mode is active; both is the default.
    if (modes.length === 1) params.set('mode', modes[0])
    else params.delete('mode')
    if (embed) params.set('embed', '1')
    const query = params.toString()
    window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
  }, [selectedPageId, frequency, modes, embed])

  const selectedEvent = useMemo(
    () => events.find((e) => e.id === selectedEventId) ?? null,
    [events, selectedEventId]
  )
  const selectedSnapshot = useMemo(
    () =>
      selectedEvent
        ? page.snapshots.find((s) => s.id === selectedEvent.snapshotId) ?? null
        : null,
    [selectedEvent, page.snapshots]
  )

  const heroLink = getAffiliateLink({
    product: 'firecrawl',
    campaign: CAMPAIGN,
    medium: 'demo',
    placement: 'hero-card',
  })
  const inlineLink = getAffiliateLink({
    product: 'firecrawl',
    campaign: CAMPAIGN,
    medium: 'demo',
    placement: 'inline-cta',
  })
  const ctaLink = getAffiliateLink({
    product: 'firecrawl',
    campaign: CAMPAIGN,
    medium: 'demo',
    placement: 'sticky-cta',
  })
  const textLink = getAffiliateLink({
    product: 'firecrawl',
    campaign: CAMPAIGN,
    medium: 'demo',
    placement: 'text-link',
  })

  return (
    <div className={embed ? 'space-y-4' : 'space-y-6'}>
      {/* Hero image — full-width banner, hidden in embed mode */}
      {!embed && (
        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl">
          <Image
            src={HERO_IMAGE}
            alt="Firecrawl change-tracking demo"
            width={1200}
            height={1200}
            priority
            className="w-full max-h-64 object-cover rounded-xl"
          />
        </div>
      )}

      {/* Hero header */}
      {!embed && (
        <div className="space-y-3 pt-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
            Monitor any website for changes
          </h1>
          <p className="mx-auto max-w-2xl text-base text-zinc-600 dark:text-zinc-400">
            Know the instant a page changes — pricing, docs, competitors, compliance. Watch a scheduled scrape detect a change, compute the diff, and fire an alert.
          </p>
        </div>
      )}

      {/* Intro card: what it is + how to use */}
      {!embed && (
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-orange-200/60 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50 p-[1px] shadow-lg shadow-orange-500/10 dark:border-transparent dark:from-orange-600 dark:via-red-600 dark:to-rose-700 dark:shadow-orange-500/20">
          <div className="relative rounded-[15px] bg-gradient-to-br from-white via-orange-50/50 to-amber-50/50 p-5 dark:from-slate-900 dark:via-red-950/90 dark:to-slate-900 sm:p-6">
            <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-gradient-to-br from-orange-400/10 to-transparent blur-3xl dark:from-red-500/20" />

            <div className="relative flex flex-col items-start gap-6 lg:flex-row">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg shadow-orange-500/30">
                    <GitCompare className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">What is change tracking?</h3>
                </div>
                <p className="text-sm leading-relaxed text-zinc-700 dark:text-orange-100/90">
                  Firecrawl scrapes a page on a schedule and compares each scrape to the previous one. You get a{' '}
                  <strong className="text-zinc-900 dark:text-white">changeStatus</strong>, a line-level git-diff, and field-level JSON diffs against a schema you define — without writing your own diffing or storage.
                </p>
                <button
                  onClick={() => setShowIntroDetails(!showIntroDetails)}
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 transition-colors hover:text-orange-800 dark:text-orange-300 dark:hover:text-white"
                >
                  <span className="border-b border-orange-400/50 group-hover:border-orange-600 dark:border-orange-400/50 dark:group-hover:border-white/50">
                    {showIntroDetails ? 'Hide details' : 'Where this helps'}
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
                        {[
                          { icon: Gauge, label: 'Competitive intel', text: 'Catch competitor price and plan changes the day they ship.' },
                          { icon: GitCompare, label: 'Docs drift', text: 'Flag breaking API doc changes before they break your integration.' },
                          { icon: ShieldCheck, label: 'Compliance', text: 'Surface ToS and data-retention changes for legal review.' },
                          { icon: Bell, label: 'Alerting', text: 'Fire a webhook or Slack message the moment something moves.' },
                        ].map(({ icon: Icon, label, text }) => (
                          <div key={label} className="flex items-start gap-2.5 rounded-lg border border-orange-200 bg-orange-100/60 p-3 dark:border-orange-500/20 dark:bg-orange-500/10">
                            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-orange-600 dark:text-orange-400" />
                            <div>
                              <p className="text-xs font-semibold text-orange-700 dark:text-orange-300">{label}</p>
                              <p className="mt-0.5 text-xs text-orange-600/80 dark:text-orange-200/70">{text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="hidden w-px self-center bg-gradient-to-b from-transparent via-orange-300/40 to-transparent lg:block lg:h-32 dark:via-orange-400/30" />
              <div className="h-px w-full bg-gradient-to-r from-transparent via-orange-300/40 to-transparent lg:hidden dark:via-orange-400/30" />

              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-rose-600 shadow-lg shadow-red-500/30">
                    <MousePointerClick className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white">How to use this demo</h3>
                </div>
                <div className="space-y-2.5">
                  {[
                    <>Pick a monitored page below, then press <strong className="text-zinc-900 dark:text-white">Play</strong></>,
                    <>Watch the scheduler fire, scrape, compare, and alert in the diagram</>,
                    <>Click any timeline marker to inspect its <strong className="text-zinc-900 dark:text-white">diff, JSON, response, and alert</strong></>,
                  ].map((node, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-orange-100/90">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-xs font-bold text-orange-700 dark:bg-red-500/30 dark:text-orange-200">{i + 1}</div>
                      <span>{node}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Hero affiliate card */}
      {!embed && (
      <div className="mx-auto max-w-4xl">
        <a
          href={heroLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => fireAffiliate('hero-card')}
          className="group flex items-center justify-between gap-4 rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 px-5 py-4 transition hover:shadow-md dark:border-orange-900/50 dark:from-orange-950/30 dark:to-red-950/30"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-md">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">This demo simulates Firecrawl change tracking</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">Run it for real with the free tier — 500 credits, no credit card.</p>
            </div>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition group-hover:shadow-lg">
            Try Firecrawl
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </a>
      </div>
      )}

      {/* Page selector */}
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {MONITORED_PAGES.map((p) => {
            const active = p.id === selectedPageId
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPageId(p.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  active
                    ? 'border-orange-300 bg-orange-50/70 shadow-sm dark:border-orange-700 dark:bg-orange-950/30'
                    : 'border-zinc-200 bg-white hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/40'
                }`}
              >
                <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${CATEGORY_BADGE[CATEGORY_META[p.category].tone]}`}>
                  {CATEGORY_META[p.category].label}
                </span>
                <p className="mt-1.5 text-xs font-semibold text-zinc-900 dark:text-zinc-100">{p.label}</p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-zinc-500 dark:text-zinc-400">{p.url}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Visualization */}
      <FirecrawlMonitorVisualization
        page={page}
        events={events}
        selectedEventId={selectedEventId}
        onSelectEvent={setSelectedEventId}
        frequency={frequency}
        onFrequencyChange={setFrequency}
      />

      {/* Inline CTA mid-demo */}
      {!embed && (
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/60 px-5 py-4 dark:border-zinc-800 dark:bg-zinc-900/40 sm:flex-row">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 shrink-0 text-orange-500" />
            <p className="text-sm text-zinc-700 dark:text-zinc-300">
              Scheduling this on a real cron is a few lines. Run your first scrape with the{' '}
              <a href={textLink} target="_blank" rel="noopener noreferrer" onClick={() => fireAffiliate('text-link')} className="font-semibold text-orange-600 underline decoration-orange-400/50 underline-offset-2 hover:text-orange-700 dark:text-orange-400">
                free Firecrawl tier
              </a>
              .
            </p>
          </div>
          <a
            href={inlineLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => fireAffiliate('inline-cta')}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
          >
            <Flame className="h-4 w-4" />
            Start free
          </a>
        </div>
      </div>
      )}

      {/* Inspector */}
      <div id="inspector">
        <FirecrawlMonitorInspector
          page={page}
          event={selectedEvent}
          snapshot={selectedSnapshot}
          modes={modes}
          onModesChange={setModes}
          schema={schema}
          onSchemaChange={setSchema}
          frequency={frequency}
          onFrequencyChange={setFrequency}
        />
      </div>

      {/* Code export — current config as runnable Node.js / Python */}
      <div className="mx-auto w-full max-w-7xl">
        <FirecrawlCodeExport url={page.url} modes={modes} schema={schema} />
      </div>

      {/* Live mode — scrape a real URL through the Firecrawl API */}
      <div className="mx-auto w-full max-w-7xl">
        <FirecrawlLiveScrape initialUrl={page.url} initialSchema={schema} modes={modes} />
      </div>

      {/* Closing trust / CTA section */}
      {!embed && (
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 via-transparent to-red-50/30 dark:from-orange-950/20 dark:via-transparent dark:to-red-950/10" />
        <div className="relative mx-auto max-w-4xl px-6 py-12 md:py-16">
          <div className="space-y-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-orange-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 backdrop-blur-sm dark:bg-orange-900/40 dark:text-orange-200">
              Build the real monitor
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              Ship this monitor for real with Firecrawl
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg">
              The diffing, snapshot storage, and JSON extraction you watched here are one API call away. Firecrawl handles the scrape, the comparison, and the structured diff so your scheduler only has to call it and forward the alert.
            </p>

            <div className="mx-auto grid max-w-3xl gap-3 text-zinc-600 dark:text-zinc-300 sm:grid-cols-3">
              {[
                { icon: GitCompare, text: 'changeStatus, git-diff, and JSON field diffs returned in one /v2/scrape call.' },
                { icon: Webhook, text: 'Wire the response straight into a webhook, Slack message, or your own queue.' },
                { icon: Gauge, text: 'Free tier ships with 500 credits — enough to stand up a real monitor today.' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex flex-col items-center gap-2 rounded-lg p-4 text-center transition-colors hover:bg-orange-50/50 dark:hover:bg-orange-950/20">
                  <Icon className="h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
                  <span className="text-sm leading-relaxed">{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
              <a
                href={ctaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => fireAffiliate('sticky-cta')}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 px-6 py-3 text-base font-semibold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:from-orange-400 hover:to-red-500 hover:shadow-xl"
              >
                <Flame className="h-5 w-5" />
                Start free with 500 credits
              </a>
              <a
                href="https://docs.firecrawl.dev/features/change-tracking"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => fireAffiliate('text-link')}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-orange-300/60 bg-white/80 px-6 py-3 text-base font-medium text-orange-700 backdrop-blur-sm transition-all hover:border-orange-400 hover:bg-orange-50/80 dark:border-orange-700/60 dark:bg-zinc-900/80 dark:text-orange-200 dark:hover:bg-zinc-800/80"
              >
                Read the change-tracking docs
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
      )}

      {!embed && (
      <div className="mt-8">
        <Newsletter
          title="Build with web data"
          body="Get practical write-ups on scraping, change monitoring, and building AI features on live web data."
          successMessage="You're in. Web-data engineering content is on the way."
          onSubscribe={() => track('change_tracker_demo_newsletter_subscribe')}
          position="firecrawl-change-tracker-demo-footer"
          tags={['interest:web-scraping', 'source:demo']}
        />
      </div>
      )}
    </div>
  )
}
