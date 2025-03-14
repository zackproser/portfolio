import { StaticImageData } from 'next/image'
import { Metadata } from 'next'
import { CommerceConfig } from './commerce'

// Base metadata interface that extends Next.js Metadata
export interface ExtendedMetadata extends Metadata {
  title: string
  author: string
  date: string
  description: string
  image?: string | StaticImageData | { src: string }
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
    features?: Array<{
      title: string
      description: string
      icon?: string
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
  }
} 