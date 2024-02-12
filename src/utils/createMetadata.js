import { generateOgUrl } from '@/utils/ogUrl'

export function createMetadata({ author, date, title, description, image }) {
  const baseMeta = { author, date, title, description, image };
  return {
    ...baseMeta,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      siteName: "Zack Proser portfolio",
      images: [
        {
          url: generateOgUrl({ title, description, image }),
        },
      ],
    },
  };
}

