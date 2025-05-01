// use server directive might be needed depending on your Next.js setup, 
// Next.js 15.3 often benefits from it for RSCs involving file system/db
import 'server-only';

import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Content, Blog, Purchasable, ProductContent, COURSES_DISABLED, ExtendedMetadata } from '@/types'; // Assuming ExtendedMetadata is defined here or in '@/types'
import React from 'react';
import { PrismaClient } from '@prisma/client';
import { generateProductFromArticle, generateProductFromCourse } from './productGenerator'; // Adjust path if necessary
import dynamic from 'next/dynamic'; // Although this file is server-only, dynamic is used for the ArticleContent component
// import { getContentUrl } from './content-url' // Removed as it was unused
import { contentLogger as logger } from '@/utils/logger'; // Import the centralized logger

// Mark this file as server-side only (already present)
export const config = {
  runtime: 'nodejs'
};

const prisma = new PrismaClient();

// Directory where content is stored
const contentDirectory = path.join(process.cwd(), 'src/content');
const appDirectory = path.join(process.cwd(), 'src/app');

// Add helper function for slug normalization (useful for comparing potential route params to content slugs)
// Remove any leading slashes and 'blog/' or 'videos/' prefix IF they exist at the start
export const normalizeRouteOrFileSlug = (slug: string) => {
  let cleanedSlug = slug.replace(/^\/+/, ''); // Remove leading slashes
  // Optionally remove content type prefix if it seems like a full path
  const contentTypePrefixes = ['blog/', 'videos/', 'learn/courses/', 'comparisons/']; // Add other types as needed
  for (const prefix of contentTypePrefixes) {
    if (cleanedSlug.startsWith(prefix)) {
      cleanedSlug = cleanedSlug.substring(prefix.length);
      break; // Assume only one prefix
    }
  }
  return cleanedSlug;
}


// --- Internal Helpers ---

/**
 * Internal: Dynamically imports MDX module and extracts content component and metadata.
 * Does basic existence check first.
 * @param contentType The content type directory (e.g., 'blog', 'videos')
 * @param directorySlug The directory name for the specific content item
 * @returns Imported MDX module components and metadata, or null if not found/failed.
 */
async function _loadMDXModule(contentType: string, directorySlug: string) {
  const contentMdxPath = path.join(contentDirectory, contentType, directorySlug, 'page.mdx');

  if (!fs.existsSync(contentMdxPath)) {
    logger.debug(`MDX file not found: ${contentType}/${directorySlug}`);
    return null;
  }

  try {
    // Use template literal syntax for dynamic import path
    const mdxModule = await import(`@/content/${contentType}/${directorySlug}/page.mdx`);
    const MdxContent = mdxModule.default;
    const metadata = mdxModule.metadata as ExtendedMetadata;

    if (!MdxContent && !metadata) {
      logger.debug(`MDX module loaded but no default export or metadata found for: ${contentType}/${directorySlug}`);
      return null; // Or return { MdxContent, metadata } if partial loads are possible/useful
    }

    logger.debug(`Successfully loaded MDX module: ${contentType}/${directorySlug}`);
    return { MdxContent, metadata };
  } catch (error: any) {
    // Catch potential errors during import itself
    if (error.code === 'MODULE_NOT_FOUND') {
        logger.debug(`MDX module import failed (MODULE_NOT_FOUND): ${contentType}/${directorySlug}`);
        // This case should ideally be caught by fs.existsSync, but keeping it for robustness
    } else {
        logger.error(`Error dynamically importing MDX module for ${contentType}/${directorySlug}:`, error);
    }
    return null;
  }
}

/**
 * Internal: Processes raw MDX metadata into a consistent Content object structure.
 * Handles defaults, slug/ID generation, and type mapping.
 * @param contentType The content type directory (e.g., 'blog', 'videos')
 * @param directorySlug The directory name for the specific content item
 * @param rawMetadata The raw metadata object imported from the MDX file
 * @returns A processed Content object.
 */
