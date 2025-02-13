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
  }
}

interface MetadataParams {
  author?: string
  date?: string
  title?: string
  description?: string
  image?: string | StaticImageData
  // Commerce params
  isPaid?: boolean
  price?: number
  previewLength?: number
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
  isPaid = false,
  price,
  previewLength
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
    type: 'blog',
    ...(isPaid && {
      commerce: {
        isPaid,
        price: price || 0,
        previewLength
      }
    })
  };

  return metadata;
}