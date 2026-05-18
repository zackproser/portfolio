import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createMetadata } from '@/utils/createMetadata'
import { ExternalLinkButton } from '@/components/ExternalLinkButton'
import { SectionHead } from '@/components/SectionHead'
import { speakingEngagements } from '../speaking-data'
import { ArrowLeft, Calendar, Users, Play } from 'lucide-react'
import { SlidevEmbed } from '@/components/SlidevEmbed'

function getEngagementBySlug(slug) {
  return speakingEngagements.find((e) => e.slug === slug)
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const engagement = getEngagementBySlug(slug)
  if (!engagement) return {}

  return createMetadata({
    title: `${engagement.title} - Zachary Proser`,
    description: engagement.description,
    author: 'Zachary Proser',
    date: engagement.date,
    slug: slug,
    type: 'speaking',
    image: engagement.image,
    keywords: engagement.topics,
    tags: ['speaking', ...engagement.topics],
  })
}

export function generateStaticParams() {
  return speakingEngagements.filter((e) => e.slug).map((e) => ({ slug: e.slug }))
}

export default async function SpeakingDetail({ params }) {
  const { slug } = await params
  const engagement = getEngagementBySlug(slug)

  if (!engagement) {
    notFound()
  }

  return (
    <div className="editorial-home flex flex-col min-h-screen text-charcoal-50 dark:text-parchment-100 theme-transition">
      <main className="flex-1">
        {/* ----- Hero ----- */}
        <section className="pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="container mx-auto max-w-6xl px-4 md:px-6 grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:items-start">
            <div>
              <div className="editorial-eyebrow text-parchment-600 dark:text-slate-400">
                <Link href="/" className="hover:text-burnt-400 dark:hover:text-amber-400">
                  Home
                </Link>
                <span className="mx-2 opacity-40">/</span>
                <Link
                  href="/speaking"
                  className="hover:text-burnt-400 dark:hover:text-amber-400"
                >
                  Speaking
                </Link>
                <span className="mx-2 opacity-40">/</span>
                <span>{engagement.event}</span>
              </div>

              <h1 className="editorial-hero-h1 text-charcoal-50 dark:text-parchment-100 mt-4">
                {engagement.title}
              </h1>

              <p className="editorial-lede text-parchment-600 dark:text-slate-300">
                {engagement.description}
              </p>

              <dl className="editorial-meta text-parchment-600 dark:text-slate-400">
                <dt>When</dt>
                <dd className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  {engagement.date}
                </dd>
                <dt>Where</dt>
                <dd>{engagement.location}</dd>
                <dt>For</dt>
                <dd className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5" />
                  {engagement.audience}
                </dd>
              </dl>

              <div className="mt-6 flex flex-wrap gap-1.5">
                {engagement.topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-block px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-burnt-500 dark:text-amber-400 border border-burnt-400/30 dark:border-amber-400/30 rounded-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <div className="editorial-secondary text-parchment-600 dark:text-slate-400 mt-6">
                <Link
                  href="/speaking"
                  className="inline-flex items-center gap-2 hover:text-burnt-400 dark:hover:text-amber-400"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  All speaking engagements
                </Link>
              </div>
            </div>

            <div>
              <div className="editorial-rule-label text-parchment-600 dark:text-slate-400">
                In the room
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-parchment-300 dark:border-slate-700 shadow-md">
                <Image
                  src={engagement.image}
                  alt={engagement.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className={
                    engagement.imagePosition === 'top'
                      ? 'object-cover object-top'
                      : 'object-cover'
                  }
                  priority
                />
              </div>
              <p className="mt-3 font-mono text-[11px] tracking-[0.1em] uppercase text-parchment-600 dark:text-slate-400">
                {engagement.event} · {engagement.date}
              </p>
            </div>
          </div>
        </section>

        {/* ----- Interactive Slidev deck ----- */}
        {engagement.slidevUrl && (
          <section className="py-14 editorial-section-alt">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <SectionHead
                num="01"
                title={
                  <>
                    Play the deck.{' '}
                    <em className="italic text-burnt-400 dark:text-amber-400">
                      Use the arrow keys.
                    </em>
                  </>
                }
              />
              <div className="flex items-center gap-2 mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-burnt-400 dark:text-amber-400">
                <Play className="h-3.5 w-3.5" />
                <span>Interactive · live deck</span>
              </div>
              <SlidevEmbed
                src={engagement.slidevUrl}
                title={`${engagement.title} - Interactive Slides`}
              />
            </div>
          </section>
        )}

        {/* ----- Video recording ----- */}
        {engagement.videoUrl && (
          <section className="py-14">
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <SectionHead
                num={engagement.slidevUrl ? '02' : '01'}
                title={<>Watch the recording.</>}
              />
              <div className="rounded-md overflow-hidden border border-parchment-300 dark:border-slate-700 shadow-md">
                <iframe
                  src={engagement.videoUrl}
                  title={`${engagement.title} - Video`}
                  className="w-full border-0 block"
                  style={{ aspectRatio: '16/9' }}
                  allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  loading="lazy"
                />
              </div>
            </div>
          </section>
        )}

        {/* ----- Resources ----- */}
        {engagement.links && engagement.links.length > 0 && (
          <section
            className={`py-14 ${engagement.slidevUrl && !engagement.videoUrl ? '' : 'editorial-section-alt'}`}
          >
            <div className="container mx-auto max-w-6xl px-4 md:px-6">
              <SectionHead
                num={
                  engagement.slidevUrl && engagement.videoUrl
                    ? '03'
                    : engagement.slidevUrl || engagement.videoUrl
                      ? '02'
                      : '01'
                }
                title={<>Resources.</>}
              />
              <div className="flex flex-wrap gap-3">
                {engagement.links.map((link, index) => (
                  <ExternalLinkButton key={index} link={link} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Event',
              name: engagement.title,
              description: engagement.description,
              startDate: engagement.isoDate || engagement.date,
              location: {
                '@type': 'Place',
                name: engagement.location,
              },
              performer: {
                '@type': 'Person',
                name: 'Zachary Proser',
                url: 'https://zackproser.com',
              },
              organizer: {
                '@type': 'Organization',
                name: engagement.event,
              },
            }),
          }}
        />
      </main>
    </div>
  )
}
