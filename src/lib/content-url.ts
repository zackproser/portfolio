/**
 * Get the content URL based on content type and slug
 * @param contentType The content type (e.g., 'article', 'blog', 'course')
 * @param slug The content slug
 * @param keepLeadingSlash Whether to keep the leading slash (default: true)
 * @returns The URL path for the content
 */
export function getContentUrl(contentType: string, slug: string, keepLeadingSlash = true) {
  // Remove any leading slashes from the slug
  const cleanSlug = slug.replace(/^\/+/, '');
  
  // Generate the URL path based on content type
  let url = '';
  
  if (contentType === 'article' || contentType === 'blog') {
    url = `/blog/${cleanSlug}`;
  } else if (contentType === 'course') {
    url = `/learn/courses/${cleanSlug}/0`;
  } else {
    // Fallback to a generic path
    url = `/${contentType}/${cleanSlug}`;
  }
  
  // Remove leading slash if needed
  return (keepLeadingSlash || !url.startsWith('/')) ? url : url.substring(1);
} 