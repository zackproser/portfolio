import { ExtendedMetadata } from '@/lib/shared-types'
import { generateOgUrl } from '@/utils/ogUrl'

type MetadataParams = Partial<ExtendedMetadata>

const defaultMetadata: Partial<ExtendedMetadata> = {
  openGraph: {
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
}

/**
 * Creates a fully typed ExtendedMetadata object with all required fields
 * @param params Partial metadata parameters
 * @returns Complete ExtendedMetadata object
 */
export function createMetadata(params: MetadataParams): ExtendedMetadata {
  const { 
    author, 
    date, 
    title, 
    description, 
    image,
    type = 'blog',
    commerce,
    landing,
    slug,
  } = params;

  // Handle webpack-imported images and ensure we preserve the object structure
  const processedImage = typeof image === 'string' ? { src: image } : image;

  // Add type assertion to ensure we're returning a complete ExtendedMetadata
  const metadata = {
    ...defaultMetadata,
    // Next.js metadata fields
    ...(title && { title }),
    ...(description && { description }),
    ...(author && { authors: [{ name: author }], creator: author, publisher: author }),
    ...(date && { date: String(date) }),
    ...(processedImage && { image: processedImage }),
    openGraph: {
      ...defaultMetadata.openGraph,
      ...(title && { title }),
      ...(description && { description }),
      images: [
        {
          url: generateOgUrl({ 
            title: title ? String(title) : undefined, 
            description: description ? String(description) : undefined, 
            image: processedImage?.src ? String(processedImage.src) : undefined 
          }),
        },
      ],
    },
    twitter: {
      ...(title && { title }),
      ...(description && { description }),
      images: [generateOgUrl({ 
        title: title ? String(title) : undefined, 
        description: description ? String(description) : undefined, 
        image: processedImage?.src ? String(processedImage.src) : undefined 
      })],
    },
    // Our blog-specific fields
    author: author || 'Unknown',
    date: date ? String(date) : new Date().toISOString(),
    description: description || '',
    image: processedImage,
    type: type || 'blog',
    slug: slug || '',
    ...(commerce && { commerce }),
    ...(landing && { landing })
  } satisfies ExtendedMetadata;

  return metadata;
}