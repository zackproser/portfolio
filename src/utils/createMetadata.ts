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

// Default metadata
const defaultMetadata: Metadata = {
  title: {
    template: '%s - Zachary Proser',
    default: 'Zachary Proser - Full-stack AI engineer'
  },
  description: 'I build and advise on generative AI applications and pipelines',
  openGraph: {
    title: 'Zachary Proser - Full-stack AI engineer',
    description: 'I build and advise on generative AI applications and pipelines',
    url: 'https://zackproser.com',
    siteName: 'Zachary Proser',
    images: [
      {
        url: 'https://zackproser.com/api/og',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
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