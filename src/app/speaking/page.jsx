import Image from 'next/image'
import Link from 'next/link'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import { createMetadata } from '@/utils/createMetadata'
import { ExternalLinkButton } from '@/components/ExternalLinkButton'
import { SectionHead } from '@/components/SectionHead'
import { speakingEngagements, galleryImages } from './speaking-data'

export const metadata = createMetadata({
  title: 'Speaking Engagements - Zachary Proser',
  description: 'AI engineer speaker, conference presenter, and technical trainer. Public talks on AI, infrastructure as code, vector databases, and developer tools. Available for speaking engagements and corporate training.',
  author: 'Zachary Proser',
  date: '2025-6-02',
  slug: 'speaking',
  image: 'https://zackproser.b-cdn.net/images/a16z-1.webp',
  keywords: [
    'Zachary Proser speaking',
    'AI engineer speaker',
    'conference speaker',
    'technical trainer',
    'AI talks',
    'infrastructure as code speaker',
    'vector database expert',
    'developer tools speaker',
    'corporate training',
    'engineering training',
    'AI fundamentals',
    'machine learning speaker',
    'DevOps speaker',
    'cloud infrastructure'
  ],
  tags: [
    'speaking',
    'conferences',
    'AI',
    'machine learning',
    'infrastructure as code',
    'vector databases',
    'developer tools',
    'training',
    'workshops'
  ]
});

