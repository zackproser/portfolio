'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { Route } from 'next'
import type { Content } from '@/types/content'

const fallbackImage = 'https://zackproser.b-cdn.net/images/wakka.webp'

function resolveImage(image: Content['image']): string {
  if (!image) return fallbackImage
  if (typeof image === 'string') return image
  if (typeof image === 'object' && 'src' in image && image.src) return image.src
  return fallbackImage
}

function labelFor(type?: string, override?: string) {
  if (override) return override
  switch (type) {
    case 'video':
      return 'Video'
    case 'demo':
      return 'Demo'
    case 'course':
      return 'Course'
    default:
      return 'Essay'
  }
}

function hrefFor(slug?: string) {
  if (!slug) return '#'
  if (slug.startsWith('http://') || slug.startsWith('https://')) return slug
  return slug
}

interface EditorialCardProps {
  article: Content
  index: number
  kind?: string
}

export function EditorialCard({ article, index, kind }: EditorialCardProps) {
  const { title = 'Untitled', date = '', description = '', image, type, slug } = article
  const href = hrefFor(slug)
  const imageSource = resolveImage(image)
  const label = labelFor(type, kind)
  const idx = String(index).padStart(2, '0')

  const formattedDate = date
    ? new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        timeZone: 'UTC',
      })
    : ''

  const isExternal = href.startsWith('http')
  const LinkTag: typeof Link | 'a' = isExternal ? 'a' : Link
  const linkProps = isExternal
    ? { href, target: '_blank', rel: 'noopener noreferrer' as const }
    : { href: href as Route }

  return (
    <article className="editorial-card group">
      {/* @ts-expect-error - LinkTag is either Link or 'a', both accept href */}
      <LinkTag {...linkProps} className="editorial-card-link">
        <div className="editorial-card-meta">
          <span>C{idx} · {label}</span>
        </div>
        <div className="editorial-card-media">
          <Image
            src={imageSource}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="editorial-card-image"
          />
          <div className="editorial-card-rule" />
        </div>
        <div className="editorial-card-body">
          <div className="editorial-card-date">
            {formattedDate}
          </div>
          <h3 className="editorial-card-title">{title}</h3>
          {description ? (
            <p className="editorial-card-desc">{description}</p>
          ) : null}
          <div className="editorial-card-footer">
            <span className="editorial-card-read">Read →</span>
            <span className="editorial-card-index">C.{idx}</span>
          </div>
        </div>
      </LinkTag>
    </article>
  )
}
