import { generateOgUrl } from '@/utils/ogUrl'

export function createMetadata({ author, date, title, description, image }) {
  const baseMeta = {
    author: author ?? 'Zachary Proser',
    date: date ?? new Date(),
    title: title ?? 'Zack Proser portfolio',
    description: description ?? 'Full-stack open-source hacker and technical writer',
    image: image ?? '',
  };
  return {
    ...baseMeta,
    metadataBase: new URL('https://zackproser.com'),
    category: 'technology',
    generator: 'Next.js',
    referrer: 'origin-when-cross-origin',
    keywords: ['AI engineer', 'Generative AI', 'AI consultant', 'Staff AI developer'],
    authors: [{ name: 'Zachary Proser' }],
    creator: 'Zachary Proser',
    publisher: 'Zachary Proser',
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      siteName: 'Zack Proser portfolio',
      images: [
        {
          url: generateOgUrl({ title, description, image }),
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      creator: '@zackproser',
      images: [generateOgUrl({ title, description, image })],
    }
  };
}
