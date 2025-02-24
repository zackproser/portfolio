import { Content, Blog, Demo, isPurchasable, getDefaultLanding, ExtendedMetadata } from './shared-types';
import glob from 'fast-glob';
import { Content as BaseContent } from './content/base';
import { Article } from './content/types/blog';
import { hasRegisteredContent } from '@/test/mocks/mdx';
import { createMetadata } from '@/utils/createMetadata';

// Get the content directory for a given type
export function getContentDir(type: BaseContent['type']): string {
  switch (type) {
    case 'blog':
      return 'blog';
    case 'course':
      return 'learn/courses';
    case 'video':
      return 'videos';
    case 'demo':
      return 'demos';
    default:
      throw new Error(`Unknown content type: ${type}`);
  }
}

// Get the content type from a path
export function getContentType(contentPath: string): BaseContent['type'] {
  // Validate that the path ends with page.mdx
  if (!contentPath.endsWith('/page.mdx')) {
    throw new Error(`Unknown content type for path: ${contentPath}`);
  }

  if (contentPath.startsWith('blog/')) {
    return 'blog';
  }
  if (contentPath.startsWith('learn/courses/')) {
    return 'course';
  }
  if (contentPath.startsWith('videos/')) {
    return 'video';
  }
  if (contentPath.startsWith('demos/')) {
    return 'demo';
  }
  throw new Error(`Unknown content type for path: ${contentPath}`);
}

// Get the slug from a path
export function getSlugFromPath(contentPath: string): string {
  // Remove /page.mdx from the end if present
  const pathWithoutFile = contentPath.replace(/\/page\.mdx$/, '');
  const parts = pathWithoutFile.split('/');

  // For blog posts, the last part is the slug
  if (contentPath.startsWith('blog/')) {
    return parts[parts.length - 1];
  }
  // For courses, the last part is the slug
  if (contentPath.startsWith('learn/courses/')) {
    return parts[parts.length - 1];
  }
  // For other content types, use the last part
  return parts[parts.length - 1];
}

// Load content from an MDX file
export async function loadMdxContent(contentPath: string): Promise<Article> {
  try {
    console.log('loadMdxContent called with path:', contentPath);
    
    // In test environment, check if we have registered mock content
    if (process.env.NODE_ENV === 'test' && !hasRegisteredContent(contentPath)) {
      throw new Error(`No content registered for path: ${contentPath}`);
    }

    // In test environment, prepend @/app to the path
    const importPath = process.env.NODE_ENV === 'test' ? `@/app/${contentPath}` : contentPath;
    const mdxModule = await import(importPath);
    console.log('loadMdxContent imported module:', mdxModule);

    // Handle both direct metadata and metadata property
    const metadata = mdxModule.metadata || {};
    console.log('loadMdxContent extracted metadata:', metadata);

    // Extract the slug from the path
    const slug = getSlugFromPath(contentPath);
    console.log('loadMdxContent extracted slug:', slug);

    // Determine content type from path
    const type = getContentType(contentPath);
    console.log('loadMdxContent determined type:', type);

    // Create metadata object with all required fields
    const processedMetadata = {
      ...metadata, // Spread metadata first to preserve all fields
      title: metadata.title || 'Untitled',
      description: metadata.description || '',
      author: metadata.author || 'Unknown',
      date: metadata.date || new Date().toISOString(),
      tags: metadata.tags || [],
      commerce: metadata.commerce,
      landing: metadata.landing,
      slug,
      type
    };

    console.log('loadMdxContent processed metadata:', processedMetadata);

    // Create and return an Article instance
    const article = new Article(processedMetadata);
    console.log('loadMdxContent created Article instance:', article);
    
    return article;
  } catch (error) {
    console.error('loadMdxContent error:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to load content from ${contentPath}: ${error.message}`);
    }
    throw error;
  }
}

// Get all content of a specific type
export async function getContentByType(type: BaseContent['type']): Promise<Article[]> {
  const rootDir = getContentDir(type);
  
  // Get content paths using glob
  const contentPaths = await glob('*/page.mdx', {
    cwd: process.env.NODE_ENV === 'test' ? rootDir : `src/app/${rootDir}`
  });

  // Return empty array if no content paths found
  if (!contentPaths.length) {
    return [];
  }

  const contentPromises = contentPaths.map(async (contentPath) => {
    try {
      // Always prepend the root directory
      const fullPath = `${rootDir}/${contentPath}`;
      return await loadMdxContent(fullPath);
    } catch (error) {
      // If content loading fails, skip this item
      console.error(`Failed to load content at ${contentPath}:`, error);
      return null;
    }
  });

  const results = await Promise.all(contentPromises);
  // Filter out null results from failed loads
  return results.filter((content): content is Article => content !== null);
}

// Get all purchasable content across types
export async function getAllPurchasableContent(): Promise<Article[]> {
  const types: BaseContent['type'][] = ['blog', 'course'];
  const allContent = await Promise.all(types.map(getContentByType));
  return allContent
    .flat()
    .filter((content) => content.commerce?.isPaid);
}

// Get landing page content for a purchasable item
export function getLandingContent(article: Article) {
  if (!isPurchasable(article)) {
    throw new Error('Cannot get landing page for non-purchasable content');
  }
  
  return {
    ...article,
    landing: article.landing || getDefaultLanding(article)
  };
}

// Get the URL for a piece of content
export function getContentUrl(content: Content): string {
  switch (content.type) {
    case 'blog':
      return `/blog/${content.slug}`;
    case 'course':
      return `/learn/courses/${content.slug}`;
    case 'video':
      return `/videos/${content.slug}`;
    case 'demo':
      return `/demos/${content.slug}`;
    default:
      throw new Error(`Unknown content type: ${content.type}`);
  }
} 