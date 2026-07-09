/**
 * @jest-environment node
 */
import { withCorrectSlug } from '../og-slug'

const OG = (slug: string) =>
  `https://zackproser.com/api/og?slug=${encodeURIComponent(slug)}&title=Hello`

describe('withCorrectSlug', () => {
  it('replaces the unresolved [slug] segment in OG image URLs', () => {
    const meta = {
      openGraph: { images: [{ url: OG('[slug]'), alt: 'x' }] },
      twitter: { images: [OG('[slug]')] },
    }
    const fixed = withCorrectSlug(meta, 'my-post') as typeof meta
    expect(fixed.openGraph.images[0].url).toContain('slug=my-post')
    expect(fixed.openGraph.images[0].url).not.toContain('%5Bslug%5D')
    expect(fixed.twitter.images[0]).toContain('slug=my-post')
  })

  it('replaces the unresolved [slug] segment in og:url and canonical', () => {
    const meta = {
      openGraph: { url: 'https://zackproser.com/blog/[slug]', images: [] },
      alternates: { canonical: 'https://zackproser.com/blog/[slug]' },
    }
    const fixed = withCorrectSlug(meta, 'my-post') as typeof meta
    expect(fixed.openGraph.url).toBe('https://zackproser.com/blog/my-post')
    expect(fixed.alternates.canonical).toBe('https://zackproser.com/blog/my-post')
  })

  it('replaces the URL-encoded %5Bslug%5D token', () => {
    const meta = {
      openGraph: { url: 'https://zackproser.com/blog/%5Bslug%5D', images: [] },
    }
    const fixed = withCorrectSlug(meta, 'my-post') as typeof meta
    expect(fixed.openGraph.url).toBe('https://zackproser.com/blog/my-post')
  })

  it('repairs the top-level slug field', () => {
    const meta = { slug: '[slug]', openGraph: { images: [] } }
    const fixed = withCorrectSlug(meta, 'my-post') as typeof meta
    expect(fixed.slug).toBe('my-post')
  })

  it('leaves already-correct URLs untouched', () => {
    const url = OG('my-post')
    const canonical = 'https://zackproser.com/blog/my-post'
    const meta = {
      openGraph: { url: canonical, images: [{ url }] },
      alternates: { canonical },
    }
    const fixed = withCorrectSlug(meta, 'my-post') as typeof meta
    expect(fixed.openGraph.images[0].url).toBe(url)
    expect(fixed.openGraph.url).toBe(canonical)
    expect(fixed.alternates.canonical).toBe(canonical)
  })

  it('ignores non-/api/og image URLs', () => {
    const url = 'https://zackproser.b-cdn.net/images/og-images/my-post.png'
    const meta = { openGraph: { images: [{ url }] } }
    const fixed = withCorrectSlug(meta, 'my-post') as typeof meta
    expect(fixed.openGraph.images[0].url).toBe(url)
  })

  it('handles string-form image entries', () => {
    const meta = { openGraph: { images: OG('[slug]') } }
    const fixed = withCorrectSlug(meta, 'my-post') as { openGraph: { images: string } }
    expect(fixed.openGraph.images).toContain('slug=my-post')
  })

  it('is a no-op without a slug', () => {
    const meta = { openGraph: { images: [{ url: OG('[slug]') }] } }
    expect(withCorrectSlug(meta, '')).toBe(meta)
  })
})
