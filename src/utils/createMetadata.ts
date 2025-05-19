import { ExtendedMetadata, OgUrlParams } from '@/types'
import { generateOgUrl } from '@/utils/ogUrl'
import path from 'path'
import { Metadata } from 'next'
import { logger } from './logger'
import { getContentUrlFromObject } from '@/lib/content-url'

// Create a specialized logger for metadata operations
const metaLogger = logger.forCategory('metadata');

// Remove the workaround since we now have proper typing
// const createOgUrl = generateOgUrl;

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
  try {
    // Get the directory name containing the MDX file
    const dirname = path.dirname(filePath);
    
    // Normalize for Windows compatibility
    const normalizedPath = dirname.replace(/\\/g, '/'); 
    
    // Use regular expressions to extract the slug from various path patterns
    const patterns = [
      /\/blog\/([^\/]+)/i,              // /blog/slug/
      /\/content\/blog\/([^\/]+)/i,     // /content/blog/slug/
      /\/videos\/([^\/]+)/i,            // /videos/slug/
      /\/courses\/([^\/]+)/i,           // /courses/slug/
      /\/demos\/([^\/]+)/i              // /demos/slug/
    ];
    
    // Try each pattern
    for (const pattern of patterns) {
      const match = normalizedPath.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    
    // If no pattern matches, use the directory name
    const parts = dirname.split(path.sep);
    
    // Skip "page" directories as they're not actual slugs in Next.js
    if (parts.length > 0 && parts[parts.length - 1] === 'page' && parts.length >= 2) {
      return parts[parts.length - 2];
    }
    
    // Last resort: use the last directory name
    return parts.length > 0 ? parts[parts.length - 1] : '';
  } catch (error) {
    metaLogger.error('Error extracting slug from path:', error);
    return '';
  }
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
    filePath: explicitFilePath, 
    type: providedType,
    slug: providedSlug,
    date,
    keywords,
    tags,
    commerce,
    landing,
    ...rest
  } = params

  // Automatically determine the calling file if not explicitly provided
  let derivedFilePath = '';
  
  if (!explicitFilePath) {
    try {
      // This creates a stack trace that includes the file that called this function
      const stackTraceError = new Error();
      const stackLines = stackTraceError.stack?.split('\n') || [];
      
      // Find the first line that's not inside this file (createMetadata.ts)
      const callerLine = stackLines.find(line => 
        line.includes('.mdx') || 
        (line.includes('/page.') && !line.includes('createMetadata.ts'))
      );
      
      if (callerLine) {
        // Extract the file path from the stack trace line
        // Format is typically like "at Object.<anonymous> (/path/to/file.js:line:column)"
        const match = callerLine.match(/\(([^:]+)(:\d+:\d+)?\)/);
        if (match && match[1]) {
          derivedFilePath = match[1];
          metaLogger.debug('Auto-detected caller file path:', derivedFilePath);
        }
      }
    } catch (e) {
      metaLogger.warn('Failed to auto-detect caller file path:', e);
    }
  }
  
  // Use the automatically determined path if available, otherwise use the explicit path
  const filePath = explicitFilePath || derivedFilePath;

  // Generate a slug based on priority:
  // 1. Explicitly provided slug
  // 2. Generated from file path
  const pathBasedSlug = filePath ? getSlugFromPath(filePath) : '';
  const finalSlug = providedSlug || pathBasedSlug || 'untitled';
  
  // Minimal logging with essential info only
  metaLogger.debug('Creating metadata', { title, slug: finalSlug });

  // Determine content type from file path if not explicitly provided
  const contentType = providedType || (filePath ? getTypeFromPath(filePath) : 'blog');

  // Process the image to ensure it's correctly passed to the OG function
  // This ensures we're passing the direct image object, not just its path
  let processedImage = image;
  
  if (image) {
    // For objects with src property (Next.js images), use them directly
    if (typeof image === 'object' && 'src' in image) {
      processedImage = image;
    }
    // For string paths, use them directly
    else if (typeof image === 'string') {
      processedImage = image;
    }
  }
  
  // If the image is from a content directory (blog post), store the full path
  if (processedImage && typeof processedImage === 'object' && 'src' in processedImage && typeof processedImage.src === 'string') {
    // Check if the image is a relative path in the content directory
    const srcPath = processedImage.src;
    
    if (filePath && srcPath.includes('/') && !srcPath.startsWith('http')) {
      // Determine if this is a blog post image (if located in the same directory as the MDX file)
      const mdxDir = path.dirname(filePath);
      
      // If using relative import, the path will be resolved relative to the MDX file
      if (!srcPath.startsWith('/')) {
        // Only set fullPath if processedImage allows it (matches our interface)
        if (typeof processedImage === 'object' && 'src' in processedImage) {
          (processedImage as { src: string; fullPath?: string }).fullPath = path.join(mdxDir, srcPath);
        }
      }
    }
  } else if (typeof image === 'object' && image !== null && 'default' in (image as any)) {
    // Handle Next.js imported image objects
    const imageModule = (image as any).default || image;
    if (typeof imageModule === 'object' && imageModule !== null && 'src' in imageModule) {
      if (processedImage && typeof processedImage === 'object') {
        (processedImage as any).src = imageModule.src as string;
      }
    }
  }

  // Generate a URL using the type and slug
  let contentUrl: string | undefined = undefined;
  if (contentType && finalSlug) {
    contentUrl = getContentUrlFromObject({ type: contentType, directorySlug: finalSlug } as any);
  }

  // Pass the finalSlug to the OG URL generator instead of null
  const ogImageUrl = generateOgUrl({ 
    title, 
    description, 
    image: processedImage,
    slug: finalSlug // Use the finalSlug instead of null
  });

  // Add type assertion to ensure we're returning a complete ExtendedMetadata
  const metadata: ExtendedMetadata = {
    ...defaultMetadata,
    // Required fields with default values
    title: title || 'Untitled',
    description: description !== undefined && description !== null ? String(description).trim() : '',
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
      description: description !== undefined && description !== null ? String(description).trim() : '',
      images: [
        {
          url: ogImageUrl,
          alt: title || 'Untitled',
        },
      ],
    },
    twitter: {
      ...(defaultMetadata.twitter || {}),
      title: title || 'Untitled',
      description: description !== undefined && description !== null ? String(description).trim() : '',
      images: [ogImageUrl],
    },
    
    // Additional optional fields
    ...(commerce && { commerce }),
    ...(landing && { landing })
  };

  // Log the created metadata for debugging
  if (shouldLog) {
    metaLogger.debug('Created metadata', { 
      title: metadata.title,
      description: metadata.description?.substring(0, 50) + (metadata.description && metadata.description.length > 50 ? '...' : ''),
      type: metadata.type,
      slug: metadata.slug
    });
  }

  return metadata;
}