function SpeakingEditorialCard({ engagement, index, prefix }) {
  const idx = String(index).padStart(2, '0')
  const kind = engagement.type === 'internal' ? 'Internal' : 'Public'
  const href = engagement.slug ? `/speaking/${engagement.slug}` : null
  const imagePositionClass = engagement.imagePosition === 'top' ? 'object-top' : 'object-center'
  const hasLinks = engagement.links && engagement.links.length > 0

  const Content = (
    <article className="editorial-card group h-full">
      <div className="editorial-card-link">
        <div className="editorial-card-meta flex items-center justify-between">
          <span>{prefix}{idx} · {kind}</span>
          {engagement.slidevUrl ? (
            <span className="text-burnt-400 dark:text-amber-400">Interactive deck</span>
          ) : null}
        </div>
        <div className="editorial-card-media">
          <Image
            src={engagement.image}
            alt={engagement.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`editorial-card-image ${imagePositionClass}`}
          />
          <div className="editorial-card-rule" />
        </div>
        <div className="editorial-card-body">
          <div className="editorial-card-date">
            {engagement.date} · {engagement.event}
          </div>
          <h3 className="editorial-card-title">{engagement.title}</h3>
          {engagement.description ? (
            <p className="editorial-card-desc">{engagement.description}</p>
          ) : null}
          <div className="flex flex-wrap gap-1.5 mt-1">
            {engagement.topics.slice(0, 4).map((topic) => (
              <span
                key={topic}
                className="inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-burnt-500 dark:text-amber-400 border border-burnt-400/30 dark:border-amber-400/30 rounded-sm"
              >
                {topic}
              </span>
            ))}
          </div>
          <div className="editorial-card-footer">
            <span className="editorial-card-read">
              {engagement.audience.split(' ').slice(0, 3).join(' ')} · {engagement.location}
            </span>
            <span className="editorial-card-index">{prefix}.{idx}</span>
          </div>
          {hasLinks ? (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-parchment-300/40 dark:border-slate-700/40">
              {engagement.links.map((link, i) => (
                <ExternalLinkButton key={i} link={link} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </article>
  )

  if (!href || hasLinks) return Content

  return (
    <Link href={href} className="block h-full">
      {Content}
    </Link>
  )
}

function computeTopicCounts(engagements) {
  const counts = new Map()
  for (const e of engagements) {
    for (const t of e.topics || []) {
      counts.set(t, (counts.get(t) || 0) + 1)
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
}

export default function Speaking() {
  const publicEngagements = speakingEngagements.filter(e => e.type === 'public')
  const internalEngagements = speakingEngagements.filter(e => e.type === 'internal')
  const topicCounts = computeTopicCounts(speakingEngagements).slice(0, 14)
  const sortedByDate = [...speakingEngagements].sort((a, b) =>
    (b.isoDate || '').localeCompare(a.isoDate || '')
  )

  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        {/* ----- Hero ----- */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-end">
            <div>
              <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
                <Link href="/" className="hover:text-burnt-400 dark:hover:text-amber-400">Home</Link>
                <span className="mx-2 opacity-40">/</span>
                <span>Speaking</span>
              </div>
              <h1 className="editorial-hero-h1 text-charcoal-50 dark:text-parchment-100">
                Talks, workshops, and trainings for teams that{' '}
                <span className="text-burnt-400 dark:text-amber-400">actually ship</span>.
              </h1>
              <p className="editorial-lede text-parchment-600 dark:text-slate-300">
                Keynotes, hands-on workshops, and corporate training across AI engineering,
                agent-assisted development, RAG, and developer tools. Fourteen years in production.
              </p>
              <div className="editorial-secondary text-parchment-600 dark:text-slate-400 mt-6">
                <Link href="/contact">Book a talk →</Link>
                <span>·</span>
                <Link href="/workshops/claude-cowork">Workshops →</Link>
                <span>·</span>
                <Link href="/ai-training">Corporate training →</Link>
              </div>
              <dl className="editorial-meta text-parchment-600 dark:text-slate-400">
                <dt>Featured</dt>
                <dd>DevSecCon 2025 keynote · AI Engineering World Fair workshop (70+ engineers)</dd>
                <dt>Recent</dt>
                <dd>AI Engineering London · WorkOS × Anthropic · a16z</dd>
              </dl>
            </div>

            {/* Featured keynote preview on the right */}
            <div>
              <div className="editorial-rule-label text-parchment-600 dark:text-slate-400 mb-3">
                Featured keynote
              </div>
              <div className="rounded-md overflow-hidden border border-parchment-300 dark:border-slate-700 shadow-lg">
                <YoutubeEmbed urls="https://www.youtube.com/watch?v=kwIzRkzO_Z4" title="DevSecCon 2025 Keynote" />
              </div>
              <div className="mt-3 flex items-center justify-between text-[12px] font-mono uppercase tracking-wider text-parchment-600 dark:text-slate-400">
                <span>DevSecCon 2025 · Keynote</span>
                <a
                  href="https://www.youtube.com/watch?v=kwIzRkzO_Z4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-burnt-400 dark:text-amber-400 hover:underline"
                >
                  Watch →
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ----- § 01 Topics I cover ----- */}
        <section className="pb-8">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              § 01 · Topics I cover
            </div>
            <div className="flex flex-wrap gap-2">
              {topicCounts.map(([topic, n]) => (
                <span
                  key={topic}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm border border-parchment-300 dark:border-slate-600 bg-parchment-50 dark:bg-slate-800/60 text-[13px] text-charcoal-50 dark:text-parchment-100"
                >
                  <span>{topic}</span>
                  <span className="font-mono text-[10px] tracking-wider text-burnt-400 dark:text-amber-400">
                    {String(n).padStart(2, '0')}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ----- § 02 Public engagements ----- */}
        <section className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="02"
              title="Conference talks & public workshops"
              moreHref="/contact"
              moreLabel="Book a talk →"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {publicEngagements.map((engagement, i) => (
                <SpeakingEditorialCard
                  key={engagement.id}
                  engagement={engagement}
                  index={i + 1}
                  prefix="T"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ----- Gallery strip ----- */}
        <section className="py-14">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
              In the room
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

        {/* ----- § 03 Internal training ----- */}
        <section className="py-14 editorial-section-alt">
          <div className="container mx-auto max-w-6xl px-4 md:px-6">
            <SectionHead
              num="03"
              title="Corporate training & team development"
              moreHref="/ai-training"
              moreLabel="Training services →"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {internalEngagements.map((engagement, i) => (
                <SpeakingEditorialCard
                  key={engagement.id}
                  engagement={engagement}
                  index={i + 1}
                  prefix="I"
                />
              ))}
            </div>
          </div>
        </section>

        {/* ----- § 04 Past appearances ledger ----- */}
        <section className="py-14">
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
                      <span className="block md:hidden font-mono text-[10px] uppercase tracking-wider text-parchment-500 dark:text-slate-500 mt-1">
                        {e.location}
                      </span>
                      <span className="hidden md:block font-mono text-[10px] uppercase tracking-wider text-parchment-500 dark:text-slate-500 mt-1">
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
              Looking for a speaker?
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold leading-tight tracking-tight mt-4 text-charcoal-50 dark:text-parchment-100">
              Conference talks, team workshops, and practical, hands-on training
              — tell me what your team needs to{' '}
              <span className="text-burnt-400 dark:text-amber-400">ship</span>.
            </h2>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
              >
                Book a speaking engagement →
              </Link>
              <Link
                href="/workshops/claude-cowork"
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-parchment-100 hover:border-burnt-400 dark:hover:border-amber-400 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors"
              >
                View the Claude Cowork workshop →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
