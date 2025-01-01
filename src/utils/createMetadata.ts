import { generateOgUrl } from '@/utils/ogUrl'
import { Metadata } from 'next'
import { StaticImageData } from 'next/image'
import { Article } from '@/lib/shared-types'

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
}: MetadataParams): Metadata & { isPaid: boolean; price?: number; previewLength?: number } {
  // Handle webpack-imported images
  const imageUrl = typeof image === 'string' ? image : image?.src;

  const seoMetadata: Metadata = {
    ...defaultMetadata,
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
  };

  // Add commerce fields
  return {
    ...seoMetadata,
    isPaid,
    ...(price && { price }),
    ...(previewLength && { previewLength }),
  };
}