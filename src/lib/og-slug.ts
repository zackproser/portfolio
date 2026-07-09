/**
 * Repair Next.js metadata whose slug resolved to the literal "[slug]"
 * dynamic-route segment.
 *
 * The MDX-time slug auto-derivation (in createMetadata) reads the compiled
 * file path from a stack trace, which in production resolves to
 * `.next/server/app/blog/[slug]/…` — so every URL built from the slug is
 * poisoned with the literal token "[slug]":
 *
 * - /api/og image URLs get `?slug=[slug]`, which stops the /api/og route
 *   from serving the pre-generated static OG image and forces a slow dynamic
 *   fallback that social scrapers often fail to render.
 * - `openGraph.url` and `alternates.canonical` become
 *   `https://zackproser.com/blog/[slug]` — LinkedIn and other scrapers use
 *   og:url as the card's click target, so shared cards 404, and every post
 *   claims the same bogus canonical.
 *
 * The route handlers know the real directory slug, so this rewrites all of
 * those URLs to use it.
 */
export function withCorrectSlug<T>(metadata: T, slug: string): T {
  if (!metadata || !slug) return metadata

  const fixOgApiUrl = (url: unknown): unknown => {
    if (typeof url !== 'string' || !url.includes('/api/og')) return url
    try {
      const u = new URL(url)
      if (u.searchParams.get('slug') === slug) return url
      u.searchParams.set('slug', slug)
      return u.toString()
    } catch {
      return url
    }
  }

  // Replace the literal route token (raw or URL-encoded) anywhere in a URL.
  const fixSlugToken = (url: unknown): unknown => {
    if (typeof url !== 'string') return url
    return url.replace(/\[slug\]|%5Bslug%5D/gi, slug)
  }

  const fixImages = (images: unknown): unknown => {
    if (!images) return images
    if (Array.isArray(images)) {
      return images.map((img) =>
        typeof img === 'string'
          ? fixOgApiUrl(img)
          : img && typeof img === 'object' && 'url' in img
            ? { ...img, url: fixOgApiUrl((img as { url: unknown }).url) }
            : img,
      )
    }
    if (typeof images === 'string') return fixOgApiUrl(images)
    if (typeof images === 'object' && images !== null && 'url' in images) {
      return { ...images, url: fixOgApiUrl((images as { url: unknown }).url) }
    }
    return images
  }

  const m = metadata as Record<string, unknown>
  const next: Record<string, unknown> = { ...m }
  if (typeof m.slug === 'string') {
    next.slug = fixSlugToken(m.slug)
  }
  if (m.openGraph && typeof m.openGraph === 'object') {
    const og = m.openGraph as { images?: unknown; url?: unknown }
    next.openGraph = {
      ...(m.openGraph as object),
      url: fixSlugToken(og.url),
      images: fixImages(og.images),
    }
  }
  if (m.twitter && typeof m.twitter === 'object') {
    next.twitter = { ...(m.twitter as object), images: fixImages((m.twitter as { images?: unknown }).images) }
  }
  if (m.alternates && typeof m.alternates === 'object') {
    const alternates = m.alternates as { canonical?: unknown }
    next.alternates = {
      ...(m.alternates as object),
      canonical: fixSlugToken(alternates.canonical),
    }
  }
  return next as T
}
