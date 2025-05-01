import type { Content } from '@/types/content';

/**
 * Returns the canonical relative URL path for a given Content object.
 * Throws if required fields are missing. Never prefixes with baseUrl.
 * @param content The Content object
 * @returns The canonical relative URL path for the content
 */
export function getContentUrlFromObject(content: Content, keepLeadingSlash = true): string {
  if (!content) throw new Error('No content object provided');
  const { type, directorySlug } = content as any;
  if (!type) throw new Error('Content object missing type');
  if (!directorySlug) throw new Error('Content object missing directorySlug');
  // Remove any leading slashes from the slug
  const cleanSlug = directorySlug.replace(/^\/+/,'');
  let url = '';
  if (type === 'article' || type === 'blog') {
    url = `/blog/${cleanSlug}`;
  } else if (type === 'course') {
    url = `/learn/courses/${cleanSlug}/0`;
  } else {
    url = `/${type}/${cleanSlug}`;
  }
  return (keepLeadingSlash || !url.startsWith('/')) ? url : url.substring(1);
} 