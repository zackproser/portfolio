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
    subtitle?: string
    features?: Array<{
      title: string
      description: string
      icon?: string
    }>
    testimonials?: Array<{
      content: string
      author: {
        name: string
        role: string
        avatar?: string
      }
    }>
    faqs?: Array<{
      question: string
      answer: string
    }>
  }
} 