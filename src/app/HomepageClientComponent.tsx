'use client'

import Link from 'next/link'
import Image from 'next/image'
import { track } from '@vercel/analytics'
import { EditorialCard } from '@/components/EditorialCard'
import { SectionHead } from '@/components/SectionHead'
import { MindOnFireHero } from '@/components/MindOnFireHero'
import HomepageAdvisorSection from '@/components/advisor/HomepageAdvisorSection'
import RenderNumYearsExperience from '@/components/NumYearsExperience'
import { speakingEngagements } from './speaking/speaking-data'
import type { Content } from '@/types/content'

/* ------------------------------------------------------------------
 * Editorial homepage — restrained, engineering-paper aesthetic.
 * See src/styles/editorial-home.css for the primitive styles.
 * ------------------------------------------------------------------ */

type Article = Content

interface Props {
  deepMLTutorials: Article[]
  mlProjects: Article[]
  aiDev: Article[]
  refArchitectures: Article[]
  careerAdvice: Article[]
  videos: Article[]
}

// ----- Hero ---------------------------------------------------------
// The Mind on Fire hero: the mark alive over the essay corpus.
// See src/components/MindOnFireHero.tsx — everything below it is unchanged.

function EditorialHero() {
  return <MindOnFireHero />
}

// ----- Stat row -----------------------------------------------------

