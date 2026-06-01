/**
 * Rewrite the `slug` query param on any /api/og image URLs in a Next.js
 * metadata object to a known-correct slug.
 *
 * Guards against the MDX-time slug auto-derivation (in createMetadata) resolving
 * to the literal "[slug]" dynamic-route segment, which would stop the /api/og
 * route from serving the pre-generated static OG image and force a slow dynamic
 * fallback that social scrapers often fail to render.
 */
export function withCorrectOgSlug<T>(metadata: T, slug: string): T {
  if (!metadata || !slug) return metadata

  const fixUrl = (url: unknown): unknown => {
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

  const fixImages = (images: unknown): unknown => {
    if (!images) return images
    if (Array.isArray(images)) {
      return images.map((img) =>
        typeof img === 'string'
          ? fixUrl(img)
          : img && typeof img === 'object' && 'url' in img
            ? { ...img, url: fixUrl((img as { url: unknown }).url) }
            : img,
      )
    }
    if (typeof images === 'string') return fixUrl(images)
    if (typeof images === 'object' && images !== null && 'url' in images) {
      return { ...images, url: fixUrl((images as { url: unknown }).url) }
    }
    return images
  }

  const m = metadata as Record<string, unknown>
  const next: Record<string, unknown> = { ...m }
  if (m.openGraph && typeof m.openGraph === 'object') {
    next.openGraph = { ...(m.openGraph as object), images: fixImages((m.openGraph as { images?: unknown }).images) }
  }
  if (m.twitter && typeof m.twitter === 'object') {
    next.twitter = { ...(m.twitter as object), images: fixImages((m.twitter as { images?: unknown }).images) }
  }
  return next as T
}
