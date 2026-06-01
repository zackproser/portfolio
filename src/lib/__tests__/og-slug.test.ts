/**
 * @jest-environment node
 */
import { withCorrectOgSlug } from '../og-slug'

const OG = (slug: string) =>
  `https://zackproser.com/api/og?slug=${encodeURIComponent(slug)}&title=Hello`

describe('withCorrectOgSlug', () => {
  it('replaces the unresolved [slug] segment with the real slug', () => {
    const meta = {
      openGraph: { images: [{ url: OG('[slug]'), alt: 'x' }] },
      twitter: { images: [OG('[slug]')] },
    }
    const fixed = withCorrectOgSlug(meta, 'my-post') as typeof meta
    expect(fixed.openGraph.images[0].url).toContain('slug=my-post')
    expect(fixed.openGraph.images[0].url).not.toContain('%5Bslug%5D')
    expect(fixed.twitter.images[0]).toContain('slug=my-post')
  })

  it('leaves an already-correct slug untouched', () => {
    const url = OG('my-post')
    const meta = { openGraph: { images: [{ url }] } }
    const fixed = withCorrectOgSlug(meta, 'my-post') as typeof meta
    expect(fixed.openGraph.images[0].url).toBe(url)
  })

  it('ignores non-/api/og image URLs', () => {
    const url = 'https://zackproser.b-cdn.net/images/og-images/my-post.png'
    const meta = { openGraph: { images: [{ url }] } }
    const fixed = withCorrectOgSlug(meta, 'my-post') as typeof meta
    expect(fixed.openGraph.images[0].url).toBe(url)
  })

  it('handles string-form image entries', () => {
    const meta = { openGraph: { images: OG('[slug]') } }
    const fixed = withCorrectOgSlug(meta, 'my-post') as { openGraph: { images: string } }
    expect(fixed.openGraph.images).toContain('slug=my-post')
  })

  it('is a no-op without a slug', () => {
    const meta = { openGraph: { images: [{ url: OG('[slug]') }] } }
    expect(withCorrectOgSlug(meta, '')).toBe(meta)
  })
})
