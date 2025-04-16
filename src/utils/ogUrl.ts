import { ogLogger } from './logger';
import { OgUrlParams } from '@/types/metadata';

/**
 * Generates an OpenGraph URL for social media sharing
 * This version has an empty string as default for slug to match createMetadata usage
 */
export function generateOgUrl({
  title = "Zachary Proser's portfolio",
  description = "Full-stack open-source hacker and technical writer",
  image = {},
  slug = ""  // Empty string default to match how it's used in createMetadata
}: {
  title?: string;
  description?: string;
  image?: any;
  slug?: string | null | undefined;  // Updated to allow null or undefined
} = {}): string {
  // Create a bare URL with properly encoded components
  const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`;
  
  // IMPORTANT: Log all incoming parameters to diagnose issues
  ogLogger.debug('--------------- GENERATING OG URL ---------------');
  ogLogger.debug('Title:', title);
  ogLogger.debug('Description:', description?.substring(0, 50) + (description?.length > 50 ? '...' : ''));
  ogLogger.debug('Image type:', typeof image);
  ogLogger.debug('Image keys:', image && typeof image === 'object' ? Object.keys(image).join(',') : 'N/A');
  
  // More detailed image logging
  if (image) {
    if (typeof image === 'object' && 'src' in image) {
      ogLogger.debug('Image src:', image.src);
    }
    if (typeof image === 'object' && 'default' in image) {
      ogLogger.debug('Image has default property:', typeof image.default);
      if (typeof image.default === 'object' && image.default && 'src' in image.default) {
        ogLogger.debug('Image default.src:', image.default.src);
      }
    }
  }
  
  ogLogger.debug('Slug:', slug);
  
  // Always start with a new URLSearchParams object for clean encoding
  const params = new URLSearchParams();
  
  // PRIORITY 1: Add slug parameter (most important for static image lookup)
  if (slug && typeof slug === 'string') {
    // If slug contains slashes, just get the last part
    const slugParts = slug.split('/');
    const lastSlugPart = slugParts[slugParts.length - 1];
    params.set('slug', lastSlugPart);
    ogLogger.debug('Using provided slug:', lastSlugPart);
  }
  
  // IMPROVED IMAGE EXTRACTION LOGIC
  let imageSrc: string | null = null;
  
  if (image) {
    ogLogger.debug('Processing image for OG URL:');
    
    // Case 1: Direct src property (most common for Next.js imported images)
    if (typeof image === 'object' && image !== null && 'src' in image) {
      imageSrc = image.src;
      ogLogger.debug('Found direct src property:', imageSrc);
    } 
    // Case 2: String path
    else if (typeof image === 'string') {
      imageSrc = image;
      ogLogger.debug('Using string image path:', imageSrc);
    }
    // Case 3: Default export with src (common pattern from imports)
    else if (typeof image === 'object' && image !== null && 'default' in image) {
      if (typeof image.default === 'object' && image.default !== null && 'src' in image.default) {
        imageSrc = image.default.src;
        ogLogger.debug('Found src in default export:', imageSrc);
      } else if (typeof image.default === 'string') {
        imageSrc = image.default;
        ogLogger.debug('Found string in default export:', imageSrc);
      }
    }
    
    // Deep search for src if not found by simpler methods
    if (!imageSrc && typeof image === 'object' && image !== null) {
      ogLogger.debug('Performing deep search for image src');
      
      // Recursively search for src property
      const findSrc = (obj: any, depth = 0): string | null => {
        if (depth > 2) return null;
        if (!obj || typeof obj !== 'object') return null;
        
        // Direct src property
        if ('src' in obj && typeof obj.src === 'string') {
          return obj.src;
        }
        
        // Look through all keys
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null) {
            const nestedSrc = findSrc(obj[key], depth + 1);
            if (nestedSrc) return nestedSrc;
          }
        }
        return null;
      };
      
      imageSrc = findSrc(image);
      if (imageSrc) {
        ogLogger.debug('Found src through deep search:', imageSrc);
      }
    }
    
    // Clean up image path if found
    if (imageSrc) {
      // Remove any URL parameters
      if (imageSrc.includes('?')) {
        imageSrc = imageSrc.split('?')[0];
        ogLogger.debug('Removed URL parameters from image path:', imageSrc);
      }
      
      // Set the image parameter
      params.set('image', imageSrc);
      
      // Also set imageSrc as an alternative parameter for the generator to catch
      params.set('imageSrc', imageSrc);
      
      ogLogger.debug('Final image path for OG URL:', imageSrc);
    } else {
      ogLogger.warn('Could not extract image source from provided image object or string');
    }
  }
  
  // Add title and properly encode it
  if (title) {
    // Ensure title is properly encoded
    params.set('title', encodeURIComponent(String(title)));
    
    // Only create slug from title if no slug was provided
    if (!slug) {
      // Create a slug from the title for OG image lookup
      const titleSlug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
      
      // If this is a reasonable slug (not just a few characters), use it
      if (titleSlug.length > 3) {
        params.set('slug', titleSlug);
        ogLogger.debug('Added slug from title:', titleSlug);
      }
    }
  }
  
  // Add description and properly encode it to prevent truncation at apostrophes
  if (description) {
    // Ensure description is properly encoded
    ogLogger.debug('Encoding description for URL');
    params.set('description', encodeURIComponent(String(description)));
  }
  
  // Generate the URL with properly encoded parameters
  const url = `${baseUrl}?${params.toString()}`;
  
  // Log the final URL for debugging
  ogLogger.debug('--------------- FINAL OG URL ---------------');
  ogLogger.debug('URL:', url);
  ogLogger.debug('URL parameters:');
  for (const [key, value] of params.entries()) {
    ogLogger.debug(`- ${key}: ${value}`);
  }
  ogLogger.debug('-------------------------------------------');
  
  return url;
} 