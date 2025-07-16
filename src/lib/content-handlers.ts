// Next.js 15.3 often benefits from it for RSCs involving file system/db
// import 'server-only';

import { Metadata } from 'next';
import fs from 'fs';
import path from 'path';
import { Content, Blog, Purchasable, ProductContent, ExtendedMetadata } from '@/types'; // Assuming ExtendedMetadata is defined here or in '@/types'
import React from 'react';
import { PrismaClient } from '@prisma/client';
import { generateProductFromArticle } from './productGenerator'; // Adjust path if necessary
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
 * Now prefers metadata.json as the primary source of metadata. Falls back to MDX export if missing or malformed.
 * @param contentType The content type directory (e.g., 'blog', 'videos')
 * @param directorySlug The directory name for the specific content item
 * @returns Imported MDX module components and metadata, or null if not found/failed.
 */
async function _loadMDXModule(contentType: string, directorySlug: string) {
  const contentMdxPath = path.join(contentDirectory, contentType, directorySlug, 'page.mdx');
  const metadataJsonPath = path.join(contentDirectory, contentType, directorySlug, 'metadata.json');

  if (!fs.existsSync(contentMdxPath)) {
    logger.debug(`MDX file not found: ${contentType}/${directorySlug}`);
    return null;
  }

  let metadata: ExtendedMetadata | undefined = undefined;
  let metadataJsonError: Error | undefined = undefined;

  // 1. Try metadata.json first
  if (fs.existsSync(metadataJsonPath)) {
    try {
      metadata = JSON.parse(fs.readFileSync(metadataJsonPath, 'utf-8'));
      logger.debug(`Loaded metadata from metadata.json for ${contentType}/${directorySlug}`);
    } catch (err: any) {
      metadataJsonError = err;
      logger.warn(`Failed to parse metadata.json for ${contentType}/${directorySlug}: ${err.message}`);
    }
  }

  let MdxContent;
  // 2. Fallback to MDX export if metadata.json missing or malformed
  if (!metadata) {
    try {
      const mdxModule = await import(`@/content/${contentType}/${directorySlug}/page.mdx`);
      MdxContent = mdxModule.default;
      metadata = mdxModule.metadata as ExtendedMetadata | undefined;
      if (metadata) {
        logger.debug(`Loaded metadata from MDX export for ${contentType}/${directorySlug}`);
      }
    } catch (err: any) {
      logger.error(`Failed to import MDX for ${contentType}/${directorySlug}: ${err.message}`);
      return null;
    }
  } else {
    // If metadata.json succeeded, still need to import MDX for the default export
    try {
      const mdxModule = await import(`@/content/${contentType}/${directorySlug}/page.mdx`);
      MdxContent = mdxModule.default;
    } catch (err: any) {
      logger.error(`Failed to import MDX for ${contentType}/${directorySlug}: ${err.message}`);
      return null;
    }
  }

  if (!MdxContent) {
    logger.error(`No default export found in MDX for ${contentType}/${directorySlug}`);
    return null;
  }
  if (!metadata) {
    logger.error(`No metadata found for ${contentType}/${directorySlug} (neither metadata.json nor MDX export)`);
    return null;
  }

  return { MdxContent, metadata };
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
  const contentDir = path.join(contentDirectory, contentType);
  if (!fs.existsSync(contentDir)) {
    logger.debug(`Content directory does not exist for type: ${contentType}`);
    return [];
  }
  const slugs = fs.readdirSync(contentDir)
    .filter(item => {
      const itemPath = path.join(contentDir, item);
      const stat = fs.statSync(itemPath);
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
 * Uses the content slug to identify the purchase.
 * @param userIdOrEmail The user ID or email
 * @param directorySlug The directory name for the specific content item
 * @returns Whether the user has purchased the content.
 */
export async function hasUserPurchased(userIdOrEmail: string | null | undefined, directorySlug: string): Promise<boolean> {
  if (!userIdOrEmail) {
    logger.debug(`Purchase check: No user ID or email provided for ${directorySlug}`);
    return false;
  }

  const isEmail = typeof userIdOrEmail === 'string' && userIdOrEmail.includes('@');

  try {
    let purchase = null;

    // Prisma query looks for purchases matching the identifying information
    const whereCondition = {
      contentSlug: directorySlug, // contentSlug maps to the directory slug
      ...(isEmail ? { email: userIdOrEmail } : { userId: userIdOrEmail }),
    };

    logger.debug(`Checking purchase for ${isEmail ? 'email' : 'user ID'} '${userIdOrEmail}' on ${directorySlug}`);
    purchase = await prisma.purchase.findFirst({
      where: whereCondition,
    });

    // If purchase found, log details verbosely
    if (purchase) {
      logger.debug(`Purchase found: ID ${purchase.id}, content: ${purchase.contentSlug}, userEmail: ${purchase.email}, userId: ${purchase.userId}`);
    } else {
      logger.debug(`No purchase found for ${directorySlug} for user/email '${userIdOrEmail}'`);
    }

    return !!purchase;
  } catch (error: any) {
    logger.error(`[hasUserPurchased] Error checking purchase status for ${directorySlug}:`, error);
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
    case 'article':
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
  hasPurchased: boolean,
  isSubscribed: boolean
) {
  // Determine if we should show the full content
  const showFullContent =
    (!content.commerce?.isPaid && !content.commerce?.requiresEmail) ||
    hasPurchased ||
    (content.commerce?.requiresEmail && isSubscribed);

  // Get default paywall text based on content type
  const defaultText = getDefaultPaywallText(content.type);

  let paywallHeader = defaultText.header;
  let paywallBody = defaultText.body;

  if (content.commerce?.requiresEmail) {
    paywallHeader = content.commerce.paywallHeader || 'Sign in & subscribe to read for free';
    paywallBody = content.commerce.paywallBody || 'Sign in to zackproser.com and subscribe to unlock this content.';
  } else {
    paywallHeader = content.commerce?.paywallHeader || defaultText.header;
    paywallBody = content.commerce?.paywallBody || defaultText.body;
  }

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
      paywallHeader: paywallHeader,
      paywallBody: paywallBody,
      buttonText: content.commerce?.buttonText || defaultText.buttonText,
      requiresEmail: content.commerce?.requiresEmail,
      isSubscribed: isSubscribed,
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
    const contentTypes = ['blog', 'videos'];
    const allContentPromises = contentTypes.map(type => getAllContent(type));
    const allContent = (await Promise.all(allContentPromises)).flat();
    const purchasableContent = allContent.filter(content => content.commerce?.isPaid);
    logger.info(`Found ${purchasableContent.length} purchasable content items.`);
    return purchasableContent;
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
    const purchasableContent = await getAllPurchasableContent();
    const productContentPromises = purchasableContent.map(async content => {
      return generateProductFromArticle(content as Blog);
    });
    const productContent = await Promise.all(productContentPromises);
    const validProductItems = productContent.filter((p): p is ProductContent => p !== null);
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
  const contentTypes = ['blog', 'videos'];
  for (const contentType of contentTypes) {
    logger.debug(`Checking for product in ${contentType}/${directorySlug}`);
    const result = await getContentWithComponentByDirectorySlug(contentType, directorySlug);
    if (result && result.content.commerce?.isPaid) {
      logger.info(`Found product: ${contentType}/${directorySlug}`);
      const purchasableItem: Purchasable = {
        ...result.content,
        MdxContent: result.MdxContent,
      } as Purchasable;
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