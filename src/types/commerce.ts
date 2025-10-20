import { StaticImageData } from 'next/image'

// Commerce-related types
export interface CommerceConfig {
  isPaid: boolean

  /**
   * When true, user must be authenticated (signed in) to access content.
   * This is Tier 2 - requires authentication. On first sign-in, users are auto-subscribed to newsletter.
   * Content access only checks for valid session, not subscription status.
   */
  requiresAuth?: boolean

  /**
   * @deprecated Use requiresAuth instead. This field is kept for backward compatibility.
   * When true, the content requires authentication (same as requiresAuth).
   */
  requiresEmail?: boolean

  price: number
  stripe_price_id?: string
  previewLength?: number
  previewElements?: number
  paywallHeader?: string
  paywallBody?: string
  buttonText?: string
  miniPaywallTitle?: string
  miniPaywallDescription?: string
  paywallImage?: string | StaticImageData
  paywallImageAlt?: string
  profileImage?: string | StaticImageData
}

// Pricing-related types
export interface PricingTier {
  name: string
  price: number
  currency: string
  interval?: 'month' | 'year' | 'one-time'
  features: string[]
  stripe_price_id?: string
  isPopular?: boolean
  description?: string
} 