/**
 * Affiliate link utilities with UTM tracking
 *
 * UTM parameters help track which pages/placements drive conversions.
 * Check your affiliate dashboards (Granola, WisprFlow) to see if they report UTM data.
 */

export type AffiliateProduct = 'wisprflow' | 'granola'
export type AffiliateMedium = 'blog' | 'demo' | 'homepage' | 'newsletter' | 'tools'
export type AffiliatePlacement = 'sticky-cta' | 'inline-cta' | 'hero-card' | 'compact-card' | 'text-link' | 'dual-card'

const BASE_LINKS: Record<AffiliateProduct, string> = {
  wisprflow: 'https://ref.wisprflow.ai/zack-proser',
  granola: 'https://go.granola.ai/zack-proser'
}

interface AffiliateParams {
  product: AffiliateProduct
  campaign: string      // Page slug or identifier (e.g., 'ai-tools-for-lawyers')
  medium: AffiliateMedium
  placement: AffiliatePlacement
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
 */
export function getAffiliateLink(params: AffiliateParams): string {
  const { product, campaign, medium, placement } = params

  const utmParams = new URLSearchParams({
    utm_source: 'zackproser',
    utm_medium: medium,
    utm_campaign: campaign,
    utm_content: placement
  })

  return `${BASE_LINKS[product]}?${utmParams.toString()}`
}

/**
 * Get base affiliate link without UTM parameters
 * Use this for backwards compatibility or when UTM tracking isn't needed
 */
export function getBaseAffiliateLink(product: AffiliateProduct): string {
  return BASE_LINKS[product]
}

/**
 * Convenience exports for use in components
 */
export const AFFILIATE_PRODUCTS = ['wisprflow', 'granola'] as const
export const AFFILIATE_MEDIUMS = ['blog', 'demo', 'homepage', 'newsletter', 'tools'] as const
export const AFFILIATE_PLACEMENTS = ['sticky-cta', 'inline-cta', 'hero-card', 'compact-card', 'text-link', 'dual-card'] as const
