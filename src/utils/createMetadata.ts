import { generateOgUrl } from '@/utils/ogUrl'
import { Metadata } from 'next'
import { StaticImageData } from 'next/image'

interface MetadataParams {
  author?: string
  date?: string
  title?: string
  description?: string
  image?: string | StaticImageData
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
    // ... rest of the openGraph config ...
  },
  // ... rest of the defaultMetadata ...
}

type ExtendedMetadata = Metadata & {
  image?: string | StaticImageData
}

export function createMetadata({ author, date, title, description, image }: MetadataParams): ExtendedMetadata {
  const pageMetadata: Partial<ExtendedMetadata> = {
    ...(image && { image }),
    ...(author && { authors: [{ name: author }], creator: author, publisher: author }),
    ...(date && { date: String(date) }),
    ...(title && { title }),
    ...(description && { description }),
    openGraph: {
      ...(title && { title }),
      ...(description && { description }),
      images: [
        {
          url: generateOgUrl({ title, description, image }),
        },
      ],
    },
    twitter: {
      ...(title && { title }),
      ...(description && { description }),
      images: [generateOgUrl({ title, description, image })],
    },
  };

  return {
    ...defaultMetadata,
    ...pageMetadata,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...pageMetadata.openGraph,
    },
    twitter: {
      ...defaultMetadata.twitter,
      ...pageMetadata.twitter,
    },
  };
}