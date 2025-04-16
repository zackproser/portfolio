import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { ExtendedMetadata, Content, Blog, isPurchasable, Purchasable, BlogWithSlug, ProductContent, COURSES_DISABLED } from '@/types'
import React from 'react'
import { PrismaClient } from '@prisma/client'
import { generateProductFromArticle, generateProductFromCourse } from './productGenerator'
import dynamic from 'next/dynamic'
import { getContentUrl } from './content-url'

// Mark this file as server-side only
export const config = {
  runtime: 'nodejs'
}

const prisma = new PrismaClient()

// Directory where content is stored
const contentDirectory = path.join(process.cwd(), 'src/content')
const appDirectory = path.join(process.cwd(), 'src/app')

// Logging configuration
const LOG_LEVELS = {
  SILENT: 0,   // No logs
  BASIC: 1,    // Basic summary logs only (default)
  VERBOSE: 2   // All detailed logs
};

// Set default log level to BASIC, can be overridden with DEBUG_CONTENT env var
const getLogLevel = () => {
  if (process.env.DEBUG_CONTENT === 'verbose') return LOG_LEVELS.VERBOSE;
  if (process.env.DEBUG_CONTENT === 'silent') return LOG_LEVELS.SILENT;
  return LOG_LEVELS.BASIC; // Default
};

const LOG_LEVEL = getLogLevel();

// Logger functions for different verbosity levels
const logSummary = (message: string) => {
  if (LOG_LEVEL >= LOG_LEVELS.BASIC) {
    console.log(`[content] ${message}`);
  }
};

const logVerbose = (message: string, data?: any) => {
  if (LOG_LEVEL >= LOG_LEVELS.VERBOSE) {
    if (data) {
      console.log(`[content:verbose] ${message}`, data);
    } else {
      console.log(`[content:verbose] ${message}`);
    }
  }
};

/**
 * Get all slugs for a content type
 * @param contentType The content type directory (e.g., 'blog', 'videos')
 * @returns Array of slugs
 */
export function getContentSlugs(contentType: string) {
  // If courses are disabled and the content type is courses, return an empty array
  if (COURSES_DISABLED && contentType === 'learn/courses') {
    logVerbose('Courses are temporarily disabled');
    return [];
  }

  const contentDir = path.join(contentDirectory, contentType)
  
  if (!fs.existsSync(contentDir)) {
    logVerbose(`Content directory does not exist: ${contentDir}`)
    return []
  }
  
  const slugs = fs.readdirSync(contentDir)
    .filter(item => {
      const itemPath = path.join(contentDir, item)
      return fs.statSync(itemPath).isDirectory()
    })
    .filter(slug => {
      // Only include directories that have a page.mdx file
      const mdxPath = path.join(contentDir, slug, 'page.mdx')
      return fs.existsSync(mdxPath)
    });
  
  logVerbose(`Found ${slugs.length} total slugs for ${contentType} in content directory`);
  return slugs;
}

/**
 * Check if content exists
 * @param contentType The content type directory
 * @param slug The content slug
 * @returns Whether the content exists
 */
export function contentExists(contentType: string, slug: string): boolean {
  const contentMdxPath = path.join(contentDirectory, contentType, slug, 'page.mdx')
  const exists = fs.existsSync(contentMdxPath)
  
  if (exists) {
    logVerbose(`Content found: ${contentType}/${slug}`)
  } else {
    logVerbose(`Content not found: ${contentType}/${slug}`)
  }
  
  return exists
}

/**
 * Load content by slug
 * @param contentType The content type directory
 * @param slug The content slug
 * @returns The content component and metadata
 */
export async function loadContent(contentType: string, slug: string) {
  try {
    const contentMdxPath = path.join(contentDirectory, contentType, slug, 'page.mdx')
    
    if (!fs.existsSync(contentMdxPath)) {
      logVerbose(`Content not found: ${contentType}/${slug}`)
      return null
    }
    
    // Dynamically import the MDX content
    const mdxModule = await import(`@/content/${contentType}/${slug}/page.mdx`)
    const MdxContent = mdxModule.default
    const metadata = mdxModule.metadata

    if (!MdxContent) {
      logVerbose(`No MDX content found for: ${contentType}/${slug}`)
      return null
    }
    
    return { MdxContent, metadata }
  } catch (error) {
    console.error(`Error loading content for ${contentType}/${slug}:`, error)
    return null
  }
}

/**
 * Get all content of a specific type
 * @param contentType The content type directory
 * @param specificSlugs Optional array of specific slugs to filter by
 * @returns Array of content items
 */
