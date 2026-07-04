import Image from 'next/image'
import Link from 'next/link'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import { createMetadata } from '@/utils/createMetadata'
import { SectionHead } from '@/components/SectionHead'
import { TrackedLink } from '@/components/TrackedLink'
import { speakingEngagements, galleryImages } from './speaking-data'

export const metadata = createMetadata({
  title: 'Speaking Engagements - Zachary Proser',
  description: 'AI engineer speaker, conference presenter, and technical trainer. Keynotes and hands-on workshops on AI engineering, agent-assisted development, and developer tools. swyx: "the gold standard for AI Engineer content."',
  author: 'Zachary Proser',
  date: '2025-06-02',
  slug: 'speaking',
  image: 'https://zackproser.b-cdn.net/images/aie-sf-2026-lifestyles-hero.jpg',
  keywords: [
    'Zachary Proser speaking',
    'AI engineer speaker',
    'conference speaker',
    'technical trainer',
    'AI talks',
    'keynote speaker',
    'AI workshops',
    'developer tools speaker',
    'corporate training',
    'engineering training',
    'AI fundamentals',
    'machine learning speaker',
  ],
  tags: [
    'speaking',
    'conferences',
    'AI',
    'machine learning',
    'developer tools',
    'training',
    'workshops',
  ],
});

/*
 * Talks framed as audience outcomes — what the room leaves with, not a tag
 * cloud. Detail data (dates, galleries, decks) stays in speaking-data.js;
 * this is the offering layer.
 */
/* Ordered by the format we most want booked: the marquee keynote first,
 * then the hands-on workshops that convert into enterprise engagements. */
const talks = [
  {
    id: 'T.01',
    name: 'DevSecCon Keynote',
    badge: 'Keynote · DevSecCon 2025',
    outcome: ['Your security audience leaves thinking about AI ', 'like practitioners.'],
    description:
      'The conference keynote on modern AI and security — where the real risks and the real gains sit once agents are in the loop.',
    image: 'https://img.youtube.com/vi/kwIzRkzO_Z4/hqdefault.jpg',
    imageAlt: 'DevSecCon 2025 keynote',
    primary: { label: 'Watch →', href: 'https://www.youtube.com/watch?v=kwIzRkzO_Z4' },
    detailHref: '/speaking/devseccon-2025-keynote',
    handsOn: false,
  },
  {
    id: 'T.02',
    name: 'Skills at Scale',
    badge: 'Workshop · AIE London',
    outcome: ['Your team builds a ', 'shared skill library', ' that ports across agents.'],
    description:
      'Skill design patterns, cross-agent portability, and team libraries — building production-grade Claude Code skills people actually reuse.',
    image: 'https://img.youtube.com/vi/pFsfax19yOM/maxresdefault.jpg',
    imageAlt: 'Skills at Scale workshop at AI Engineering London',
    primary: { label: 'Watch →', href: 'https://www.youtube.com/watch?v=pFsfax19yOM' },
    detailHref: '/speaking/aie-london-skills-at-scale',
    handsOn: true,
  },
  {
    id: 'T.03',
    name: 'Lifestyles of the AI-Native',
    badge: "Workshop · AIE World's Fair",
    outcome: ['Your audience leaves running ', 'agentic loops with verification gates.'],
    description:
      "One repo, four moves: voice coding, agentic loops and goals, verification gates, scheduled tasks. A live board measures the room's reclaimed hours and AI-Native score, before and after.",
    image: 'https://zackproser.b-cdn.net/images/aie-sf-2026-lifestyles-hero.jpg',
    imageAlt: "Lifestyles of the AI-Native workshop at the AI Engineer World's Fair 2026",
    primary: { label: 'Write-up →', href: '/blog/lifestyles-of-the-ai-native' },
    detailHref: '/speaking/lifestyles-of-the-ai-native',
    handsOn: true,
  },
  {
    id: 'T.04',
    name: 'Untethered Productivity',
    badge: 'Keynote / talk · AIE London',
    outcome: ['Your engineers ship faster ', 'without burning out.'],
    description:
      'Signal management, context switching, and sustainable agent workflows — the balance between massive AI productivity gains and staying healthy, creative, and sane.',
    image: 'https://img.youtube.com/vi/so9l_MwS2yg/maxresdefault.jpg',
    imageAlt: 'Untethered Productivity talk at AI Engineering London',
    primary: { label: 'Watch →', href: 'https://www.youtube.com/watch?v=so9l_MwS2yg' },
    detailHref: '/speaking/untethered-productivity',
    handsOn: false,
  },
]