function _processContentMetadata(contentType: string, directorySlug: string, rawMetadata: ExtendedMetadata): Content {
  let processedMetadata = { ...rawMetadata };

  // Ensure the content's unique slug is based on structure, not just metadata field
  const finalContentSlug = `/${contentType}/${directorySlug}`;

  // Ensure a unique deterministic ID
  const contentId = `${contentType}-${directorySlug}`;

  // Ensure the type is set correctly, defaulting based on content type directory
  const determinedType = processedMetadata.type || (
    contentType === 'blog' ? 'blog' :
    contentType === 'videos' ? 'video' :
    contentType === 'learn/courses' ? 'course' :
    contentType === 'comparisons' ? 'comparison' :
    'blog' // Default fallback type
  );

  // Standardize the title processing (handle string or object with default)
  const standardizedTitle = typeof processedMetadata.title === 'string'
    ? processedMetadata.title
    : (processedMetadata.title as any)?.default || 'Untitled';


  const content: Content = {
    _id: contentId,
    slug: finalContentSlug, // Full URL path slug
    directorySlug: directorySlug, // Store original directory identifier
    type: determinedType,
    title: standardizedTitle,
    description: processedMetadata.description || '',
    author: processedMetadata.author || 'Unknown',
    date: processedMetadata.date || new Date().toISOString(),
    image: processedMetadata.image || '',

    // Include optional fields only if they exist in source metadata
    ...(processedMetadata.commerce && { commerce: processedMetadata.commerce }),
    ...(processedMetadata.landing && { landing: processedMetadata.landing }),
    ...(processedMetadata.tags && { tags: processedMetadata.tags })
  };

  logger.debug(`Processed metadata for ${contentType}/${directorySlug}`, content);
  return content;
}

/**
 * Internal: Loads multiple content items by their directory slugs, processes, filters, and sorts.
 * @param contentType The content type directory
 * @param directorySlugs Array of exact directory slugs to load
 * @returns Array of processed Content objects.
 */
