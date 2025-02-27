import { ExtendedMetadata } from '@/lib/shared-types'
import { generateOgUrl } from '@/utils/ogUrl'
import path from 'path'

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

// Type mapping for consistent path/URL generation
const TYPE_PATHS: Record<string, string> = {
  'blog': 'blog',
  'course': 'learn/courses',
  'video': 'videos',
  'demo': 'demos',
  'newsletter': 'newsletter',
  'comparison': 'comparisons',
  'tool': 'tools'
};

/**
 * Get the slug from a file path
 * @param filePath The file path
 * @returns The slug extracted from the path
 */
function getSlugFromPath(filePath: string): string {
  // Get the directory name containing the MDX file
  const dirname = path.dirname(filePath);
  // Get the last part of the path (the directory name)
  const parts = dirname.split(path.sep);
  return parts[parts.length - 1];
}

/**
 * Get the content type from a file path
 * @param filePath The file path
 * @returns The content type extracted from the path
 */
function getTypeFromPath(filePath: string): 'blog' | 'course' | 'video' | 'demo' {
  const parts = filePath.split(path.sep);
  
  // Look for known content type directories in the path
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part === 'blog') return 'blog';
    if (part === 'videos') return 'video';
    if (part === 'demos') return 'demo';
    if (part === 'courses' || part === 'learn') return 'course';
  }
  
  // Default to blog if no match
  return 'blog';
}

/**
 * Generate a URL for any content type and slug
 * @param type Content type
 * @param slug Content slug
 * @returns Full URL path
 */
function getUrlForContent(type: string, slug: string): string {
  const baseDir = TYPE_PATHS[type];

  if (!baseDir) {
    return `/${type}/${slug}`;
  }
  
  return `/${baseDir}/${slug}`;
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
  // 2. Generated from file path
  const pathBasedSlug = filePath ? getSlugFromPath(filePath) : '';
  const finalSlug = slug || pathBasedSlug || 'untitled';

  // Determine content type from file path if not explicitly provided
  const contentType = type || (filePath ? getTypeFromPath(filePath) : 'blog');

  // Handle webpack-imported images and ensure we preserve the object structure
  const processedImage = typeof image === 'string' ? { src: image } : image;

  // Generate URL using the type and slug
  const contentUrl = finalSlug ? getUrlForContent(contentType, finalSlug) : undefined;

  // Add type assertion to ensure we're returning a complete ExtendedMetadata
  const metadata: ExtendedMetadata = {
    ...defaultMetadata,
    // Required fields with default values
    title: title || 'Untitled',
    description: description || '',
    author: author || 'Unknown',
    date: date ? String(date) : new Date().toISOString(),
    type: contentType,
    slug: finalSlug,
    
    // Optional fields
    ...(processedImage && { image: processedImage }),
    ...(contentUrl && { url: contentUrl }),
    
    // Next.js metadata fields
    ...(author && { authors: [{ name: author }], creator: author, publisher: author }),
    
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title || 'Untitled',
      description: description || '',
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
      ...(defaultMetadata.twitter || {}),
      title: title || 'Untitled',
      description: description || '',
      images: [generateOgUrl({ 
        title: title ? String(title) : undefined, 
        description: description ? String(description) : undefined, 
        image: processedImage?.src ? String(processedImage.src) : undefined 
      })],
    },
    
    // Additional optional fields
    ...(commerce && { commerce }),
    ...(landing && { landing })
  };

  return metadata;
}