import { generateOgUrl } from '@/utils/ogUrl'
import { Metadata } from 'next'
import { StaticImageData } from 'next/image'

// Extend Next.js Metadata type with our blog fields
interface ExtendedMetadata extends Metadata {
  // Blog specific fields
  author?: string
  date?: string
  description?: string
  image?: string | StaticImageData
  type?: 'blog' | 'course' | 'video'
  commerce?: {
    isPaid: boolean
    price: number
    previewLength?: number
    paywallHeader?: string
    paywallBody?: string
    buttonText?: string
    paywallImage?: string | StaticImageData
    paywallImageAlt?: string
    miniPaywallTitle?: string
    miniPaywallDescription?: string
  }
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
        role?: string
      }
    }>
  }
}

interface MetadataParams {
  author?: string
  date?: string
  title?: string
  description?: string
  image?: string | StaticImageData
  type?: 'blog' | 'course' | 'video'
  commerce?: {
    isPaid: boolean
    price: number
    previewLength?: number
    paywallHeader?: string
    paywallBody?: string
    buttonText?: string
    paywallImage?: string | StaticImageData
    paywallImageAlt?: string
    miniPaywallTitle?: string
    miniPaywallDescription?: string
  }
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
        role?: string
      }
    }>
  }
}

// Update default metadata
const defaultMetadata: Metadata = {
  title: {
    template: '%s - Modern Coding',
    default: 'Modern Coding'
  },
  description: 'Empowering developers with machine learning insights and tools',
  openGraph: {
    title: 'Modern Coding',
    description: 'Empowering developers with machine learning insights and tools',
    url: 'https://zackproser.com',
    siteName: 'Modern Coding',
  },
}

export function createMetadata({ 
  author, 
  date, 
  title, 
  description, 
  image,
  type = 'blog',
  commerce,
  landing,
}: MetadataParams): ExtendedMetadata {
  // Handle webpack-imported images
  const imageUrl = typeof image === 'string' ? image : image?.src;

  const metadata: ExtendedMetadata = {
    ...defaultMetadata,
    // Next.js metadata fields
    ...(title && { title }),
    ...(description && { description }),
    ...(author && { authors: [{ name: author }], creator: author, publisher: author }),
    ...(date && { date: String(date) }),
    ...(imageUrl && { image: imageUrl }),
    openGraph: {
      ...defaultMetadata.openGraph,
      ...(title && { title }),
      ...(description && { description }),
      images: [
        {
          url: generateOgUrl({ title, description, image: imageUrl }),
        },
      ],
    },
    twitter: {
      ...(title && { title }),
      ...(description && { description }),
      images: [generateOgUrl({ title, description, image: imageUrl })],
    },
    // Our blog-specific fields
    author: author || 'Unknown',
    date: date || new Date().toISOString(),
    description: description || '',
    image: image,
    type,
    ...(commerce && { commerce }),
    ...(landing && { landing })
  };

  return metadata;
}