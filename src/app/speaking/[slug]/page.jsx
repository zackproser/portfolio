import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SimpleLayout } from '@/components/SimpleLayout'
import { createMetadata } from '@/utils/createMetadata'
import { ExternalLinkButton } from '@/components/ExternalLinkButton'
import { speakingEngagements } from '../speaking-data'
import { ArrowLeft, Calendar, Users, Play, BookOpen } from 'lucide-react'
import { SlidevEmbed } from '@/components/SlidevEmbed'

function getEngagementBySlug(slug) {
  return speakingEngagements.find(e => e.slug === slug)
}

// Turn any YouTube watch/share URL into an embeddable URL (preserving a start time).
function toYouTubeEmbed(url) {
  if (!url) return null
  try {
    const u = new URL(url)
    let id = ''
    if (u.hostname.includes('youtu.be')) id = u.pathname.slice(1)
    else if (u.searchParams.get('v')) id = u.searchParams.get('v')
    else if (u.pathname.includes('/embed/')) return url
    if (!id) return null
    const t = u.searchParams.get('t') || u.searchParams.get('start')
    const start = t ? parseInt(String(t).replace('s', ''), 10) : null
    return `https://www.youtube.com/embed/${id}${start ? `?start=${start}` : ''}`
  } catch {
    return null
  }
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
  return speakingEngagements
    .filter(e => e.slug)
    .map(e => ({ slug: e.slug }))
}

export default async function SpeakingDetail({ params }) {
  const { slug } = await params
  const engagement = getEngagementBySlug(slug)

  if (!engagement) {
    notFound()
  }

  // Prefer an explicit videoUrl, otherwise derive an embed from any YouTube link.
  const youtubeLink = (engagement.links || []).find(l => /youtu\.?be/.test(l.url))
  const videoEmbed = engagement.videoUrl || toYouTubeEmbed(youtubeLink?.url)
  const blogLink = (engagement.links || []).find(l => l.type === 'blog' && l.url.startsWith('/blog'))
  const gallery = engagement.gallery || []

  return (
    <SimpleLayout
      title={engagement.title}
      intro={engagement.description}
    >
      {/* Back link */}
      <div className="mb-8">
        <Link
          href="/speaking"
          className="inline-flex items-center gap-2 text-burnt-400 dark:text-amber-400 hover:text-burnt-500 dark:hover:text-amber-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All speaking engagements
        </Link>
      </div>

      {/* Hero image */}
      {engagement.image && (
        <figure className="mb-8 overflow-hidden rounded-xl border border-parchment-300 dark:border-slate-700 shadow-sm">
          <Image
            src={engagement.image}
            alt={`${engagement.title} — ${engagement.event}`}
            width={1280}
            height={720}
            className={`w-full h-auto ${engagement.imagePosition === 'top' ? 'object-top' : ''}`}
            priority
          />
        </figure>
      )}

      {/* Talk metadata */}
      <div className="flex flex-wrap gap-4 mb-8 text-sm text-parchment-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {engagement.date}
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4" />
          {engagement.audience}
        </div>
        <div>
          📍 {engagement.location}
        </div>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-2 mb-8">
        {engagement.topics.map((topic, index) => (
          <span
            key={index}
            className="inline-block px-3 py-1 bg-burnt-400/10 dark:bg-amber-500/20 text-burnt-500 dark:text-amber-400 text-sm rounded-md"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Recording */}
      {videoEmbed && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-charcoal-50 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-burnt-400 dark:text-amber-400" />
            Recording
          </h2>
          <div className="rounded-lg overflow-hidden border border-parchment-300 dark:border-slate-700">
            <iframe
              src={videoEmbed}
              title={`${engagement.title} - Video`}
              className="w-full border-0"
              style={{ aspectRatio: '16/9' }}
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
            />
          </div>
        </section>
      )}

      {/* Interactive Slidev deck */}
      {engagement.slidevUrl && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-charcoal-50 dark:text-slate-100 mb-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-indigo-500" />
            Interactive Slide Deck
          </h2>
          <SlidevEmbed
            src={engagement.slidevUrl}
            title={`${engagement.title} - Interactive Slides`}
          />
        </section>
      )}

      {/* Gallery */}
      {gallery.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-charcoal-50 dark:text-slate-100 mb-4">
            From the talk
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {gallery.map((img, index) => (
              <figure
                key={index}
                className="overflow-hidden rounded-lg border border-parchment-300 dark:border-slate-700"
              >
                <Image
                  src={img.src}
                  alt={img.alt || `${engagement.title} photo ${index + 1}`}
                  width={800}
                  height={600}
                  className="w-full h-auto"
                  loading="lazy"
                />
                {img.alt && (
                  <figcaption className="px-3 py-2 text-xs text-parchment-500 dark:text-slate-400">
                    {img.alt}
                  </figcaption>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Full write-up CTA */}
      {blogLink && (
        <section className="mb-8">
          <Link
            href={blogLink.url}
            className="group flex items-center justify-between gap-4 rounded-xl border border-parchment-300 dark:border-slate-700 bg-parchment-50 dark:bg-slate-800/50 px-5 py-4 transition-colors hover:border-burnt-400 dark:hover:border-amber-400"
          >
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-burnt-400 dark:text-amber-400 flex-shrink-0" />
              <div>
                <div className="font-semibold text-charcoal-50 dark:text-slate-100">
                  Read the full write-up
                </div>
                <div className="text-sm text-parchment-500 dark:text-slate-400">
                  The complete story, with detail and takeaways
                </div>
              </div>
            </div>
            <span className="text-burnt-400 dark:text-amber-400 transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
          </Link>
        </section>
      )}

      {/* Links */}
      {engagement.links && engagement.links.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-charcoal-50 dark:text-slate-100 mb-4">
            Resources
          </h2>
          <div className="flex flex-wrap gap-3">
            {engagement.links.map((link, index) => (
              <ExternalLinkButton key={index} link={link} />
            ))}
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
          })
        }}
      />
    </SimpleLayout>
  )
}