/* Compressed credibility for an organizer skimming on a phone — every logo
 * maps to a real engagement in speaking-data.js. */
const stageLogos = [
  { name: 'AI Engineer', src: '/images/logos/aiengineer.svg', className: 'invert dark:invert-0' },
  { name: 'Anthropic', src: '/images/logos/anthropic.svg', className: 'dark:invert' },
  { name: 'a16z', src: '/images/logos/a16z.svg', className: 'dark:invert' },
  { name: 'Cohere', src: '/images/logos/cohere.svg', className: 'grayscale dark:invert' },
  { name: 'WorkOS', src: '/images/logos/workos.svg', className: 'grayscale dark:invert' },
]

function OutcomeHeadline({ parts }) {
  return (
    <h3 className="font-serif text-[21px] font-bold leading-snug tracking-tight text-charcoal-50 dark:text-parchment-100 mt-2">
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <em key={i} className="text-burnt-400 dark:text-amber-400">{part}</em>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </h3>
  )
}

function WorkshopCrossSell({ location, compact = false }) {
  return (
    <div className={`rounded-md border border-charcoal-500/70 dark:border-slate-600 bg-[#1a1a2e] ${compact ? 'p-5' : 'px-6 py-5'} ${compact ? '' : 'flex flex-wrap items-center justify-between gap-5'}`}>
      <p className={`m-0 text-parchment-200 ${compact ? 'text-[15px]' : 'text-base'} leading-normal`} style={{ color: '#e8e0d0' }}>
        {compact ? (
          <>
            <span className="block font-mono text-[10px] uppercase tracking-[0.14em] text-amber-400 font-semibold mb-2">Landed here from a talk?</span>
            The workshop is the talk with <b className="text-white">your team&rsquo;s hands on the keyboard.</b>
          </>
        ) : (
          <>Liked the talk? <b className="text-white">The workshop is the talk with your team&rsquo;s hands on the keyboard.</b></>
        )}
      </p>
      <TrackedLink
        href="/workshops/claude-cowork"
        event="speaking-workshop-cross-sell"
        eventData={{ location }}
        className={
          compact
            ? 'inline-block mt-3 font-mono text-xs uppercase tracking-wider text-amber-400 border-b border-amber-400/40 pb-0.5 hover:text-amber-300'
            : 'font-mono text-xs uppercase tracking-wider font-semibold whitespace-nowrap rounded-md bg-amber-400 text-[#1a1a2e] px-4 py-2.5 hover:bg-amber-300 transition-colors'
        }
      >
        {compact ? 'See the enterprise workshop →' : 'View the enterprise workshop →'}
      </TrackedLink>
    </div>
  )
}

