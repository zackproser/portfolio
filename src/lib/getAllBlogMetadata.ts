import { ExtendedMetadata } from '@/lib/shared-types'
import { getAllContent } from './content-handlers'

/**
 * Gets metadata from all blog posts
 * @returns Array of blog post metadata
 */
export async function getAllBlogMetadata(): Promise<ExtendedMetadata[]> {
  // Use the standardized getAllContent function with 'blog' as the content type
  return getAllContent('blog') as Promise<ExtendedMetadata[]>;
} 