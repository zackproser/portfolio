import { ExtendedMetadata } from '@/lib/shared-types'
import { generateOgUrl } from '@/utils/ogUrl'
import { Content } from '@/lib/content/base'

type MetadataParams = Partial<ExtendedMetadata> & {
  /**
   * Optional file path that can be used to automatically generate the slug
   * This is typically __filename in MDX files
   */
  filePath?: string;
}

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
    filePath,
  } = params;

  // Generate a slug based on priority:
  // 1. Explicitly provided slug
  // 2. Generated from file path using Content.getSlugFromPath
  const pathBasedSlug = filePath ? Content.getSlugFromPath(filePath) : '';
  const finalSlug = slug || pathBasedSlug || '';

  // Determine content type from file path if not explicitly provided
  const contentType = type || (filePath ? Content.getTypeFromPath(filePath) : 'blog');

  // Handle webpack-imported images and ensure we preserve the object structure
  const processedImage = typeof image === 'string' ? { src: image } : image;

  // Generate URL using Content.getUrlForContent
  const contentUrl = finalSlug ? Content.getUrlForContent(contentType, finalSlug) : undefined;

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
    type: contentType,
    slug: finalSlug,
    // Add the URL field using Content.getUrlForContent
    url: contentUrl,
    ...(commerce && { commerce }),
    ...(landing && { landing })
  } satisfies ExtendedMetadata;

  return metadata;
}