import { ogLogger } from './logger';

export function generateOgUrl({
  title = "Zachary Proser's portfolio",
  description = "Full-stack open-source hacker and technical writer",
  image = {},
  slug = null // Type should be string | null | undefined
} = {}) {
  // Create a bare URL with properly encoded components
  const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`;
  
  // Reduced logging - only log essential parameters at debug level
  ogLogger.debug('Generating OG URL', { title: title?.substring(0, 30), slug });
  
  // Always start with a new URLSearchParams object for clean encoding
  const params = new URLSearchParams();
  
  // PRIORITY 1: Add slug parameter (most important for static image lookup)
  if (slug && typeof slug === 'string') {
    // If slug contains slashes, just get the last part
    const slugParts = slug.split('/');
    const lastSlugPart = slugParts[slugParts.length - 1];
    params.set('slug', lastSlugPart);
  }
  
  // IMPROVED IMAGE EXTRACTION LOGIC
  let imageSrc = null;
  
  if (image) {
    // Case 1: Direct src property (most common for Next.js imported images)
    if (typeof image === 'object' && image !== null && 'src' in image) {
      imageSrc = image.src;
    } 
    // Case 2: String path
    else if (typeof image === 'string') {
      imageSrc = image;
    }
    // Case 3: Default export with src (common pattern from imports)
    else if (typeof image === 'object' && image !== null && 'default' in image) {
      if (typeof image.default === 'object' && image.default !== null && 'src' in image.default) {
        imageSrc = image.default.src;
      } else if (typeof image.default === 'string') {
        imageSrc = image.default;
      }
    }
    
    // Deep search for src if not found by simpler methods
    if (!imageSrc && typeof image === 'object' && image !== null) {
      // Recursively search for src property
      const findSrc = (obj, depth = 0) => {
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
    }
    
    // Clean up image path if found
    if (imageSrc) {
      // Remove any URL parameters
      if (imageSrc.includes('?')) {
        imageSrc = imageSrc.split('?')[0];
      }
      
      // Set the image parameter
      params.set('image', imageSrc);
      
      // Also set imageSrc as an alternative parameter for the generator to catch
      params.set('imageSrc', imageSrc);
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
      }
    }
  }
  
  // Add description and properly encode it to prevent truncation at apostrophes
  if (description) {
    // Ensure description is properly encoded
    params.set('description', encodeURIComponent(String(description)));
  }
  
  // Generate the URL with properly encoded parameters
  const url = `${baseUrl}?${params.toString()}`;
  
  // Only log the final URL at debug level
  ogLogger.debug('OG URL generated');
  
  return url;
}