async function _loadAndProcessContentsArray(contentType: string, directorySlugs: string[]): Promise<Content[]> {
  if (!directorySlugs || directorySlugs.length === 0) {
    logger.debug(`No directory slugs provided for loading type: ${contentType}`);
    return [];
  }

  const contentItemsPromises = directorySlugs.map(async (directorySlug) => {
    const mdxModule = await _loadMDXModule(contentType, directorySlug);
    if (!mdxModule || !mdxModule.metadata) {
      // _loadMDXModule already logs debug messages here
      return null;
    }
    try {
      return _processContentMetadata(contentType, directorySlug, mdxModule.metadata);
    } catch (error) {
      logger.error(`Error processing metadata for ${contentType}/${directorySlug}:`, error);
      return null;
    }
  });

  const results = await Promise.all(contentItemsPromises);

  // Filter out any null items (failed loads or processing)
  let validItems = results.filter((item): item is Content => item !== null);

  // Sort by date (newest first)
  validItems.sort((a, b) => {
    const dateA = a?.date ? new Date(a.date).getTime() : 0;
    const dateB = b?.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  return validItems;
}


// --- Public Functions ---

/**
 * Get all directory slugs for a content type.
 * These slugs correspond to the directory names within the content type folder.
 * Skips disabled content types (e.g., courses).
 * @param contentType The content type directory (e.g., 'blog', 'videos', 'learn/courses')
 * @returns Array of directory slugs (string[])
 */
export function getContentSlugs(contentType: string): string[] {
  // If courses are disabled and the content type is courses, return an empty array
  if (COURSES_DISABLED && contentType === 'learn/courses') {
    logger.debug('Courses are temporarily disabled. Skipping content slugs for learn/courses.');
    return [];
  }

  const contentDir = path.join(contentDirectory, contentType);

  if (!fs.existsSync(contentDir)) {
    logger.debug(`Content directory does not exist for type: ${contentType}`);
    return [];
  }

  // Read directories, filter for directories containing page.mdx
  const slugs = fs.readdirSync(contentDir)
    .filter(item => {
      const itemPath = path.join(contentDir, item);
      const stat = fs.statSync(itemPath);
      // Check if it's a directory and contains page.mdx
      return stat.isDirectory() && fs.existsSync(path.join(itemPath, 'page.mdx'));
    });

  logger.debug(`Found ${slugs.length} valid content directory slugs for type: ${contentType}`);
  return slugs;
}

/**
 * Check if content exists for a specific content type and directory slug.
 * @param contentType The content type directory
 * @param directorySlug The directory name for the specific content item
 * @returns Whether the content's page.mdx file exists.
 */
export function contentExists(contentType: string, directorySlug: string): boolean {
  const contentMdxPath = path.join(contentDirectory, contentType, directorySlug, 'page.mdx');
  const exists = fs.existsSync(contentMdxPath);

  logger.debug(`Checking content existence for ${contentType}/${directorySlug}: ${exists}`);
  return exists;
}

/**
 * Get a single processed Content object (including metadata) by its content type and directory slug.
 * Does NOT include the MDX React component. Useful for listing pages, displaying metadata snippets, etc.
 * @param contentType The content type directory
 * @param directorySlug The directory name for the specific content item
 * @returns The processed Content object or null if not found or failed to load/process.
 */
export async function getContentItemByDirectorySlug(contentType: string, directorySlug: string): Promise<Content | null> {
  const mdxModule = await _loadMDXModule(contentType, directorySlug);
  if (!mdxModule || !mdxModule.metadata) {
     // _loadMDXModule already logged detailed reason
     return null;
  }

  try {
    return _processContentMetadata(contentType, directorySlug, mdxModule.metadata);
  } catch (error) {
    logger.error(`Error processing metadata for ${contentType}/${directorySlug}:`, error);
    return null;
  }
}

/**
 * Get a single content item, including the MDX React component and processed metadata.
 * Useful for rendering a specific content page.
 * @param contentType The content type directory
 * @param directorySlug The directory name for the specific content item
 * @returns An object containing the MDX component and processed content metadata, or null if not found or failed.
 */
export async function getContentWithComponentByDirectorySlug(contentType: string, directorySlug: string): Promise<{ MdxContent: React.ComponentType, content: Content } | null> {
  const mdxModule = await _loadMDXModule(contentType, directorySlug);
  if (!mdxModule || !mdxModule.MdxContent || !mdxModule.metadata) {
    // _loadMDXModule already logged detailed reason
    // Add specific check if component or metadata is missing even if module loaded
    if (mdxModule && !mdxModule.MdxContent) logger.debug(`MDX module found but MdxContent component is missing for ${contentType}/${directorySlug}`);
    if (mdxModule && !mdxModule.metadata) logger.debug(`MDX module found but metadata is missing for ${contentType}/${directorySlug}`);
    return null;
  }

  try {
    const content = _processContentMetadata(contentType, directorySlug, mdxModule.metadata);
    return {
      MdxContent: mdxModule.MdxContent,
      content: content
    };
  } catch (error) {
    logger.error(`Error processing metadata and getting component for ${contentType}/${directorySlug}:`, error);
    return null;
  }
}

/**
 * Get multiple processed Content objects by a list of exact directory slugs.
 * Does NOT include MDX React components. Useful for loading specific related items.
 * @param contentType The content type directory
 * @param directorySlugs Array of exact directory slugs to load and process.
 * @returns Array of processed Content objects (nulls are filtered out).
 */
export async function getContentsByDirectorySlugs(contentType: string, directorySlugs: string[]): Promise<Content[]> {
  logger.info(`Attempting to load ${directorySlugs.length} items for type ${contentType} by directory slugs`);
  const items = await _loadAndProcessContentsArray(contentType, directorySlugs);
  logger.info(`Loaded ${items.length} items for type ${contentType} by directory slugs`);
  return items;
}


/**
 * Get all available processed Content objects (metadata only, no component) for a specific type.
 * @param contentType The content type directory (defaults to 'blog').
 * @returns Array of processed Content objects.
 */
export async function getAllContent(contentType: string = 'blog'): Promise<Content[]> {
  logger.info(`Loading all content items for type: ${contentType}`);

  // Get all directory slugs for this type
  const directorySlugs = getContentSlugs(contentType);
  logger.debug(`Found ${directorySlugs.length} directory slugs for type ${contentType}`);

  // Load and process all of them
  const contentItems = await _loadAndProcessContentsArray(contentType, directorySlugs);

  logger.info(`Finished loading ${contentItems.length} content items for type: ${contentType}`);
  return contentItems;
}

/**
 * Generate static params for content of a specific content type for Next.js static generation.
 * Returns an array of objects like `{ slug: 'my-post' }`.
 * @param contentType The content type directory
 * @returns Array of directory slug params for static generation.
 */
export async function generateContentStaticParams(contentType: string) {
  const directorySlugs = getContentSlugs(contentType);
  // Returns params using the directory slug, as this is what the page route slug will be
  return directorySlugs.map(directorySlug => ({ slug: directorySlug }));
}

/**
 * Generate metadata for a content item for Next.js generateMetadata function.
 * This loads the *raw* metadata directly from the MDX file.
 * @param contentType The content type directory
 * @param directorySlug The directory name for the specific content item
 * @returns Raw Metadata object imported from the MDX file, or empty object.
 */
export async function generateContentMetadata(contentType: string, directorySlug: string): Promise<Metadata> {
  // Only load the raw metadata, do not process it into the full Content object structure
  // as Next.js generateMetadata expects a Metadata type or undefined
  try {
    const mdxModule = await _loadMDXModule(contentType, directorySlug);
    // Return raw metadata if available, otherwise an empty object conforms to Metadata type
    const baseMetadata = mdxModule?.metadata || {};
    // Inject metadataBase here
    return {
      ...baseMetadata,
      metadataBase: new URL('https://zackproser.com'),
    };
  } catch (error) {
    logger.error(`Error generating metadata for ${contentType}/${directorySlug}:`, error);
    // Return empty object with metadataBase even on error?
    // Or just empty object? Let's return empty with metadataBase for consistency.
    return {
      metadataBase: new URL('https://zackproser.com'),
    };
  }
}

/**
 * Check if a user has purchased a specific content item.
 * Uses the standard content identifier (content type and directory slug).
 * @param userIdOrEmail The user ID or email
 * @param contentType The content type directory (e.g., 'blog', 'videos', 'learn/courses')
 * @param directorySlug The directory name for the specific content item
 * @returns Whether the user has purchased the content.
 */
export async function hasUserPurchased(userIdOrEmail: string | null | undefined, contentType: string, directorySlug: string): Promise<boolean> {
  if (!userIdOrEmail) {
    logger.debug(`Purchase check: No user ID or email provided for ${contentType}/${directorySlug}`);
    return false;
  }

  const isEmail = typeof userIdOrEmail === 'string' && userIdOrEmail.includes('@');

  try {
    let purchase = null;

    // Prisma query looks for purchases matching the identifying information
    const whereCondition = {
      contentType: contentType,
      contentSlug: directorySlug, // Assuming 'contentSlug' in DB maps to the directory slug
      ...(isEmail ? { email: userIdOrEmail } : { userId: userIdOrEmail }),
    };

    logger.debug(`Checking purchase for ${isEmail ? 'email' : 'user ID'} '${userIdOrEmail}' on ${contentType}/${directorySlug}`);
    purchase = await prisma.purchase.findFirst({
      where: whereCondition,
    });

    // If purchase found, log details verbosely
    if (purchase) {
      logger.debug(`Purchase found: ID ${purchase.id}, content: ${purchase.contentType}/${purchase.contentSlug}, userEmail: ${purchase.email}, userId: ${purchase.userId}`);
    } else {
      logger.debug(`No purchase found for ${contentType}/${directorySlug} for user/email '${userIdOrEmail}'`);
    }

    return !!purchase;
  } catch (error: any) {
    logger.error(`[hasUserPurchased] Error checking purchase status for ${contentType}/${directorySlug}:`, error);
    return false;
  }
}

/**
 * Get default paywall text for a content type.
 * @param contentType The content type
 * @returns Default paywall text structure.
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
      };
    case 'learn/courses':
      return {
        header: "Get Access to the Full Course",
        body: "This is a premium course. Purchase to get full access.",
        buttonText: "Purchase Now"
      };
    case 'article': // Assuming 'blog' content type metadata might use 'article' type
    case 'blog':
      return {
        header: "Get Access to the Full Article",
        body: "This is premium article content. Purchase to get full access.",
        buttonText: "Purchase Now",
      }
    default:
      return {
        header: "Get Access to the Full Content",
        body: "This is premium content. Purchase to get full access.",
        buttonText: "Purchase Now"
      };
  }
}

/**
 * Render content with appropriate paywall handling using the ArticleContent component.
 * Requires the MDX component and processed content metadata.
 * @param MdxContent The MDX content component (default export)
 * @param content The processed Content object (metadata)
 * @param hasPurchased Whether the user has purchased the content
 * @returns The rendered content with appropriate paywall if needed.
 */
export function renderPaywalledContent(
  MdxContent: React.ComponentType,
  content: Content, // Use the processed Content type
  hasPurchased: boolean
) {
  // Determine if we should show the full content
  const showFullContent = !content.commerce?.isPaid || hasPurchased;

  // Get default paywall text based on content type
  const defaultText = getDefaultPaywallText(content.type);

  // Dynamically import ArticleContent to avoid circular dependencies if this file is imported in components
  // Note: This file is marked 'server-only', but ArticleContent likely exists client-side,
  // so dynamic import with `ssr: false` might be needed depending on ArticleContent's usage.
  // Assuming ArticleContent is a Server Component based on context, keeping simple dynamic import.
  const ArticleContent = dynamic(() => import("@/components/ArticleContent") as Promise<{ default: React.ComponentType<any> }>);

  return React.createElement(
    ArticleContent,
    {
      // Pass MDX content as children prop to ArticleContent
      children: React.createElement(MdxContent),
      // Pass necessary data from processed content metadata
      showFullContent: showFullContent,
      price: content.commerce?.price || 0,
      slug: content.directorySlug, // Use directorySlug here
      title: content.title, // Use the processed title
      previewLength: content.commerce?.previewLength,
      previewElements: content.commerce?.previewElements,
      paywallHeader: content.commerce?.paywallHeader || defaultText.header,
      paywallBody: content.commerce?.paywallBody || defaultText.body,
      buttonText: content.commerce?.buttonText || defaultText.buttonText,
      // Pass content object itself if ArticleContent needs more data
      content: content,
    }
  );
}

/**
 * Get all content items across all types that are marked as purchasable (`commerce.isPaid: true`).
 * Returns processed Content objects (metadata only).
 * @returns Array of purchasable Content items.
 */
export async function getAllPurchasableContent(): Promise<Content[]> {
  logger.info('Loading all purchasable content items.');
  try {
    // Get content from relevant types
    const contentTypes = COURSES_DISABLED ? ['blog', 'videos'] : ['blog', 'learn/courses', 'videos'];

    const allContentPromises = contentTypes.map(type => getAllContent(type));
    const allContent = (await Promise.all(allContentPromises)).flat();

    // Filter to only paid content
    const purchasableContent = allContent.filter(content => content.commerce?.isPaid);

    logger.info(`Found ${purchasableContent.length} purchasable content items.`);
    return purchasableContent; // These are already Content objects
  } catch (error) {
    logger.error('Error loading all purchasable content:', error);
    return [];
  }
}

/**
 * Get all products. Products are purchasable content items processed into the ProductContent structure.
 * @returns Array of ProductContent items.
 */
export async function getAllProducts(): Promise<ProductContent[]> {
  logger.info('Loading all products.');
  try {
     // Get all purchasable content items first
    const purchasableContent = await getAllPurchasableContent();

    // Transform to product content using appropriate generators
    const productContentPromises = purchasableContent.map(async content => {
      // Assuming generateProductFromCourse needs the full Content object and potentially component/other data?
      // The original code cast content as `any` and `BlogWithSlug`. Let's pass the full processed Content object.
      // If these generation functions require the MDX component, we'd need to load that too.
      // Based on generateProductFromArticle(content as BlogWithSlug), it seems like it just needs metadata fields.
      // Let's refine this: If generators ONLY need metadata from the Content object, we pass 'content'.
      // If they need the MDX component, this function needs to load it or be refactored.
      // Assuming they only need metadata for product details:
      if (content.type === 'course' && !COURSES_DISABLED) {
        // Assuming generateProductFromCourse can work with the Content type
        return generateProductFromCourse(content as any); // Cast to 'any' to bypass type error - revisit if needed
      }
      // Assuming generateProductFromArticle can work with the Content type (Blog extends Content)
      return generateProductFromArticle(content as Blog); // Casting to Blog which extends Content
    });

    const productContent = await Promise.all(productContentPromises);

    const validProductItems = productContent.filter((p): p is ProductContent => p !== null); // Filter out any nulls from generators

    logger.info(`Generated ${validProductItems.length} product items.`);
    return validProductItems;
  } catch (error) {
    logger.error('Error loading products:', error);
    return [];
  }
}


/**
 * Get a single purchasable content item (Product) by its directory slug, searching across content types.
 * Includes the MDX component alongside the processed content metadata.
 * @param directorySlug The directory name of the product content item.
 * @returns The Purchasable item (Content with MdxComponent) or null if not found or not purchasable.
 */
export async function getProductByDirectorySlug(directorySlug: string): Promise<Purchasable | null> {
  logger.info(`Looking for product with directory slug: ${directorySlug}`);
  // Try to find the content in relevant content types
  const contentTypes = COURSES_DISABLED
    ? ['blog', 'videos']
    : ['blog', 'learn/courses', 'videos', 'comparisons']; // Added comparisons potentially? Adjust as needed.

  for (const contentType of contentTypes) {
    logger.debug(`Checking for product in ${contentType}/${directorySlug}`);
    // Use the function that gets both component and processed metadata
    const result = await getContentWithComponentByDirectorySlug(contentType, directorySlug);

    // Check if found and is marked as paid
    if (result && result.content.commerce?.isPaid) {
      logger.info(`Found product: ${contentType}/${directorySlug}`);
      // The Purchasable type seems to be Blog & { MdxContent: any }
      // Blog extends Content. So Purchasable is Content & { MdxContent: any }.
      // The structure returned by getContentWithComponentByDirectorySlug is { MdxContent, content: Content }
      // We need to return something that matches Purchasable. Let's merge them.
      const purchasableItem: Purchasable = {
        ...result.content, // Spread all properties from Content
        MdxContent: result.MdxContent, // Add the MdxContent component
      } as Purchasable; // Cast to Purchasable type

      // Ensure correct type is set on the resulting object if needed by Purchasable type
      // The _processContentMetadata already sets content.type, but explicit cast might need it.
      // purchasableItem.type = result.content.type; // Already included by spreading result.content

      return purchasableItem;
    }
     if (result && !result.content.commerce?.isPaid) {
        logger.debug(`Found content ${contentType}/${directorySlug}, but it is not marked as paid. Skipping.`);
     }
  }

  logger.info(`Product with directory slug ${directorySlug} not found or not purchasable.`);
  return null;
}


/**
 * Get all valid top-level pages from the app directory for purposes like sitemaps.
 * Note: This function works on the app directory structure, not the content MDX files.
 * @returns Array of valid page routes (string[]).
 */
export async function getAppPageRoutesPaths(): Promise<string[]> {
  const excludeDirs = ['api', 'rss', '[name]', '[slug]', '_lib']; // Added _lib, adjust excludeDirs as needed
  const validPageFiles = ['page.tsx', 'page.jsx', 'page.js', 'page.mdx', 'page.md']; // Includes MDX/MD pages
  const routes = new Set<string>();

  // Add root route if a page file exists at the root, or if index content exists (less likely in app dir)
  // For simplicity, just add the root route '/' if app/page.* exists
  if (validPageFiles.some(file => fs.existsSync(path.join(appDirectory, file)))) {
      routes.add('/');
  }


  function addRoutesRecursively(currentPath: string, relativePath: string = '') {
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        // Skip excluded directories, hidden files, and Next.js convention files/dirs
        if (
            excludeDirs.includes(entry.name) ||
            entry.name.startsWith('.') ||
            entry.name.startsWith('_') || // e.g., _components, _lib
            entry.name === 'node_modules'
           ) {
          continue;
        }

        const fullPath = path.join(currentPath, entry.name);
        const relPath = path.join(relativePath, entry.name); // relative path without leading /

        if (entry.isDirectory()) {
          // Check if this directory contains any valid page files
          const hasValidPage = validPageFiles.some(pageFile =>
            fs.existsSync(path.join(fullPath, pageFile))
          );

          if (hasValidPage) {
            // Add the normalized route path (e.g., '/about', '/products/item1')
            const routePath = `/${relPath.replace(/\\/g, '/')}`; // Ensure forward slashes
            routes.add(routePath);

             logger.debug(`Found app page directory: ${routePath}`); // Log found pages
          }

          // Recursively check subdirectories
          addRoutesRecursively(fullPath, relPath);
        }
        // Individual page files at the root won't be caught unless the root check handles it
        // or if they are within a directory. Standard app dir puts page.* inside dirs.
      }
    } catch (error) {
      logger.error(`Error processing directory ${currentPath}:`, error);
    }
  }

  try {
    addRoutesRecursively(appDirectory);
    // Also add slugs from content types if they are top-level routes (e.g. /blog/* requires /blog)
    // This is more complex as it depends on your app/[type]/[slug]/page.tsx structure.
    // If you have app/blog/page.tsx, it's covered by the recursive scan.
    // If you only have app/blog/[slug]/page.tsx, you might need to add the parent '/blog' path manually if it's a list page.
    // Assuming the recursive scan catches pages like app/blog/page.tsx or app/learn/courses/page.tsx

    const sortedRoutes = Array.from(routes).sort((a, b) => {
        // Sort alphabetically, but put '/' first
        if (a === '/') return -1;
        if (b === '/') return 1;
        return a.localeCompare(b);
    });

     logger.info(`Found ${sortedRoutes.length} app page routes.`);
    return sortedRoutes;
  } catch (error) {
    logger.error('Error getting app page routes:', error);
    return Array.from(routes).sort((a,b) => a === '/' ? -1 : b === '/' ? 1 : a.localeCompare(b)); // Return what we have even if there's an error
  }
}