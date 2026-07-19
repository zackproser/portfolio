import { StaticImageData } from 'next/image'
import { Metadata } from 'next'
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
  hiddenFromIndex?: boolean  // Hide from /blog listing but keep accessible via direct link (for SEO/affiliate content)
  hideNewsletter?: boolean  // Per-post opt-out for the sticky newsletter-capture modal
  blogStyle?: 'blueprint'  // Opt-in alternate post layout (Blueprint Deep Dive engineering-drawing style)
  blueprint?: {
    number?: string  // Drawing number, e.g. "001" → TDD-001
    subject?: string  // Title-block SUBJECT cell, e.g. "ATTENTION"
    project?: string  // Title-block PROJECT cell (default "DEEP DIVES")
    scale?: string  // Title-block SCALE cell (default "1 : 1")
    drawnBy?: string  // Title-block DRAWN BY cell (default "Z. PROSER")
    readTime?: string  // Title-block READ TIME cell, e.g. "25 MIN"
    eyebrow?: string  // Masthead eyebrow line
    subtitle?: string  // Serif italic dek under the H1
    revision?: string  // Colophon revision (default "REV A")
    rfiSuggestions?: string[]  // Suggestion chips for the RFI desk/drawer
  }
  durSec?: number  // Video duration in seconds (for video content type)
  views?: number  // Video view count (for video content type)
  commerce?: CommerceConfig
  landing?: {
    heroTitle?: string  // Custom hero title
    subtitle?: string
    problemSolved?: string  // Clear statement of what problem this product solves
    benefitStatement?: string  // Clear statement of user benefit
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
    credibilityBanner?: string
    experiencedEngineersSection?: {
      title: string
      content: string
    }
  }
} 