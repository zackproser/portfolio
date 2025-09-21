// Local fallbacks to avoid type resolution issues when Next.js types aren't available
type StaticImageData = any
type Metadata = any
import { CommerceConfig } from './commerce'

// Interface for OpenGraph URL generator parameters
export interface OgUrlParams {
  title?: string;
  description?: string;
  image?: any; // Using any for flexibility with different image object structures
  slug?: string | null | undefined; // Updated to match how it's used in generateOgUrl
}

// Base metadata interface that extends Next.js Metadata
export interface ExtendedMetadata extends Metadata {
  title: string
  author: string
  date: string
  description: string
  image?: string | StaticImageData | { 
    src: string;
    fullPath?: string; // Added for OG image generation to track original image location
  }
  type: 'blog' | 'course' | 'video' | 'demo'
  slug: string
  tags?: string[]
  _id?: string  // Internal unique identifier to prevent duplicate key issues
  commerce?: CommerceConfig
  landing?: {
    heroTitle?: string  // Custom hero title
    subtitle?: string
    problemSolved?: string  // Clear statement of what problem this product solves
    benefitStatement?: string  // Clear statement of user benefit
    urgencyBanner?: string // Short urgent note shown near the top
    features?: Array<{
      title: string
      description: string
      icon?: string
    }>
    whatsIncluded?: Array<{
      title: string
      description: string
      image: string | StaticImageData
      imageAlt?: string
    }>
    contentSections?: Array<{
      title: string
      subsections?: Array<string>
    }>
    testimonials?: Array<{
      content: string
      author: {
        name: string
        role: string
        avatar?: string
        imageUrl?: any
      }
    }>
    faqs?: Array<{
      question: string
      answer: string
    }>
    authorityBullets?: string[] // "Why listen to me" bullet points
    emailCapture?: {
      headline?: string
      subheadline?: string
      buttonText?: string
      successHeadline?: string
      successBodyNew?: string
      successBodyExisting?: string
      placeholder?: string
    }
  }
} 