import dynamic from 'next/dynamic'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { ExtendedMetadata, Content, Blog, isPurchasable, Purchasable, BlogWithSlug, ProductContent } from '@/types'
import React from 'react'
import { sql } from '@vercel/postgres'
import { generateProductFromArticle, generateProductFromCourse } from './productGenerator'

// Directory where content is stored
const contentDirectory = path.join(process.cwd(), 'src/content')

/**
 * Get all slugs for a content type
 * @param contentType The content type directory (e.g., 'blog', 'videos')
 * @returns Array of slugs
 */
export function getContentSlugs(contentType: string) {
  const contentDir = path.join(contentDirectory, contentType)
  
  if (!fs.existsSync(contentDir)) {
    console.log(`Content directory does not exist: ${contentDir}`)
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
  
  console.log(`Found ${slugs.length} total slugs for ${contentType} in content directory`);
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
    console.log(`Content found: ${contentType}/${slug}`)
  } else {
    console.log(`Content not found: ${contentType}/${slug}`)
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
      console.log(`Content not found: ${contentType}/${slug}`)
      return null
    }
    
    //console.log(`Loading content: ${contentType}/${slug}`)
    // Dynamically import the MDX content
    const mdxModule = await import(`@/content/${contentType}/${slug}/page.mdx`)
    const MdxContent = mdxModule.default
    const metadata = mdxModule.metadata

    if (!MdxContent) {
      console.log(`No MDX content found for: ${contentType}/${slug}`)
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
 * @returns Array of content items
 */
export async function getAllContent(contentType: string = 'blog'): Promise<Content[]> {
  try {
    console.log(`Getting all content for type: ${contentType}`)
    const slugs = getContentSlugs(contentType)
    
    const contentItemsPromises = slugs.map(async (slug) => {
      try {
        const result = await loadContent(contentType, slug)
        if (!result) return null
        
        const { metadata } = result
        
        // Process metadata to ensure consistent slug and ID generation
        let processedMetadata = { ...metadata } as ExtendedMetadata
        
        // Ensure the metadata has a slug (use the directory name if not provided)
        if (!processedMetadata.slug || processedMetadata.slug === 'untitled') {
          //console.log(`No valid slug in metadata for ${slug}, using directory name`)
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
        
        return {
          author: processedMetadata.author || 'Unknown',
          date: processedMetadata.date || new Date().toISOString(),
          title: typeof processedMetadata.title === 'string' ? processedMetadata.title : (processedMetadata.title as any)?.default || 'Untitled',
          description: processedMetadata.description || '',
          image: processedMetadata.image || '',  // Ensure image is always a string, even if empty
          type: processedMetadata.type,
          slug: `/${typePath}/${processedMetadata.slug}`,  // Include the full path in the slug
          _id: processedMetadata._id,
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
    const validItems = contentItems.filter((item): item is Content => 
      item !== null && typeof item === 'object'
    )
    
    // Sort by date, with proper null checks
    validItems.sort((a, b) => {
      const dateA = a?.date ? new Date(a.date).getTime() : 0
      const dateB = b?.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
    
    console.log(`Returning ${validItems.length} valid content items for ${contentType}`)
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
 * @param userId The user ID
 * @param slug The content slug
 * @returns Whether the user has purchased the content
 */
export async function hasUserPurchased(userId: string | null | undefined, slug: string): Promise<boolean> {
  console.log(`[hasUserPurchased] userId: ${userId}, slug: ${slug}`)

  if (!userId) {
    console.log(`[hasUserPurchased] No userId provided, returning false`)
    return false
  }
  console.log(`[hasUserPurchased] Checking purchase status for userId: ${userId}, slug: ${slug}`)
  
  try {
    const { rows } = await sql`
      SELECT * FROM articlepurchases 
      WHERE user_id = ${userId} AND article_slug = ${slug}
    `
    console.log(`[hasUserPurchased] Query result: ${JSON.stringify(rows)}`)
    return rows.length > 0
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
      console.log(`Content not found or failed to load: ${contentType}/${slug}`)
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
      console.log(`Content not found: ${contentType}/${slug}`)
      return null
    }
    
    //console.log(`Loading metadata: ${contentType}/${slug}`)
    // Dynamically import the MDX content
    const mdxModule = await import(`@/content/${contentType}/${slug}/page.mdx`)
    const metadata = mdxModule.metadata

    if (!metadata) {
      console.log(`No metadata found for: ${contentType}/${slug}`)
      return null
    }
    
    // Process metadata to ensure consistent slug and ID generation
    let processedMetadata = { ...metadata } as ExtendedMetadata
    
    // Ensure the metadata has a slug (use the directory name if not provided)
    if (!processedMetadata.slug || processedMetadata.slug === 'untitled') {
      //console.log(`No valid slug in metadata for ${slug}, using directory name`)
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
      getAllContent('blog'),
      getAllContent('learn/courses'),
      getAllContent('videos')
    ]).then(results => results.flat());
    
    // Filter to only paid content
    const paidContent = allContent.filter(content => content.commerce?.isPaid);
    
    // Transform to product content
    const productContent = paidContent.map(content => {
      if (content.type === 'course') {
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
  const allContent = await Promise.all([
    getAllContent('blog'),
    getAllContent('learn/courses'),
    getAllContent('videos')
  ]).then(results => results.flat());
  
  return allContent.filter((content) => 
    content.type !== 'demo' && isPurchasable(content)
  );
}

/**
 * Get a product by its slug
 * @param slug The product slug
 * @returns The product content or null if not found
 */
export async function getProductBySlug(slug: string): Promise<Purchasable | null> {
  // Try to find the content in any content type
  for (const contentType of ['blog', 'learn/courses', 'videos']) {
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