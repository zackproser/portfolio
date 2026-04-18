'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { Twitter, Linkedin, Github, Link as LinkIcon, Bookmark, Check } from 'lucide-react'
import GiscusWrapper from '@/components/GiscusWrapper'
import MiniPaywall from '@/components/MiniPaywall'
import StickyAffiliateCTA from '@/components/StickyAffiliateCTA'
import { EditorialNewsletter } from '@/components/EditorialNewsletter'
import type { ExtendedMetadata, Content } from '@/types'

const VOICE_AFFILIATE_SLUGS = [
  'wisprflow', 'granola', 'voice-to-text', 'voice-tools', 'voice-ai',
  'walking-and-talking', 'small-business', 'lawyers', 'record-meetings',
  'ai-engineer-setup', 'doctors', 'real-estate',
]

function shouldShowVoiceAffiliateCTA(slug: string): boolean {
  const lower = slug.toLowerCase()
  return VOICE_AFFILIATE_SLUGS.some(k => lower.includes(k))
}

function resolveImageSrc(image: Content['image']): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  if (typeof image === 'object' && 'src' in image && image.src) return image.src
  return null
}

function formatPublished(date?: string): string {
  if (!date) return ''
  try {
    return new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC',
    })
  } catch { return date }
}

function kindFromContent(content: Partial<ExtendedMetadata> & { tags?: string[] }): string {
  if (content?.type === 'video') return 'Video'
  if (content?.type === 'course') return 'Course'
  if (content?.type === 'demo') return 'Demo'
  const t = (content?.tags || []).map(s => s.toLowerCase())
  if (t.some(x => x.includes('tutorial'))) return 'Tutorial'
  if (t.some(x => x.includes('review'))) return 'Review'
  if (t.some(x => x.includes('reference') || x.includes('architecture'))) return 'Ref arch'
  return 'Essay'
}

function glyphFromTitle(title: string): string {
  const first = (title || 'Z').trim().charAt(0).toUpperCase()
  return /[A-Z]/.test(first) ? first : 'Z'
}

function sectionNumFromKind(kind: string): string {
  switch (kind) {
    case 'Tutorial': return '01'
    case 'Essay': return '03'
    case 'Ref arch': return '04'
    case 'Review': return '03'
    case 'Video': return '06'
    default: return '03'
  }
}

interface Props {
  children: React.ReactNode
  metadata: ExtendedMetadata & {
    hideMiniPaywall?: boolean
    miniPaywallTitle?: string | null
    miniPaywallDescription?: string | null
    tags?: string[]
    githubUrl?: string
  }
  serverHasPurchased?: boolean
  hideNewsletter?: boolean
}

