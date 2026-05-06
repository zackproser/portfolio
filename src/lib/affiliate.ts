/**
 * Affiliate link utilities with UTM tracking
 *
 * UTM parameters help track which pages/placements drive conversions.
 * Check your affiliate dashboards (Granola, WisprFlow) to see if they report UTM data.
 */

export type AffiliateProduct = 'wisprflow' | 'granola' | 'firecrawl'
export type AffiliateMedium = 'blog' | 'demo' | 'homepage' | 'newsletter' | 'tools'
export type AffiliatePlacement = 'sticky-cta' | 'inline-cta' | 'hero-card' | 'compact-card' | 'text-link' | 'dual-card' | 'concierge'

const BASE_LINKS: Record<AffiliateProduct, string> = {
  wisprflow: 'https://ref.wisprflow.ai/zack-proser',
  granola: 'https://go.granola.ai/zack-proser',
  firecrawl: 'https://firecrawl.link/zack-proser'
}

interface AffiliateParams {
  product: AffiliateProduct
  campaign: string      // Page slug or identifier (e.g., 'ai-tools-for-lawyers')
  medium: AffiliateMedium
  placement: AffiliatePlacement
  // Optional. Used by the concierge widget to encode role/shape/stack so the
  // affiliate dashboard can attribute conversions back to specific persona +
  // meeting-shape combinations. Format is free-form but stay snake_case +
  // ASCII so analytics tools display it cleanly.
  term?: string
}

/**
 * Generate an affiliate link with UTM tracking parameters
 *
 * @example
 * getAffiliateLink({
 *   product: 'wisprflow',
 *   campaign: 'ai-tools-for-lawyers',
 *   medium: 'blog',
 *   placement: 'hero-card'
 * })
 * // Returns: https://ref.wisprflow.ai/zack-proser?utm_source=zackproser&utm_medium=blog&utm_campaign=ai-tools-for-lawyers&utm_content=hero-card
 *
 * @example
 * getAffiliateLink({
 *   product: 'granola',
 *   campaign: 'granola-for-engineers',
 *   medium: 'blog',
 *   placement: 'concierge',
 *   term: 'engineer_sensitive_mac'
 * })
 * // Returns: https://go.granola.ai/zack-proser?utm_source=zackproser&utm_medium=blog&utm_campaign=granola-for-engineers&utm_content=concierge&utm_term=engineer_sensitive_mac
 */
export function getAffiliateLink(params: AffiliateParams): string {
  const { product, campaign, medium, placement, term } = params

  const utmParams = new URLSearchParams({
    utm_source: 'zackproser',
    utm_medium: medium,
    utm_campaign: campaign,
    utm_content: placement,
  })
  if (term) utmParams.set('utm_term', term)

  return `${BASE_LINKS[product]}?${utmParams.toString()}`
}

/**
 * Build a deterministic utm_term string from concierge picks. Stable
 * ordering so the same combination always produces the same term value
 * for clean grouping in the affiliate dashboard.
 */
export function buildConciergeTerm(parts: {
  role?: string | null
  shape?: string | null
  stack?: string | null
}): string {
  return [parts.role, parts.shape, parts.stack]
    .filter((p): p is string => Boolean(p))
    .map(p => p.replace(/[^a-z0-9-]/gi, '').toLowerCase())
    .filter(Boolean)
    .join('_')
}

