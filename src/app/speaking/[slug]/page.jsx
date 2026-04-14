import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { SimpleLayout } from '@/components/SimpleLayout'
import { createMetadata } from '@/utils/createMetadata'
import { ExternalLinkButton } from '@/components/ExternalLinkButton'
import { speakingEngagements } from '../speaking-data'
import { ArrowLeft, Calendar, Users, ExternalLink, Youtube, Link as LinkIcon, Play } from 'lucide-react'

function getEngagementBySlug(slug) {
  return speakingEngagements.find(e => e.slug === slug)
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
    slug: `speaking/${slug}`,
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

      {/* Interactive Slidev deck */}
      {engagement.slidevUrl && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-charcoal-50 dark:text-slate-100 flex items-center gap-2">
              <Play className="h-5 w-5 text-indigo-500" />
              Interactive Slide Deck
            </h2>
            <a
              href={engagement.slidevUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-burnt-400 dark:text-amber-400 hover:text-burnt-500 dark:hover:text-amber-300 transition-colors"
            >
              Open full screen
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
          <div className="rounded-lg overflow-hidden border border-parchment-200 dark:border-slate-700">
            <iframe
              src={engagement.slidevUrl}
              title={`${engagement.title} - Interactive Slides`}
              className="w-full border-0"
              style={{ aspectRatio: '16/9' }}
              allow="fullscreen"
              loading="lazy"
            />
          </div>
          <p className="mt-2 text-sm text-parchment-500 dark:text-slate-400">
            Use arrow keys or click to navigate slides. Press F for fullscreen.
          </p>
        </section>
      )}

      {/* Video embed */}
      {engagement.videoUrl && (
        <section className="mb-8">
          <h2 className="text-xl font-bold text-charcoal-50 dark:text-slate-100 mb-4">
            Recording
          </h2>
          <div className="rounded-lg overflow-hidden">
            <iframe
              src={engagement.videoUrl}
              title={`${engagement.title} - Video`}
              className="w-full border-0"
              style={{ aspectRatio: '16/9' }}
              allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              loading="lazy"
            />
          </div>
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