function StatRow() {
  const yearsExperience = RenderNumYearsExperience()
  const yearsWritingOnline = Math.abs(new Date('January 1 2005').getFullYear() - new Date().getFullYear())
  const stats = [
    { num: String(yearsExperience), unit: 'yrs', label: 'Shipping software' },
    { num: '5,000', unit: '+', label: 'Newsletter readers' },
    { num: '184', unit: 'wpm', label: 'Voice-coding velocity' },
    { num: String(yearsWritingOnline), unit: 'yrs', label: 'Writing online' },
  ]
  return (
    <section className="pb-12">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="editorial-stats text-charcoal-50 dark:text-parchment-100">
          {stats.map((s, i) => (
            <div key={i} className="editorial-stat">
              <div className="editorial-stat-num">
                {s.num}
                <span className="unit">{s.unit}</span>
              </div>
              <div className="editorial-stat-label text-parchment-600 dark:text-slate-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ----- Featured Workshops (primary slot) ---------------------------

function FeaturedWorkshops() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
          Featured engagement
        </div>
        <article className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:gap-16 items-start">
          <div>
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-bold font-mono uppercase tracking-wider text-burnt-600 dark:text-amber-300 border border-burnt-400/50 dark:border-amber-400/50 bg-burnt-400/10 dark:bg-transparent">
                Workshops · From $15k
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-semibold font-mono uppercase tracking-wider text-green-700 dark:text-green-300 border border-green-600/40">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                Booking · Q3 open
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold leading-[1.08] tracking-tight text-charcoal-50 dark:text-parchment-100 text-balance">
              Make Claude{' '}
              <em className="italic text-burnt-400 dark:text-amber-400">how your team works</em>
              {' '}— by default.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-parchment-600 dark:text-slate-300 max-w-[52ch]">
              Three practitioners who ship with Claude daily at WorkOS come into your team — single team or
              whole org — and embed inside your pods. We leave you with workflows, skills, and named
              champions. Half-day, full-day, or two-day.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-4 max-w-md">
              {[
                ['Crew', '1 – 3 practitioners'],
                ['Shape', '½ – 2 days'],
                ['For', 'Team or whole org'],
              ].map(([label, val]) => (
                <div key={label}>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-parchment-500 dark:text-slate-500">
                    {label}
                  </div>
                  <div className="font-mono text-sm font-semibold text-charcoal-50 dark:text-parchment-100 mt-1">
                    {val}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/workshops/claude-cowork#book"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
                onClick={() =>
                  track('featured_engagement_click', {
                    location: 'hero_section',
                    product: 'claude_workshops',
                    action: 'book',
                  })
                }
              >
                Book a workshop →
              </Link>
              <Link
                href="/workshops/claude-cowork#engagements"
                className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-parchment-100 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
                onClick={() =>
                  track('featured_engagement_click', {
                    location: 'hero_section',
                    product: 'claude_workshops',
                    action: 'engagements',
                  })
                }
              >
                Engagement shapes →
              </Link>
            </div>
          </div>

          {/* Booking card — terminal-style calendar of upcoming weeks */}
          <div className="rounded-md border border-parchment-300 dark:border-slate-700 bg-parchment-50 dark:bg-slate-800 shadow-md p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400">
              <span className="font-bold text-burnt-400 dark:text-amber-400">~/workshops — calendar</span>
              <span>Live</span>
            </div>
            <h3 className="font-serif text-[21px] font-bold leading-tight tracking-tight text-charcoal-50 dark:text-parchment-100 m-0">
              Booking the next collaboration weeks.
            </h3>
            <div className="h-px bg-parchment-300 dark:bg-slate-700" />
            {[
              { when: 'Jun 17', what: 'Healthcare · Org-wide', who: 'Booked', open: false },
              { when: 'Jul 22', what: 'Fintech · Two-day', who: 'Booked', open: false },
              { when: 'Aug — open', what: 'Your org here', who: '→', open: true },
              { when: 'Sep — open', what: 'Your org here', who: '→', open: true },
            ].map((row) => (
              <div
                key={row.when}
                className="grid grid-cols-[92px_1fr_auto] gap-3 items-baseline font-mono text-[12px] py-1"
              >
                <span className="text-parchment-500 dark:text-slate-500">{row.when}</span>
                <span
                  className={`font-semibold ${
                    row.open
                      ? 'text-burnt-400 dark:text-amber-400'
                      : 'text-charcoal-50 dark:text-parchment-100'
                  }`}
                >
                  {row.what}
                </span>
                <span className="italic text-parchment-600 dark:text-slate-400">{row.who}</span>
              </div>
            ))}
            <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-[0.1em] text-parchment-600 dark:text-slate-400 mt-2 pt-4 border-t border-parchment-300 dark:border-slate-700">
              <span>Typical lead time 6–10 wk</span>
              <Link
                href="/workshops/claude-cowork#book"
                className="text-burnt-400 dark:text-amber-400 no-underline hover:underline"
              >
                Hold a date →
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}

// ----- Featured Speaking (talks, workshops, keynotes) -------------

function FeaturedSpeaking() {
  const hero = {
    slug: 'untethered-productivity',
    event: 'AI Engineering London',
    date: 'June 2026',
    title: 'Untethered Productivity',
    subtitle: 'Staying Healthy, Creative, and Shipping in the AI Coding Era',
    blurb:
      'Human attention is the real bottleneck. Signal layers, verification gates, voice-first dispatch, and an Oura Ring integration that factors your sleep into the day’s plan.',
    tag: 'Talk · Recording',
    image: 'https://img.youtube.com/vi/so9l_MwS2yg/maxresdefault.jpg',
    videoId: 'so9l_MwS2yg',
  }

  const talks = [
    {
      slug: 'workos-applied-ai-showcase',
      event: 'WorkOS Applied AI Showcase',
      date: 'May 2026',
      title: 'Applied AI: Three Learnings',
      blurb:
        'Interface beats stack, complete the loop, and the imagination gap — three lessons from shipping internal AI tooling.',
      tag: 'Talk · Recording',
      image: 'https://img.youtube.com/vi/V2PuEAeNXUU/maxresdefault.jpg',
      hasVideo: true,
    },
    {
      slug: 'aie-london-skills-at-scale',
      event: 'AI Engineering London',
      date: 'April 2026',
      title: 'Skills at Scale',
      blurb:
        'Claude Code skills across workflows, agents, and teams — an 80-minute hands-on workshop with Nick Nisi.',
      tag: 'Workshop · 80 min',
      image: 'https://zackproser.b-cdn.net/images/aie-london-workshop-nick-zack.webp',
      hasVideo: true,
    },
    {
      slug: 'claude-cowork-workshop',
      event: 'WorkOS × Anthropic',
      date: 'February 2026',
      title: 'Claude Cowork Workshop',
      blurb:
        'A hands-on hour with Lydia from Anthropic — Cowork enablement from first live demo to a working workflow.',
      tag: 'Workshop · Recording',
      image: 'https://zackproser.b-cdn.net/images/workshop-zack-presenting-v2.webp',
      hasVideo: true,
    },
    {
      slug: 'devseccon-2025-keynote',
      event: 'DevSecCon 2025',
      date: '2025',
      title: 'DevSecCon Keynote',
      blurb:
        'Modern AI and security — keynote address to the security engineering community.',
      tag: 'Keynote · Recording',
      image: 'https://img.youtube.com/vi/kwIzRkzO_Z4/0.jpg',
      hasVideo: true,
    },
  ]

  // Proof metrics derived from the canonical speaking-data so the headline
  // numbers stay in sync as new engagements are added.
  const engagements = speakingEngagements as unknown as Array<{
    title: string
    event: string
    description?: string
    topics?: string[]
    videoUrl?: string
    links?: { type: string }[]
  }>
  const totalCount = engagements.length
  const workshopCount = engagements.filter((e) =>
    /workshop|training|hands-on/i.test(
      `${e.title} ${e.event} ${e.description ?? ''} ${(e.topics ?? []).join(' ')}`,
    ),
  ).length
  const venueCount = new Set(engagements.map((e) => e.event)).size
  const recordingCount = engagements.filter(
    (e) => Boolean(e.videoUrl) || (e.links ?? []).some((l) => l.type === 'youtube'),
  ).length

  const ledger = [
    { num: String(totalCount), label: 'Talks, workshops & demos' },
    { num: String(workshopCount), label: 'Hands-on workshops' },
    { num: String(venueCount), label: 'Stages & conferences' },
    { num: String(recordingCount), label: 'Recordings to watch' },
  ]

  type Venue = {
    alt: string
    role: string
    slug: string
    logo?: string
    wordmark?: string
    glyph?: boolean
  }
  const venuesSeen: Venue[] = [
    { logo: '/images/logos/aiengineer.svg', alt: 'AI Engineer', role: 'Workshops · London + SF', slug: 'aie-london-skills-at-scale' },
    { logo: '/images/logos/anthropic.svg', alt: 'Anthropic', role: 'Workshop · Claude Cowork', slug: 'claude-cowork-workshop', glyph: true },
    { logo: '/images/logos/a16z.svg', alt: 'Andreessen Horowitz', role: 'Talk · ~125 in room', slug: 'a16z-pinecone-pulumi', glyph: true },
    { logo: '/images/logos/workos.svg', alt: 'WorkOS', role: 'Showcase · Applied AI', slug: 'workos-applied-ai-showcase', glyph: true },
    { wordmark: 'DevSecCon', alt: 'DevSecCon', role: 'Keynote · 2025', slug: 'devseccon-2025-keynote' },
    { logo: '/images/logos/cohere.svg', alt: 'Cohere', role: 'Co-host · a16z meetup', slug: 'a16z-pinecone-pulumi' },
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
          On stage
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-end mb-10">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-extrabold leading-[1.08] tracking-tight text-charcoal-50 dark:text-parchment-100 text-balance m-0 max-w-[20ch]">
              Shipping production AI daily.{' '}
              <em className="italic text-burnt-400 dark:text-amber-400">Teaching what works on stage.</em>
            </h2>
            <p className="mt-4 text-[15px] md:text-base leading-relaxed text-parchment-600 dark:text-slate-300 max-w-[54ch]">
              Keynotes, conference talks, hands-on workshops, and live demos — from a16z and
              DevSecCon to AI Engineering London and WorkOS&nbsp;×&nbsp;Anthropic.
            </p>
            <Link
              href="/speaking"
              className="inline-block mt-5 font-mono text-[12px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400 no-underline hover:underline"
              onClick={() =>
                track('featured_speaking_click', {
                  location: 'homepage_speaking_section',
                  action: 'all_talks',
                })
              }
            >
              All talks →
            </Link>
          </div>

          {/* Ledger — terminal-style proof card, mirrors the workshops calendar */}
          <div className="rounded-md border border-parchment-300 dark:border-slate-700 bg-parchment-50 dark:bg-slate-800 shadow-md overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400 border-b border-parchment-300 dark:border-slate-700">
              <span className="font-bold text-burnt-400 dark:text-amber-400">~/speaking — ledger</span>
              <span>Since 2023</span>
            </div>
            <div className="grid grid-cols-2">
              {ledger.map((s, i) => (
                <div
                  key={s.label}
                  className={`px-5 py-4 border-parchment-300 dark:border-slate-700 ${
                    i % 2 === 0 ? 'border-r' : ''
                  } ${i < 2 ? 'border-b' : ''}`}
                >
                  <div className="font-serif text-3xl font-extrabold leading-none tracking-tight text-charcoal-50 dark:text-parchment-100">
                    {s.num}
                  </div>
                  <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.12em] leading-snug text-parchment-600 dark:text-slate-400">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* As seen at — logo wall */}
        <div className="mb-10">
          <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
            As seen at
          </div>
          <div className="editorial-grid-texture rounded-md border border-parchment-300 border-t-2 border-t-burnt-400/60 bg-parchment-50 px-6 py-9 dark:border-slate-700 dark:border-t-amber-400/50 dark:bg-slate-800/50 md:px-12 md:py-11">
            <div className="grid grid-cols-2 items-start gap-x-6 gap-y-9 sm:grid-cols-3 lg:grid-cols-6">
              {venuesSeen.map((v) => (
                <Link
                  key={v.alt}
                  href={`/speaking/${v.slug}`}
                  aria-label={`${v.alt} — ${v.role}`}
                  className="group/venue flex flex-col items-center gap-3 no-underline transition-transform duration-300 hover:-translate-y-0.5"
                  onClick={() =>
                    track('featured_speaking_click', {
                      location: 'homepage_speaking_section',
                      action: 'venue',
                      venue: v.alt,
                    })
                  }
                >
                  <span className="flex h-9 md:h-11 items-center justify-center">
                    {v.logo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.logo}
                        alt={v.alt}
                        className={`w-auto object-contain opacity-70 brightness-0 transition-opacity duration-300 group-hover/venue:opacity-100 dark:invert ${
                          v.glyph ? 'h-9 md:h-11' : 'h-6 md:h-7'
                        }`}
                      />
                    ) : (
                      <span className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-black opacity-70 transition-opacity duration-300 group-hover/venue:opacity-100 dark:text-parchment-100">
                        {v.wordmark}
                      </span>
                    )}
                  </span>
                  <span className="max-w-[18ch] text-center font-mono text-[10px] uppercase tracking-[0.12em] leading-snug text-parchment-600 dark:text-slate-400">
                    {v.role}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Hero card — Untethered Productivity with hero image */}
        <Link
          href={`/speaking/${hero.slug}`}
          className="group block rounded-md border border-parchment-300 dark:border-slate-700 bg-parchment-50 dark:bg-slate-800 no-underline hover:border-burnt-400 dark:hover:border-amber-400 transition-colors mb-6 overflow-hidden"
          onClick={() =>
            track('featured_speaking_click', {
              location: 'homepage_speaking_section',
              talk: hero.slug,
            })
          }
        >
          {/* Hero image — always visible, full-bleed */}
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-parchment-200 dark:bg-slate-900">
            <Image
              src={hero.image}
              alt={`${hero.title} — ${hero.event}`}
              fill
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
              priority
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-burnt-400/90 dark:bg-amber-400/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 md:w-9 md:h-9 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
          {/* Text below image */}
          <div className="p-5 md:p-6 flex flex-col gap-2">
            <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400">
              <span className="font-bold text-burnt-600 dark:text-amber-300">{hero.tag}</span>
            </div>
            <h3 className="font-serif text-2xl md:text-3xl font-bold leading-tight tracking-tight text-charcoal-50 dark:text-parchment-100 m-0 group-hover:text-burnt-400 dark:group-hover:text-amber-400 transition-colors">
              {hero.title}
            </h3>
            <p className="font-serif text-base italic text-parchment-600 dark:text-slate-300 m-0">
              {hero.subtitle}
            </p>
            <p className="m-0 text-[13px] leading-relaxed text-parchment-600 dark:text-slate-400">
              {hero.blurb}
            </p>
            <span className="inline-flex items-center gap-1.5 mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Watch the talk
            </span>
          </div>
        </Link>

        {/* Supporting talks grid — editorial-card primitives for coherence */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {talks.map((t) => (
            <Link
              key={t.slug}
              href={`/speaking/${t.slug}`}
              className="editorial-card group block h-full no-underline"
              onClick={() =>
                track('featured_speaking_click', {
                  location: 'homepage_speaking_section',
                  talk: t.slug,
                })
              }
            >
              <div className="editorial-card-link">
                <div className="editorial-card-media">
                  <Image
                    src={t.image}
                    alt={`${t.title} — ${t.event}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="editorial-card-image object-cover"
                  />
                  <div className="editorial-card-rule" />
                  {t.hasVideo && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white rounded px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      Video
                    </div>
                  )}
                </div>
                <div className="editorial-card-body">
                  <div className="editorial-card-date flex items-center justify-between">
                    <span className="font-bold text-burnt-600 dark:text-amber-300">{t.tag}</span>
                    <span>{t.date}</span>
                  </div>
                  <h3 className="editorial-card-title group-hover:text-burnt-400 dark:group-hover:text-amber-400 transition-colors">
                    {t.title}
                  </h3>
                  <p className="editorial-card-desc">{t.blurb}</p>
                  <div className="editorial-card-footer">
                    <span className="editorial-card-index min-w-0 truncate pr-2">{t.event}</span>
                    <span className="editorial-card-read shrink-0">Watch →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Booking CTA */}
        <div className="mt-12 pt-8 border-t border-parchment-300 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
          <p className="font-serif text-lg md:text-xl text-charcoal-50 dark:text-parchment-100 m-0 max-w-[42ch]">
            Bring a keynote, workshop, or live demo to your event or team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/speaking"
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
              onClick={() =>
                track('featured_speaking_click', {
                  location: 'homepage_speaking_section',
                  action: 'watch_all',
                })
              }
            >
              Watch all talks →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 text-sm font-semibold rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-parchment-100 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
              onClick={() =>
                track('featured_speaking_click', {
                  location: 'homepage_speaking_section',
                  action: 'book',
                })
              }
            >
              Book me to speak →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

// ----- Featured Tutorial (demoted RAG, between rails) --------------

function FeaturedTutorialSecondary() {
  return (
    <section className="py-12">
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
          Also from the catalog
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Demoted RAG tutorial */}
          <article className="rounded-md border border-parchment-300 dark:border-slate-700 bg-parchment-50 dark:bg-slate-800 p-6 flex flex-col gap-3">
            <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-[0.12em] text-parchment-600 dark:text-slate-400">
              <span className="font-bold text-charcoal-50 dark:text-parchment-100">Tutorial · Premium</span>
              <span className="text-burnt-400 dark:text-amber-400">$149 · Shipping</span>
            </div>
            <h3 className="font-serif text-2xl font-bold leading-tight tracking-tight text-charcoal-50 dark:text-parchment-100 m-0">
              Build a chatbot that actually knows your shit.
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-parchment-600 dark:text-slate-300 max-w-[52ch]">
              End-to-end RAG with Pinecone, the Vercel AI SDK, and Next.js 15. No hallucinations. No magic.
              A production harness you can hand to your team and they&apos;ll still understand it in six
              months.
            </p>
            <dl className="grid grid-cols-3 gap-3 py-3 border-t border-b border-parchment-300 dark:border-slate-700">
              {[
                ['Runtime', 'Node 20'],
                ['Vector DB', 'Pinecone'],
                ['Eval', 'Ragas++'],
              ].map(([label, val]) => (
                <div key={label}>
                  <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-500 dark:text-slate-500">
                    {label}
                  </dt>
                  <dd className="m-0 mt-0.5 font-mono text-xs font-semibold text-charcoal-50 dark:text-parchment-100">
                    {val}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-[0.1em] text-parchment-600 dark:text-slate-400">
              <Link
                href="/chat"
                className="text-burnt-400 dark:text-amber-400 no-underline hover:underline"
                onClick={() =>
                  track('featured_product_click', {
                    location: 'secondary_catalog',
                    product: 'rag_tutorial',
                    action: 'demo',
                  })
                }
              >
                Try the live demo →
              </Link>
              <Link
                href="/checkout?product=rag-pipeline-tutorial&type=blog"
                className="text-charcoal-50 dark:text-parchment-100 no-underline border-b border-parchment-400 dark:border-slate-600 pb-px hover:text-burnt-400 dark:hover:text-amber-400 hover:border-burnt-400 dark:hover:border-amber-400"
                onClick={() =>
                  track('featured_product_click', {
                    location: 'secondary_catalog',
                    product: 'rag_tutorial',
                    action: 'buy',
                  })
                }
              >
                Buy — $149
              </Link>
            </div>
          </article>

          {/* Newsletter — dashed companion card */}
          <article className="rounded-md border border-dashed border-parchment-400 dark:border-slate-600 p-6 flex flex-col gap-3">
            <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-[0.12em] text-parchment-600 dark:text-slate-400">
              <span className="font-bold text-charcoal-50 dark:text-parchment-100">Newsletter</span>
              <span className="text-burnt-400 dark:text-amber-400">5,000+ readers</span>
            </div>
            <h3 className="font-serif text-2xl font-bold leading-tight tracking-tight text-charcoal-50 dark:text-parchment-100 m-0">
              The Modern Coding letter.
            </h3>
            <p className="m-0 text-[15px] leading-relaxed text-parchment-600 dark:text-slate-300 max-w-[52ch]">
              Dispatches from the edge of applied AI. What I&apos;m building, what I&apos;m learning, the
              tools I&apos;d actually pay for. Names named, vendors graded, evals included.
            </p>
            <div className="flex justify-between items-baseline font-mono text-[11px] uppercase tracking-[0.1em] text-parchment-600 dark:text-slate-400 mt-auto pt-4 border-t border-parchment-300 dark:border-slate-700">
              <span>Unsubscribe in one click</span>
              <Link
                href="/newsletter"
                className="text-burnt-400 dark:text-amber-400 no-underline hover:underline"
              >
                Subscribe →
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}

// ----- Content rail ----------------------------------

function ContentRail({
  num,
  title,
  moreHref,
  moreLabel,
  articles,
  alt,
  keyPrefix,
  kind,
}: {
  num: string
  title: string
  moreHref: string
  moreLabel?: string
  articles: Article[]
  alt?: boolean
  keyPrefix: string
  kind?: string
}) {
  return (
    <section className={`py-14 ${alt ? 'editorial-section-alt' : ''}`}>
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <SectionHead num={num} title={title} moreHref={moreHref} moreLabel={moreLabel} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((a, i) => (
            <EditorialCard
              key={`${keyPrefix}-${i}`}
              article={a}
              index={i + 1}
              kind={kind}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ----- Colophon footer ----------------------------------------------

function ColophonFooter() {
  return (
    <footer className="mt-16">
      <div className="container mx-auto max-w-6xl px-4 md:px-6 editorial-colophon text-charcoal-50 dark:text-parchment-100">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr_1fr]">
          <div>
            <p className="font-serif text-lg leading-snug mb-2">
              Zachary Proser writes, ships, and teaches applied AI.
            </p>
            <p className="text-parchment-600 dark:text-slate-400 leading-relaxed text-[13px] max-w-[52ch]">
              Currently Applied AI at WorkOS. Formerly Pinecone, Cloudflare,
              Gruntwork. Before that, a very long stretch of infrastructure.
            </p>
          </div>
          <div>
            <h4 className="text-parchment-600 dark:text-slate-400">Writing</h4>
            <ul>
              <li><Link href="/blog">All essays</Link></li>
              <li><Link href="/blog">Archive</Link></li>
              <li><Link href="/rss/feed.xml">RSS feed</Link></li>
              <li><Link href="/newsletter">Newsletter</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-parchment-600 dark:text-slate-400">Work with me</h4>
            <ul>
              <li><Link href="/services">Consulting</Link></li>
              <li><Link href="/workshops/claude-cowork">Workshops</Link></li>
              <li><Link href="/speaking">Speaking</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-parchment-600 dark:text-slate-400">Elsewhere</h4>
            <ul>
              <li><a href="https://github.com/zackproser" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://youtube.com/@zackproser" target="_blank" rel="noopener noreferrer">YouTube</a></li>
              <li><a href="https://linkedin.com/in/zackproser" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://x.com/zackproser" target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
            </ul>
          </div>
        </div>
        <div className="editorial-colophon-rule text-parchment-600 dark:text-slate-500">
          <div>
            <span className="text-burnt-400 dark:text-amber-400">●</span>{' '}
            Currently: Applied AI @ WorkOS · Open to{' '}
            <Link href="/workshops/claude-cowork" className="underline decoration-dotted underline-offset-4 hover:text-burnt-400 dark:hover:text-amber-400">workshops</Link>
            {' '}and{' '}
            <Link href="/contact" className="underline decoration-dotted underline-offset-4 hover:text-burnt-400 dark:hover:text-amber-400">retainers</Link>
          </div>
          <div>
            <Link href="/contact" className="hover:text-burnt-400 dark:hover:text-amber-400">Get in touch →</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ----- Main component -----------------------------------------------

export default function HomepageClientComponent({
  deepMLTutorials,
  mlProjects,
  aiDev,
  refArchitectures,
  careerAdvice,
  videos,
}: Props) {
  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        <EditorialHero />
        <StatRow />
        <HomepageAdvisorSection />
        <FeaturedWorkshops />

        <FeaturedSpeaking />

        <ContentRail
          num="01"
          title="Deep & machine learning, by hand"
          moreHref="/blog"
          articles={deepMLTutorials}
          alt
          keyPrefix="ml-tutorial"
          kind="Tutorial"
        />

        <FeaturedTutorialSecondary />

        <ContentRail
          num="02"
          title="Open-source projects"
          moreHref="/projects"
          moreLabel="All projects →"
          articles={mlProjects}
          keyPrefix="ml-project"
          kind="Project"
        />

        <ContentRail
          num="03"
          title="AI-assisted development"
          moreHref="/blog"
          moreLabel="More essays →"
          articles={aiDev}
          alt
          keyPrefix="ai-dev"
          kind="Essay"
        />

        <ContentRail
          num="04"
          title="Reference architectures"
          moreHref="/blog"
          articles={refArchitectures}
          keyPrefix="ref-arch"
          kind="Ref arch"
        />

        <ContentRail
          num="05"
          title="Career notes — from the field"
          moreHref="/blog"
          moreLabel="All advice →"
          articles={careerAdvice}
          alt
          keyPrefix="career"
          kind="Field note"
        />

        <ContentRail
          num="06"
          title="Video & screencasts"
          moreHref="/videos"
          moreLabel="All videos →"
          articles={videos}
          keyPrefix="video"
          kind="Video"
        />
      </main>

      <ColophonFooter />
    </div>
  )
}
