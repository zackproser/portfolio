import { ogLogger } from './logger';

export function generateOgUrl({
  title = "Zachary Proser's portfolio",
  description = "Full-stack open-source hacker and technical writer",
  image = {},
  slug = null
} = {}) {
  // Create a bare URL with properly encoded components
  const baseUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`;
  
  // Always start with a new URLSearchParams object for clean encoding
  const params = new URLSearchParams();
  
  // PRIORITY 1: Add slug parameter (most important for static image lookup)
  if (slug) {
    // If slug contains slashes, just get the last part
    const slugParts = slug.split('/');
    const lastSlugPart = slugParts[slugParts.length - 1];
    params.set('slug', lastSlugPart);
    ogLogger.debug('Using provided slug:', lastSlugPart);
  }
  
  // Add title and description
  if (title) {
    params.set('title', String(title));
    
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
  
  if (description) {
    params.set('description', String(description));
  }
  
  // Extract image info - with extra debugging
  if (image) {
    ogLogger.debug('Processing image:', typeof image, 
      typeof image === 'object' ? Object.keys(image).join(',') : '');
      
    // For Next.js imported images with src property
    if (typeof image === 'object' && image !== null && 'src' in image) {
      ogLogger.debug('Using image src:', image.src);
      params.set('image', image.src);
    } 
    // For string references
    else if (typeof image === 'string') {
      ogLogger.debug('Using image string:', image);
      params.set('image', image);
    }
    // Special case - for imported images with default property
    else if (typeof image === 'object' && image !== null && 'default' in image && 
             typeof image.default === 'object' && image.default !== null && 'src' in image.default) {
      ogLogger.debug('Using image.default.src:', image.default.src);
      params.set('image', image.default.src);
    }
  }
  
  // Generate the URL with properly encoded parameters
  const url = `${baseUrl}?${params.toString()}`;
  ogLogger.debug('Generated URL:', url);
  
  return url;
}
