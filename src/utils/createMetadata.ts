import { ExtendedMetadata } from '@/types'
import { generateOgUrl } from '@/utils/ogUrl'
import path from 'path'
import { Metadata } from 'next'
import { logger } from './logger'

// Create a specialized logger for metadata operations
const metaLogger = logger.forCategory('metadata');

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

// Only log in development or when explicitly enabled
const shouldLog = process.env.NODE_ENV === 'development' || process.env.DEBUG_OG === 'true';

// Helper function to conditionally log
const log = (message: string, ...args: any[]) => {
  if (shouldLog) {
    console.log(message, ...args);
  }
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
    title, 
    description, 
    author,
    image,
    filePath, 
    type: providedType,
    slug: providedSlug,
    date,
    keywords,
    tags,
    commerce,
    landing,
    ...rest
  } = params

  // Generate a slug based on priority:
  // 1. Explicitly provided slug
  // 2. Generated from file path
  const pathBasedSlug = filePath ? getSlugFromPath(filePath) : '';
  const finalSlug = providedSlug || pathBasedSlug || 'untitled';

  // Determine content type from file path if not explicitly provided
  const contentType = providedType || (filePath ? getTypeFromPath(filePath) : 'blog');

  // Process the image to ensure it's correctly passed to the OG function
  // This ensures we're passing the direct image object, not just its path
  let processedImage = image;
  
  // Debug log to help diagnose image issues
  metaLogger.debug('Image type:', image ? typeof image : 'none', 
      image && typeof image === 'object' ? 'keys: ' + Object.keys(image).join(', ') : '');
  
  if (image) {
    // For objects with src property (Next.js images), use them directly
    if (typeof image === 'object' && 'src' in image) {
      metaLogger.debug('Using image src:', image.src);
      processedImage = image;
    }
    // For string paths, use them directly
    else if (typeof image === 'string') {
      metaLogger.debug('Using image string:', image);
      processedImage = image;
    }
  }
  
  // If the image is from a content directory (blog post), store the full path
  if (processedImage && typeof processedImage === 'object' && 'src' in processedImage && typeof processedImage.src === 'string') {
    // Check if the image is a relative path in the content directory
    const srcPath = processedImage.src;
    metaLogger.debug('Processing image src path:', srcPath);
    
    if (filePath && srcPath.includes('/') && !srcPath.startsWith('http')) {
      // Determine if this is a blog post image (if located in the same directory as the MDX file)
      const mdxDir = path.dirname(filePath);
      
      metaLogger.debug('MDX directory for image resolution:', mdxDir);
      metaLogger.debug('Source image path:', srcPath);
      
      // If using relative import, the path will be resolved relative to the MDX file
      if (!srcPath.startsWith('/')) {
        // Only set fullPath if processedImage allows it (matches our interface)
        if (typeof processedImage === 'object' && 'src' in processedImage) {
          (processedImage as { src: string; fullPath?: string }).fullPath = path.join(mdxDir, srcPath);
          metaLogger.debug('Resolved full image path:', 
            (processedImage as { src: string; fullPath?: string }).fullPath);
        }
      }
    }
  } else if (typeof image === 'object' && image !== null && 'default' in (image as any)) {
    // Handle Next.js imported image objects
    const imageModule = (image as any).default || image;
    if (typeof imageModule === 'object' && imageModule !== null && 'src' in imageModule) {
      if (processedImage && typeof processedImage === 'object') {
        (processedImage as any).src = imageModule.src as string;
        metaLogger.debug('Extracted image src from module:', (processedImage as any).src);
      }
    }
  }
  
  // Check if we have a processed image with src before generating OG URL
  if (processedImage && typeof processedImage === 'object' && 'src' in processedImage) {
    metaLogger.debug('Final image src for OG URL:', processedImage.src);
  } else {
    metaLogger.warn('No valid image src found for OG URL generation');
  }

  // Generate URL using the type and slug
  const contentUrl = finalSlug ? getUrlForContent(contentType, finalSlug) : undefined;
  metaLogger.debug('Metadata processing complete');

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
    
    // Next.js metadata fields
    ...(author && { authors: [{ name: author }], creator: author, publisher: author }),
    
    openGraph: {
      ...defaultMetadata.openGraph,
      title: title || 'Untitled',
      description: description || '',
      images: [
        {
          url: generateOgUrl({ 
            title, 
            description, 
            image: processedImage,
            slug: finalSlug as unknown as null | undefined 
          }),
          alt: title || 'Untitled',
        },
      ],
    },
    twitter: {
      ...(defaultMetadata.twitter || {}),
      title: title || 'Untitled',
      description: description || '',
      images: [generateOgUrl({ 
        title, 
        description, 
        image: processedImage,
        slug: finalSlug as unknown as null | undefined 
      })],
    },
    
    // Additional optional fields
    ...(commerce && { commerce }),
    ...(landing && { landing })
  };

  return metadata;
}