export default function Speaking() {
  const sortedByDate = [...speakingEngagements].sort((a, b) =>
    (b.isoDate || '').localeCompare(a.isoDate || '')
  )
  // Ledger stats computed from the data so they never drift from the record.
  const stats = {
    engagements: speakingEngagements.length,
    workshops: speakingEngagements.filter((e) =>
      /workshop/i.test(e.title) || /\b(a|an|the|\d+[\s-]hour|hands-on|live)\s+workshop/i.test(e.description || '')
    ).length,
    stages: new Set(
      speakingEngagements.filter((e) => e.type === 'public').map((e) => e.event)
    ).size,
  }

  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        {/* ----- Hero — leads for event organizers; enterprise cross-sell rides along ----- */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
              <Link href="/" className="hover:text-burnt-400 dark:hover:text-amber-400">Home</Link>
              <span className="mx-2 opacity-40">/</span>
              <span>Speaking</span>
            </div>
            <h1 className="editorial-hero-h1 text-charcoal-50 dark:text-parchment-100 max-w-[20ch]">
              Book the talk your{' '}
              <span className="text-burnt-400 dark:text-amber-400 italic">room</span>{' '}
              will still be quoting Monday.
            </h1>
            <p className="editorial-lede text-parchment-600 dark:text-slate-300 max-w-[62ch]">
              Keynotes and hands-on workshops on AI engineering, agent-assisted development,
              and shipping in the AI coding era. Fourteen years in production.{' '}
              <span className="text-charcoal-50 dark:text-parchment-100">
                &ldquo;The gold standard for AI Engineer content&rdquo;
              </span>{' '}
              — swyx, AI Engineer.
            </p>

            {/* Ledger stats + stage logos — compressed credibility, phone-first */}
            <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-2 border-t border-b border-parchment-300 dark:border-slate-700 py-4">
              {[
                [stats.engagements, 'talks & trainings'],
                [stats.workshops, 'hands-on workshops'],
                [stats.stages, 'stages'],
              ].map(([n, label]) => (
                <div key={label} className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-extrabold text-charcoal-50 dark:text-parchment-100">
                    {String(n).padStart(2, '0')}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400">
                    {label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-7 gap-y-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-500 dark:text-slate-500">
                As seen at
              </span>
              {stageLogos.map((logo) => (
                <img
                  key={logo.name}
                  src={logo.src}
                  alt={logo.name}
                  className={`h-5 w-auto opacity-60 ${logo.className}`}
                />
              ))}
              <span className="font-mono text-xs uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400 opacity-80">
                DevSecCon
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] items-start mt-10">
              {/* Reel slot. TODO: swap in the 60–90s sizzle reel once cut
                  (DevSecCon 2025 keynote + AIE London footage). Until then,
                  Zack's Applied AI Showcase segment holds the slot — recent,
                  him on stage, cued to his segment. */}
              <div>
                <div className="editorial-rule-label text-parchment-600 dark:text-slate-400 mb-3">
                  Watch · Applied AI Showcase segment
                </div>
                <div className="rounded-md overflow-hidden border border-parchment-300 dark:border-slate-700 shadow-lg">
                  <YoutubeEmbed
                    urls="https://www.youtube.com/watch?v=V2PuEAeNXUU&t=3765s"
                    title="Applied AI Showcase — Zack Proser's segment"
                  />
                </div>
              </div>

              {/* Organizer action stack + enterprise cross-sell */}
              <div className="flex flex-col gap-4">
                <div className="rounded-md border border-parchment-300 dark:border-slate-700 bg-parchment-50 dark:bg-slate-800/60 px-6 py-5">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400 font-semibold">
                    For event organizers
                  </div>
                  {/* TODO: point at the real one-sheet PDF once assembled
                      (bio, headshots, abstracts, AV needs, verbatim emcee intro). */}
                  <TrackedLink
                    href="/contact"
                    event="speaker-onesheet-request"
                    className="flex items-center justify-between gap-2 mt-4 rounded-md bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-charcoal-500 px-4 py-3 font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    Request the speaker one-sheet <span>→</span>
                  </TrackedLink>
                  {/* Two fee postures on purpose: conference talks are pipeline
                      marketing (sometimes cheap or free); the corporate
                      from-price filters for budget the way the workshop page's
                      $15k does, and sits below it so the workshop reads as the
                      obvious upgrade. Number is tunable — Zack delegated the
                      initial call. */}
                  <div className="mt-4 pt-3.5 border-t border-parchment-300 dark:border-slate-700 font-mono text-xs text-parchment-600 dark:text-slate-400 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="uppercase tracking-wider">Conference talks</span>
                      <span className="text-charcoal-50 dark:text-parchment-100 font-semibold">Let&rsquo;s talk</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="uppercase tracking-wider">Private &amp; corporate</span>
                      <span className="text-charcoal-50 dark:text-parchment-100 font-semibold">From $7,500</span>
                    </div>
                  </div>
                  <TrackedLink
                    href="/contact"
                    event="speaking-book-talk"
                    eventData={{ location: 'hero' }}
                    className="inline-block mt-3.5 font-mono text-xs uppercase tracking-wider text-burnt-400 dark:text-amber-400 border-b border-burnt-400/40 dark:border-amber-400/40 pb-0.5 hover:text-burnt-500 dark:hover:text-amber-300"
                  >
                    Book a talk →
                  </TrackedLink>
                </div>

                <WorkshopCrossSell location="hero" compact />
              </div>
            </div>
          </div>
        </section>

        {/* ----- § 01 Talks, framed as outcomes ----- */}
        <section className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="01"
              title="What your audience leaves running"
              moreHref="/contact"
              moreLabel="Book a talk →"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {talks.map((talk) => (
                <article
                  key={talk.id}
                  className="flex flex-col rounded-md overflow-hidden border border-parchment-300 dark:border-slate-700 bg-parchment-50 dark:bg-slate-800/60"
                >
                  <div className="relative aspect-video bg-[#1a1a2e]">
                    <Image
                      src={talk.image}
                      alt={talk.imageAlt}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute top-3 left-3 font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white bg-burnt-400/95 dark:bg-amber-500/95 rounded px-2 py-1">
                      {talk.badge}
                    </span>
                  </div>
                  <div className="flex flex-col flex-1 p-5 md:p-6">
                    <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-parchment-500 dark:text-slate-500">
                      {talk.id} · {talk.name}
                    </div>
                    <Link href={talk.detailHref} className="hover:opacity-80 transition-opacity">
                      <OutcomeHeadline parts={talk.outcome} />
                    </Link>
                    <p className="text-[14.5px] leading-relaxed text-parchment-600 dark:text-slate-300 mt-2">
                      {talk.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-parchment-300/60 dark:border-slate-700/60 mt-4">
                      <TrackedLink
                        href={talk.primary.href}
                        event="speaking-talk-watch"
                        eventData={{ talk: talk.name }}
                        className="font-mono text-[11px] uppercase tracking-wider text-burnt-400 dark:text-amber-400 hover:underline"
                      >
                        {talk.primary.label}
                      </TrackedLink>
                      {talk.handsOn ? (
                        <TrackedLink
                          href="/workshops/claude-cowork"
                          event="speaking-workshop-cross-sell"
                          eventData={{ location: `talk-card-${talk.id}` }}
                          className="font-mono text-[10px] uppercase tracking-wider text-parchment-600 dark:text-slate-400 hover:text-burnt-400 dark:hover:text-amber-400"
                        >
                          Hands-on version →
                        </TrackedLink>
                      ) : (
                        <span className="font-mono text-[10px] uppercase tracking-wider text-parchment-500 dark:text-slate-500">
                          Keynote
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-5">
              <WorkshopCrossSell location="talks-strip" />
            </div>
          </div>
        </section>

        {/* ----- § 02 Speaker one-sheet ----- */}
        <section className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="rounded-md border border-parchment-300 dark:border-slate-700 bg-parchment-50 dark:bg-slate-800/60 p-7 md:p-8 grid gap-8 md:grid-cols-[1fr_1.1fr] items-center">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400 font-semibold">
                  Speaker one-sheet · PDF
                </div>
                <h2 className="font-serif text-2xl md:text-[28px] font-extrabold leading-tight tracking-tight text-charcoal-50 dark:text-parchment-100 mt-3">
                  Everything your program needs, on one page.
                </h2>
                <p className="text-[15.5px] leading-relaxed text-parchment-600 dark:text-slate-300 mt-3">
                  Hand it to your comms team and move on. Built to match the workshop
                  page&rsquo;s transparency.
                </p>
                {/* TODO: swap to a direct PDF download once the one-sheet is
                    assembled and approved. */}
                <TrackedLink
                  href="/contact"
                  event="speaker-onesheet-request"
                  eventData={{ location: 'one-sheet-module' }}
                  className="inline-flex items-center gap-2 mt-5 rounded-md bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-charcoal-500 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Request the one-sheet →
                </TrackedLink>
              </div>
              <div className="rounded border border-parchment-300 dark:border-slate-700 bg-parchment-100 dark:bg-slate-900/50 p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400 mb-3.5">
                  What&rsquo;s inside
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2.5 list-none p-0 m-0">
                  {['Short + long bio', 'Hi-res headshots', 'Talk abstracts', 'AV + tech needs', 'Verbatim emcee intro', 'Contact + socials'].map((item) => (
                    <li key={item} className="flex items-baseline gap-2.5 text-sm text-parchment-600 dark:text-slate-300">
                      <span className="font-mono text-xs text-burnt-400 dark:text-amber-400">▸</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ----- Internal trainings — one credibility line, not equal-weight cards ----- */}
        <section className="pb-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="border-t border-b border-parchment-300 dark:border-slate-700 py-5 flex flex-wrap items-baseline justify-between gap-5">
              <p className="m-0 text-base leading-relaxed text-parchment-600 dark:text-slate-300 max-w-[74ch]">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-burnt-400 dark:text-amber-400">
                  Also inside WorkOS
                </span>{' '}
                — AI fundamentals for 40 engineers, an AI content-creation workshop for 25 on
                the marketing team, Claude Skills as self-documenting runbooks, and voice-first
                GTM enablement.
              </p>
              <Link
                href="/ai-training"
                className="font-mono text-[11px] uppercase tracking-wider text-burnt-400 dark:text-amber-400 whitespace-nowrap hover:underline"
              >
                Corporate training →
              </Link>
            </div>
          </div>
        </section>

        {/* ----- § 03 In the room ----- */}
        <section className="pb-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              § 03 · In the room
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="relative aspect-[4/3] overflow-hidden rounded-sm border border-parchment-300 dark:border-slate-700 shadow-md"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    style={{ filter: 'contrast(1.05)' }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ----- § 04 Past appearances ledger ----- */}
        <section className="pb-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="04"
              title="Past appearances"
              moreHref="/blog"
              moreLabel="Archive →"
            />
            <div className="border-t border-parchment-300 dark:border-slate-700">
              {sortedByDate.map((e) => {
                const primaryLink = e.links?.[0]
                const rowHref = e.slug ? `/speaking/${e.slug}` : (primaryLink?.url || null)
                const kind = e.type === 'internal' ? 'Internal' : 'Public'
                const RowTag = rowHref ? (rowHref.startsWith('http') ? 'a' : Link) : 'div'
                const rowProps = rowHref
                  ? (rowHref.startsWith('http')
                      ? { href: rowHref, target: '_blank', rel: 'noopener noreferrer' }
                      : { href: rowHref })
                  : {}
                return (
                  <RowTag
                    key={e.id}
                    {...rowProps}
                    className="grid grid-cols-[auto_1fr_auto] md:grid-cols-[110px_1.2fr_2fr_100px_90px] gap-4 py-4 border-b border-parchment-300 dark:border-slate-700 text-charcoal-50 dark:text-parchment-100 hover:bg-parchment-50/60 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400 pt-1">
                      {e.date}
                    </div>
                    <div className="font-serif text-[15px] font-semibold leading-snug">
                      {e.event}
                      <span className="block font-mono text-[10px] uppercase tracking-wider text-parchment-500 dark:text-slate-500 mt-1">
                        {e.location}
                      </span>
                    </div>
                    <div className="hidden md:block text-[14px] leading-snug text-parchment-600 dark:text-slate-300">
                      {e.title}
                    </div>
                    <div className="hidden md:block font-mono text-[10px] uppercase tracking-[0.14em] text-parchment-600 dark:text-slate-400 pt-1">
                      {kind}
                    </div>
                    <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400 pt-1 text-right group-hover:underline">
                      {rowHref ? 'Open →' : ''}
                    </div>
                  </RowTag>
                )
              })}
            </div>
          </div>
        </section>

        {/* ----- CTA ----- */}
        <section className="py-20 editorial-section-alt">
          <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center">
            <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400 justify-center">
              Booking a program?
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight mt-4 text-charcoal-50 dark:text-parchment-100">
              A keynote fills the room. The workshop is what your team is{' '}
              <span className="text-burnt-400 dark:text-amber-400">still running</span> a month later.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <TrackedLink
                href="/contact"
                event="speaking-book-talk"
                eventData={{ location: 'footer' }}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
              >
                Book a speaking engagement →
              </TrackedLink>
              <TrackedLink
                href="/workshops/claude-cowork"
                event="speaking-workshop-cross-sell"
                eventData={{ location: 'footer' }}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-parchment-100 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
              >
                View the enterprise workshop →
              </TrackedLink>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