export async function getAllContent(contentType: string = 'blog', specificSlugs?: string[]): Promise<Content[]> {
  try {
    // Log high-level summary of what we're loading
    const slugLabel = specificSlugs ? `filtered to ${specificSlugs.length} specific slugs` : 'all slugs';
    logSummary(`Loading content: ${contentType} (${slugLabel})`);
    
    // Get all directory slugs (these are the actual content directories)
    let slugs = getContentSlugs(contentType);
    logVerbose(`Found ${slugs.length} content directories to process`);
    
    // If specific slugs are provided and we need early filtering for efficiency,
    // we need to match against the directory names AND the basename of any path-based slugs
    if (specificSlugs && specificSlugs.length > 0) {
      // Extract both the full slug and the basename (last part) of each specificSlug
      const specificSlugSet = new Set();
      specificSlugs.forEach(slug => {
        // Add the original slug
        specificSlugSet.add(slug);
        // Add the basename (everything after the last /)
        const basename = slug.split('/').pop();
        if (basename) specificSlugSet.add(basename);
      });
      
      // Now filter the directory slugs using this expanded set
      const originalCount = slugs.length;
      slugs = slugs.filter(dirSlug => specificSlugSet.has(dirSlug));
      logVerbose(`Filtered from ${originalCount} to ${slugs.length} content directories based on specific slugs`);
    }
    
    const contentItemsPromises = slugs.map(async (slug) => {
      try {
        const result = await loadContent(contentType, slug)
        if (!result) return null
        
        const { metadata } = result
        
        // Process metadata to ensure consistent slug and ID generation
        let processedMetadata = { ...metadata } as ExtendedMetadata
        
        // Ensure the metadata has a slug (use the directory name if not provided)
        if (!processedMetadata.slug || processedMetadata.slug === 'untitled') {
          processedMetadata.slug = slug
        } else {
          // Normalize the slug to prevent path issues
          // Remove any leading slashes
          let formattedSlug = processedMetadata.slug.replace(/^\/+/, '')
          
          // Remove content type prefix if it exists (e.g., 'blog/' from 'blog/my-post')
          if (formattedSlug.startsWith(`${contentType}/`)) {
            formattedSlug = formattedSlug.substring(contentType.length + 1)
          }
          
          // Update the slug in the metadata
          processedMetadata.slug = formattedSlug
        }
        
        // Add a unique ID that's deterministic based on content type and slug
        processedMetadata._id = `${contentType}-${processedMetadata.slug}`
        
        // Ensure the type is set correctly
        processedMetadata.type = processedMetadata.type || (
          contentType === 'blog' ? 'blog' : 
          contentType === 'videos' ? 'video' : 
          contentType === 'learn/courses' ? 'course' : 'blog'
        )
        
        // Create the full path for the content
        const typePath = 
          contentType === 'videos' ? 'videos' : 
          contentType === 'blog' ? 'blog' : 
          contentType === 'learn/courses' ? 'learn/courses' : 
          contentType === 'comparisons' ? 'comparisons' : 
          contentType;
        
        // Store both the directory slug and the processed slug for reliable matching
        return {
          author: processedMetadata.author || 'Unknown',
          date: processedMetadata.date || new Date().toISOString(),
          title: typeof processedMetadata.title === 'string' ? processedMetadata.title : (processedMetadata.title as any)?.default || 'Untitled',
          description: processedMetadata.description || '',
          image: processedMetadata.image || '',  // Ensure image is always a string, even if empty
          type: processedMetadata.type,
          slug: `/${typePath}/${processedMetadata.slug}`,  // Include the full path in the slug
          _id: processedMetadata._id,
          directorySlug: slug, // Add the original directory slug for reliable matching
          ...(processedMetadata.commerce && { commerce: processedMetadata.commerce }),
          ...(processedMetadata.landing && { landing: processedMetadata.landing }),
          ...(processedMetadata.tags && { tags: processedMetadata.tags })
        } as Content  // Explicitly cast to Content type
      } catch (error) {
        console.error(`Error processing content for ${contentType}/${slug}:`, error)
        return null
      }
    })
    
    // Wait for all promises to resolve
    const contentItems = await Promise.all(contentItemsPromises)
    
    // Filter out any null items and sort by date
    // Use a more explicit type guard to satisfy TypeScript
    let validItems = contentItems.filter((item): item is Content => 
      item !== null && typeof item === 'object'
    )
    
    // If specific slugs were provided, apply final filtering
    if (specificSlugs && specificSlugs.length > 0) {
      // Multiple matching strategies to ensure we find the right content
      validItems = validItems.filter(item => {
        // 1. Try to match against the directory slug (most reliable)
        if (specificSlugs.includes(item.directorySlug)) {
          logVerbose(`Matched on directory slug: ${item.directorySlug}`);
          return true;
        }
        
        // 2. Try to match the slug basename (remove path)
        const itemSlugBasename = item.slug.split('/').pop() || '';
        const specificSlugBasenames = specificSlugs.map(s => s.split('/').pop() || '');
        if (specificSlugBasenames.includes(itemSlugBasename)) {
          logVerbose(`Matched on slug basename: ${itemSlugBasename}`);
          return true;
        }
        
        // 3. Try to match any part of the slug path
        for (const specificSlug of specificSlugs) {
          if (item.slug.includes(specificSlug)) {
            logVerbose(`Matched on slug substring: ${specificSlug} in ${item.slug}`);
            return true;
          }
        }
        
        return false;
      });
      
      // Output detailed log of which items matched
      logVerbose(`After multi-strategy filtering, found ${validItems.length} matching items:`);
      validItems.forEach(item => {
        logVerbose(`  - ${item.title} (${item.directorySlug} → ${item.slug})`);
      });
    }
    
    // Sort by date, with proper null checks
    validItems.sort((a, b) => {
      const dateA = a?.date ? new Date(a.date).getTime() : 0
      const dateB = b?.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    
    // Just one summary log in default mode
    logSummary(`Loaded ${validItems.length} ${contentType} content items${specificSlugs ? ' (filtered)' : ''}`);
    
    return validItems
  } catch (error) {
    console.error(`Error getting all content for ${contentType}:`, error)
    return []
  }
}

/**
 * Generate static params for content of a specific type
 * @param contentType The content type directory
 * @returns Array of slug params for static generation
 */
export async function generateContentStaticParams(contentType: string) {
  const slugs = getContentSlugs(contentType)
  return slugs.map(slug => ({ slug }))
}

/**
 * Generate metadata for a content item
 * @param contentType The content type directory
 * @param slug The content slug
 * @returns Metadata for the content
 */
export async function generateContentMetadata(contentType: string, slug: string): Promise<Metadata> {
  try {
    const result = await loadContent(contentType, slug)
    if (!result) return {}
    
    return result.metadata
  } catch (error) {
    return {}
  }
}

/**
 * Check if a user has purchased a specific content
 * @param userIdOrEmail The user ID or email
 * @param slug The content slug
 * @returns Whether the user has purchased the content
 */
export async function hasUserPurchased(userIdOrEmail: string | null | undefined, slug: string): Promise<boolean> {
  if (!userIdOrEmail) {
    return false
  }
  
  // Parse content type and slug from the provided slug
  const parts = slug.split('/')
  let contentType = 'blog'
  let contentSlug = slug
  
  // Handle case where slug is in the format "blog/my-post"
  if (parts.length > 1) {
    contentType = parts[0]
    contentSlug = parts.slice(1).join('/')
  }
  
  // For backward compatibility where we sometimes store the full slug
  const slugCondition = {
    OR: [
      { contentSlug },
      { contentSlug: slug }
    ]
  }
  
  const isEmail = typeof userIdOrEmail === 'string' && userIdOrEmail.includes('@')
  
  try {
    let purchase = null
    
    if (isEmail) {
      // Check by email
      purchase = await prisma.purchase.findFirst({
        where: {
          email: userIdOrEmail,
          contentType,
          ...slugCondition
        }
      })
      logVerbose(`Email query result: ${purchase ? `Found (ID: ${purchase.id})` : 'Not found'}`);
    } else {
      // Check by user ID
      purchase = await prisma.purchase.findFirst({
        where: {
          userId: userIdOrEmail,
          contentType,
          ...slugCondition
        }
      })
      logVerbose(`User ID query result: ${purchase ? `Found (ID: ${purchase.id})` : 'Not found'}`);
    }
    
    // If purchase found, log details
    if (purchase) {
      logVerbose(`Purchase found: ${purchase.id}, contentSlug: ${purchase.contentSlug}, userEmail: ${purchase.email}`);
    }
    
    return !!purchase
  } catch (error) {
    console.error(`[hasUserPurchased] Error checking purchase status: ${error}`)
    return false
  }
}

/**
 * Get default paywall text for a content type
 * @param contentType The content type
 * @returns Default paywall text
 */
export function getDefaultPaywallText(contentType: string): {
  header: string;
  body: string;
  buttonText: string;
} {
  switch (contentType) {
    case 'videos':
      return {
        header: "Get Access to the Full Video",
        body: "This is premium video content. Purchase to get full access.",
        buttonText: "Purchase Now"
      }
    case 'learn/courses':
      return {
        header: "Get Access to the Full Course",
        body: "This is a premium course. Purchase to get full access.",
        buttonText: "Purchase Now"
      }
    default:
      return {
        header: "Get Access to the Full Content",
        body: "This is premium content. Purchase to get full access.",
        buttonText: "Purchase Now"
      }
  }
}

/**
 * Render content with appropriate paywall handling
 * @param MdxContent The MDX content component
 * @param metadata The content metadata
 * @param hasPurchased Whether the user has purchased the content
 * @returns The rendered content with appropriate paywall if needed
 */
export function renderPaywalledContent(
  MdxContent: React.ComponentType,
  metadata: ExtendedMetadata,
  hasPurchased: boolean
) {
  // Determine if we should show the full content
  const showFullContent = !metadata.commerce?.isPaid || hasPurchased;
  
  // If content is not paid or user has purchased, we can still use ArticleContent
  // but with showFullContent=true to avoid the paywall
  const defaultText = getDefaultPaywallText(metadata.type || 'blog');
  
  // Import ArticleContent dynamically to avoid circular dependencies
  const ArticleContent = dynamic(() => import("@/components/ArticleContent"));
  
  return React.createElement(
    ArticleContent,
    {
      // eslint-disable-next-line react/no-children-prop
      children: React.createElement(MdxContent),
      showFullContent,
      price: metadata.commerce?.price || 0,
      slug: metadata.slug || '',
      title: typeof metadata.title === 'string' 
        ? metadata.title 
        : (metadata.title as any)?.default || 'Untitled',
      previewLength: metadata.commerce?.previewLength,
      previewElements: metadata.commerce?.previewElements,
      paywallHeader: metadata.commerce?.paywallHeader || defaultText.header,
      paywallBody: metadata.commerce?.paywallBody || defaultText.body,
      buttonText: metadata.commerce?.buttonText || defaultText.buttonText,
    }
  );
}

/**
 * Get content by slug with error handling
 * @param slug The content slug
 * @param contentType The content type directory (defaults to 'blog')
 * @returns The content or null if not found
 */
export async function getContentBySlug(slug: string, contentType: string = 'blog') {
  try {
    const result = await loadContent(contentType, slug)
    if (!result) {
      logVerbose(`Content not found or failed to load: ${contentType}/${slug}`)
      return null
    }
    
    const { MdxContent, metadata } = result
    
    // Ensure we have a valid slug
    const validSlug = slug && slug !== 'untitled' ? slug : metadata.slug || slug
    
    return {
      MdxContent,
      metadata: {
        ...metadata,
        slug: validSlug,
        type: metadata.type || (
          contentType === 'blog' ? 'blog' : 
          contentType === 'videos' ? 'video' : 
          contentType === 'learn/courses' ? 'course' : 'blog'
        )
      }
    }
  } catch (error) {
    console.error(`Error getting content by slug ${contentType}/${slug}:`, error)
    return null
  }
}

/**
 * Import only metadata from MDX files
 * @param slug The content slug
 * @param contentType The content type directory
 * @returns The metadata from the MDX file
 */
export async function importContentMetadata(slug: string, contentType: string = 'blog') {
  try {
    const contentMdxPath = path.join(contentDirectory, contentType, slug, 'page.mdx')
    
    if (!fs.existsSync(contentMdxPath)) {
      logVerbose(`Content not found: ${contentType}/${slug}`);
      return null
    }
    
    // Dynamically import the MDX content
    const mdxModule = await import(`@/content/${contentType}/${slug}/page.mdx`)
    const metadata = mdxModule.metadata

    if (!metadata) {
      logVerbose(`No metadata found for: ${contentType}/${slug}`);
      return null
    }
    
    // Process metadata to ensure consistent slug and ID generation
    let processedMetadata = { ...metadata } as ExtendedMetadata
    
    // Ensure the metadata has a slug (use the directory name if not provided)
    if (!processedMetadata.slug || processedMetadata.slug === 'untitled') {
      // Use the directory name as the slug
      processedMetadata.slug = slug
    } else {
      // Normalize the slug to prevent path issues
      // Remove any leading slashes
      let formattedSlug = processedMetadata.slug.replace(/^\/+/g, '')
      
      // Construct the slug based on the directory structure
      formattedSlug = `${contentType}/${slug}`;
      
      // Update the slug in the metadata
      processedMetadata.slug = formattedSlug
    }
    
    // Add a unique ID that's deterministic based on content type and slug
    processedMetadata._id = `${contentType}-${processedMetadata.slug}`
    
    return processedMetadata
  } catch (error) {
    console.error(`Error importing metadata for ${contentType}/${slug}:`, error)
    return null
  }
}

/**
 * Get all products (any content with isPaid=true)
 * @returns Array of product content items
 */
export async function getAllProducts(): Promise<ProductContent[]> {
  try {
    // Get all content from all content types at once
    const allContent = await Promise.all([
      getAllContent('blog', undefined),
      // Only include courses if they're not disabled
      ...(COURSES_DISABLED ? [] : [getAllContent('learn/courses', undefined)]),
      getAllContent('videos', undefined)
    ]).then(results => results.flat());
    
    // Filter to only paid content
    const paidContent = allContent.filter(content => content.commerce?.isPaid);
    
    // Transform to product content
    const productContent = paidContent.map(content => {
      if (content.type === 'course' && !COURSES_DISABLED) {
        return generateProductFromCourse(content as any);
      }
      return generateProductFromArticle(content as BlogWithSlug);
    });
    
    return productContent.filter((p): p is ProductContent => p !== null);
  } catch (error) {
    console.error('Error loading products:', error);
    return [];
  }
}

/**
 * Get all purchasable content
 * @returns Array of purchasable content items
 */
export async function getAllPurchasableContent(): Promise<Blog[]> {
  try {
    // Get all content from all content types
    const allContent = await Promise.all([
      getAllContent('blog', undefined),
      // Only include courses if they're not disabled
      ...(COURSES_DISABLED ? [] : [getAllContent('learn/courses', undefined)]),
      getAllContent('videos', undefined)
    ]).then(results => results.flat());
    
    // Filter to only paid content
    return allContent.filter(content => content.commerce?.isPaid) as Blog[];
  } catch (error) {
    console.error('Error loading purchasable content:', error);
    return [];
  }
}

/**
 * Get a product by its slug
 * @param slug The product slug
 * @returns The product content or null if not found
 */
export async function getProductBySlug(slug: string): Promise<Purchasable | null> {
  // Try to find the content in any content type
  const contentTypes = COURSES_DISABLED 
    ? ['blog', 'videos'] 
    : ['blog', 'learn/courses', 'videos'];
    
  for (const contentType of contentTypes) {
    const content = await getContentBySlug(slug, contentType);
    
    if (content && content.metadata && content.metadata.commerce?.isPaid) {
      // Transform to match the expected Purchasable structure
      const transformedContent = {
        ...content.metadata,
        MdxContent: content.MdxContent,
        type: content.metadata.type || contentType
      } as unknown as Purchasable;
      
      return transformedContent;
    }
  }

  return null;
}

/**
 * Get all valid top-level pages from the app directory
 * @returns Array of valid page routes
 */
export async function getTopLevelPages(): Promise<string[]> {
  const excludeDirs = ['api', 'rss', '[name]', '[slug]'];
  const validPageFiles = ['page.tsx', 'page.jsx', 'page.js', 'page.mdx', 'page.md'];
  const routes = new Set<string>();

  // Add root route
  routes.add('/');

  function addRoutesRecursively(currentPath: string, relativePath: string = '') {
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        // Skip excluded directories and hidden files
        if (excludeDirs.includes(entry.name) || entry.name.startsWith('.') || entry.name.startsWith('_')) {
          continue;
        }

        const fullPath = path.join(currentPath, entry.name);
        const relPath = path.join(relativePath, entry.name);

        if (entry.isDirectory()) {
          // Check if this directory contains any valid page files
          const hasValidPage = validPageFiles.some(pageFile => 
            fs.existsSync(path.join(fullPath, pageFile))
          );

          if (hasValidPage) {
            // Add the route without the page file name
            const routePath = `/${relPath}`.replace(/\\/g, '/');
            routes.add(routePath);
          }

          // Recursively check subdirectories
          addRoutesRecursively(fullPath, relPath);
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${currentPath}:`, error);
    }
  }

  try {
    addRoutesRecursively(appDirectory);
    return Array.from(routes).sort();
  } catch (error) {
    console.error('Error getting top-level pages:', error);
    return Array.from(routes).sort(); // Return what we have even if there's an error
  }
} 