export function EditorialArticleLayout({
  children,
  metadata,
  serverHasPurchased = false,
  hideNewsletter = false,
}: Props) {
  const safeSlug = metadata?.slug || ''
  const safeTitle = (metadata?.title as string) || 'Untitled'
  const safeDescription = (metadata?.description as string) || ''
  const baseSlug = safeSlug ? safeSlug.split('/').pop() || safeSlug : ''
  const imageSrc = resolveImageSrc(metadata?.image)
  const kind = kindFromContent(metadata)
  const sectionNum = sectionNumFromKind(kind)
  const publishedLabel = formatPublished(metadata?.date)
  const tags = metadata?.tags || []
  const category = tags[0] || 'Applied AI'

  const fullUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://zackproser.com'}/blog/${baseSlug}`

  const articleRef = useRef<HTMLDivElement | null>(null)
  const progressFillRef = useRef<HTMLDivElement | null>(null)
  const [readingMin, setReadingMin] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [shareVisible, setShareVisible] = useState(false)

  useEffect(() => {
    const body = articleRef.current
    if (!body) return

    // Mark the first paragraph as .lede for drop cap
    const firstP = body.querySelector('p')
    if (firstP && !firstP.classList.contains('lede')) {
      firstP.classList.add('lede')
    }

    // Number h2s with § 01, § 02 ...
    const h2s = body.querySelectorAll<HTMLHeadingElement>('h2')
    h2s.forEach((h, i) => {
      if (!h.getAttribute('data-n')) {
        h.setAttribute('data-n', `§ ${String(i + 1).padStart(2, '0')}`)
      }
    })

    // Reading time estimate (~220 wpm)
    const words = (body.textContent || '').trim().split(/\s+/).filter(Boolean).length
    setReadingMin(Math.max(1, Math.round(words / 220)))
  }, [children])

  useEffect(() => {
    const fill = progressFillRef.current
    const body = articleRef.current
    let raf = 0
    const update = () => {
      const h = document.documentElement
      if (fill) {
        const pct = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)
        fill.style.width = `${Math.min(100, Math.max(0, pct * 100))}%`
      }
      if (body) {
        // Fade the share rail in once the reader is ~2 sentences into the body.
        const bodyTop = body.getBoundingClientRect().top
        setShareVisible((prev) => {
          const next = bodyTop < -160
          return next === prev ? prev : next
        })
      }
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* ignore */ }
  }

  const shareXUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(safeTitle)}&url=${encodeURIComponent(fullUrl)}`
  const shareLinkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`

  const shouldShowMiniPaywall =
    metadata?.commerce?.isPaid &&
    !metadata?.hideMiniPaywall &&
    !serverHasPurchased &&
    (metadata?.miniPaywallTitle || metadata?.commerce?.miniPaywallTitle) &&
    (metadata?.miniPaywallDescription || metadata?.commerce?.miniPaywallDescription)

  return (
    <>

      <div className="blog-post-page">
        {/* Reading progress */}
        <div className="reading-progress">
          <div className="reading-progress-fill" ref={progressFillRef} />
        </div>

        {/* Breadcrumb */}
        <div className="post-container">
          <div className="post-crumbs">
            <Link href="/blog">Writing</Link>
            <span className="sep">/</span>
            <span className="current">{safeTitle}</span>
          </div>
        </div>

        {/* Editorial portrait header */}
        <section className="hdr-A">
          <div className="post-container">
            <div className="hdr-A-grid">
              <div>
                <div className="post-kicker">
                  § {sectionNum} · {category}
                </div>
                <h1 className="post-title">{safeTitle}</h1>
                {safeDescription && (
                  <p className="post-dek">{safeDescription}</p>
                )}
                <dl className="post-meta-dl">
                  <div>
                    <dt>Published</dt>
                    <dd>{publishedLabel || '—'}</dd>
                  </div>
                  <div>
                    <dt>Reading</dt>
                    <dd>
                      {readingMin !== null ? (
                        <>
                          {readingMin}<span className="unit">min</span>
                        </>
                      ) : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt>Kind</dt>
                    <dd>{kind}</dd>
                  </div>
                  <div>
                    <dt>{metadata?.githubUrl ? 'Code' : 'Tags'}</dt>
                    <dd>
                      {metadata?.githubUrl ? (
                        <a href={metadata.githubUrl} target="_blank" rel="noopener noreferrer">
                          ↗ github
                        </a>
                      ) : (
                        <span>{tags[0] || '—'}</span>
                      )}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="portrait-wrap">
                <div className="hdr-A-plate">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={safeTitle}
                      fill
                      sizes="(max-width: 900px) 80vw, 360px"
                      className="plate-image"
                      priority
                    />
                  ) : (
                    <div className="glyph">{glyphFromTitle(safeTitle)}</div>
                  )}
                  <div className="plate-caption">
                    Plate · {kind} · {publishedLabel || 'MMXXVI'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Share rail */}
        <aside
          className={`share-rail${shareVisible ? ' visible' : ''}`}
          aria-label="Share"
          aria-hidden={!shareVisible}
        >
          <div className="share-btn-label">Share</div>
          <button className="share-btn" aria-label="Copy link" title="Copy link" onClick={handleCopy}>
            {copied ? <Check /> : <LinkIcon />}
          </button>
          <a className="share-btn" href={shareXUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
            <Twitter />
          </a>
          <a className="share-btn" href={shareLinkedInUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <Linkedin />
          </a>
          <button
            className="share-btn"
            aria-label="Save for later"
            title="Save for later"
            onClick={() => { try { localStorage.setItem(`bookmark:${baseSlug}`, '1') } catch {} }}
          >
            <Bookmark />
          </button>
        </aside>

        {/* Article */}
        <article className="layout-A">
          {shouldShowMiniPaywall && (
            <MiniPaywall content={metadata as Content} />
          )}
          <div className="post-body" ref={articleRef}>
            {children}
          </div>

          {!hideNewsletter && (
            <div className="inline-newsletter-card">
              <EditorialNewsletter location={`blog:${baseSlug}`} />
            </div>
          )}

          {/* Author bio */}
          <div className="post-bio">
            <div className="bio-plate">
              <Image
                src="https://zackproser.b-cdn.net/images/zack-sketch.webp"
                alt="Zachary Proser"
                fill
                sizes="120px"
                className="plate-image"
              />
            </div>
            <div className="bio-content">
              <div className="bio-label">About the author</div>
              <h3 className="bio-name">Zachary Proser</h3>
              <p className="bio-desc">
                Applied AI at WorkOS. Formerly Pinecone, Cloudflare, Gruntwork.
                Full-stack — databases, backends, middleware, frontends — with
                a long streak of infrastructure-as-code and cloud systems.
              </p>
              <div className="bio-links">
                <Link href="/newsletter">Newsletter →</Link>
                <Link href="/blog">All essays →</Link>
                <a href="https://github.com/zackproser" target="_blank" rel="noopener noreferrer">
                  <Github className="inline h-3 w-3 mr-1" strokeWidth={2} />GitHub
                </a>
                <a href="https://twitter.com/zackproser" target="_blank" rel="noopener noreferrer">
                  <Twitter className="inline h-3 w-3 mr-1" strokeWidth={2} />X / Twitter
                </a>
                <a href="https://linkedin.com/in/zackproser" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="inline h-3 w-3 mr-1" strokeWidth={2} />LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Comments */}
          <section className="post-comments">
            <div className="comments-head">
              <h3>Discussion</h3>
              <span className="count">Giscus</span>
            </div>
            <Suspense fallback={<div className="text-sm text-slate-500">Loading comments…</div>}>
              <GiscusWrapper />
            </Suspense>
          </section>
        </article>
      </div>

      {shouldShowVoiceAffiliateCTA(safeSlug) && (
        <StickyAffiliateCTA product="both" campaign={safeSlug} />
      )}
    </>
  )
}
