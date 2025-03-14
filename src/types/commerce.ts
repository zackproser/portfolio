import { StaticImageData } from 'next/image'

// Commerce-related types
export interface CommerceConfig {
  isPaid: boolean
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