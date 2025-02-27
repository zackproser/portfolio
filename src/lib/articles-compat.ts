// This file is maintained for backward compatibility
// All functionality has been moved to content-handlers.ts

import { 
  importContent, 
  importContentMetadata, 
  getContentBySlug, 
  getAllContent 
} from './content-handlers';

// Re-export with the old names for backward compatibility but maintain the original parameter signatures

/**
 * Import an article from an MDX file (compatibility function)
 * @param filename The filename including page.mdx
 * @param baseDir The base directory (default: 'blog')
 * @returns Blog object
 */
export async function importArticle(filename: string, baseDir: string = 'blog') {
  // Extract the slug from the filename (remove /page.mdx)
  const slug = filename.replace('/page.mdx', '');
  return importContent(slug, baseDir);
}

/**
 * Import just the metadata from an article (compatibility function)
 * @param filename The filename including page.mdx
 * @param baseDir The base directory (default: 'blog')
 * @returns Blog object
 */
export async function importArticleMetadata(filename: string, baseDir: string = 'blog') {
  // Extract the slug from the filename (remove /page.mdx)
  const slug = filename.replace('/page.mdx', '');
  return importContentMetadata(slug, baseDir);
}

/**
 * Get a single article by slug (compatibility function)
 * @param slug The article slug
 * @returns ArticleWithSlug object or null
 */
export const getArticleBySlug = getContentBySlug;

/**
 * Get all articles (compatibility function)
 * @returns Array of ArticleWithSlug objects
 */
export const getAllArticles = () => getAllContent('blog'); 