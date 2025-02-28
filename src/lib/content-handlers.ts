import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { Session } from 'next-auth'
import { ExtendedMetadata, Content } from './shared-types'
import Paywall from '@/components/Paywall'
import React from 'react'
import { sql } from '@vercel/postgres'

// Directories where content is stored
const appContentDirectory = path.join(process.cwd(), 'src/app')
const newContentDirectory = path.join(process.cwd(), 'src/content')

/**
 * Get all slugs for a content type
 * @param contentType The content type directory (e.g., 'blog', 'videos')
 * @returns Array of slugs
 */
export function getContentSlugs(contentType: string) {
  // Check in app directory first
  const appDir = path.join(appContentDirectory, contentType)
  const appSlugs = fs.existsSync(appDir) 
    ? fs.readdirSync(appDir)
        .filter(item => {
          const itemPath = path.join(appDir, item)
          return fs.statSync(itemPath).isDirectory() && item !== '[slug]'
        })
        .filter(slug => {
          // Only include directories that have a page.mdx file
          const mdxPath = path.join(appDir, slug, 'page.mdx')
          return fs.existsSync(mdxPath)
        })
    : [];
  
  // Check in new content directory
  const contentDir = path.join(newContentDirectory, contentType)
  const contentSlugs = fs.existsSync(contentDir)
    ? fs.readdirSync(contentDir)
        .filter(item => {
          const itemPath = path.join(contentDir, item)
          return fs.statSync(itemPath).isDirectory()
        })
        .filter(slug => {
          // Only include directories that have a page.mdx file
          const mdxPath = path.join(contentDir, slug, 'page.mdx')
          return fs.existsSync(mdxPath)
        })
    : [];
  
  // Combine and deduplicate slugs
  const allSlugs = [...new Set([...appSlugs, ...contentSlugs])];
  console.log(`Found ${allSlugs.length} total slugs for ${contentType} (${appSlugs.length} in app dir, ${contentSlugs.length} in content dir)`);
  
  return allSlugs;
}

/**
 * Check if content exists
 * @param contentType The content type directory
 * @param slug The content slug
 * @returns Whether the content exists
 */
export function contentExists(contentType: string, slug: string): boolean {
  // Check in app directory first
  const appMdxPath = path.join(appContentDirectory, contentType, slug, 'page.mdx')
  const existsInApp = fs.existsSync(appMdxPath)
  
  // If not in app directory, check in content directory
  if (!existsInApp) {
    const contentMdxPath = path.join(newContentDirectory, contentType, slug, 'page.mdx')
    const existsInContent = fs.existsSync(contentMdxPath)
    
    if (existsInContent) {
      console.log(`Content found in new content directory: ${contentType}/${slug}`)
      return true
    }
    
    console.log(`Content not found in either directory: ${contentType}/${slug}`)
    return false
  }
  
  console.log(`Content found in app directory: ${contentType}/${slug}`)
  return true
}

/**
 * Load content by slug
 * @param contentType The content type directory
 * @param slug The content slug
 * @returns The content component and metadata
 */
export async function loadContent(contentType: string, slug: string) {
  try {
    // Check if the MDX file exists in app directory
    const appMdxPath = path.join(appContentDirectory, contentType, slug, 'page.mdx')
    const existsInApp = fs.existsSync(appMdxPath)
    
    // Check if the MDX file exists in content directory
    const contentMdxPath = path.join(newContentDirectory, contentType, slug, 'page.mdx')
    const existsInContent = fs.existsSync(contentMdxPath)
    
    if (!existsInApp && !existsInContent) {
      console.log(`Content not found in either directory: ${contentType}/${slug}`)
      return null
    }
    
    let MdxContent, metadata;
    
    if (existsInApp) {
      console.log(`Loading content from app directory: ${contentType}/${slug}`)
      // Dynamically import the MDX content from app directory
      const mdxModule = await import(`@/app/${contentType}/${slug}/page.mdx`)
      MdxContent = mdxModule.default
      metadata = mdxModule.metadata
    } else {
      console.log(`Loading content from content directory: ${contentType}/${slug}`)
      // Dynamically import the MDX content from content directory
      const mdxModule = await import(`@/content/${contentType}/${slug}/page.mdx`)
      MdxContent = mdxModule.default
      metadata = mdxModule.metadata
    }

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
        if (!processedMetadata.slug) {
          console.log(`No slug in metadata for ${slug}, using directory name`)
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
        
        return {
          author: processedMetadata.author || 'Unknown',
          date: processedMetadata.date || new Date().toISOString(),
          title: typeof processedMetadata.title === 'string' ? processedMetadata.title : (processedMetadata.title as any)?.default || 'Untitled',
          description: processedMetadata.description || '',
          image: processedMetadata.image || '',  // Ensure image is always a string, even if empty
          type: processedMetadata.type,
          slug: processedMetadata.slug,
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
 * @param session The user session (if available)
 * @param hasPurchased Whether the user has purchased the content
 * @returns The rendered content with appropriate paywall if needed
 */
export function renderContent(
  MdxContent: React.ComponentType,
  metadata: ExtendedMetadata,
  session: Session | null,
  hasPurchased: boolean
) {
  // If content is not paid or user has purchased, render full content
  if (!metadata.commerce?.isPaid || hasPurchased) {
    return React.createElement(MdxContent);
  }

  // For paid content that user hasn't purchased, show preview with paywall
  const defaultText = getDefaultPaywallText(metadata.type || 'blog');
  
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(MdxContent),
    React.createElement(Paywall, {
      price: metadata.commerce.price,
      slug: metadata.slug || '',
      title: typeof metadata.title === 'string' 
        ? metadata.title 
        : (metadata.title as any)?.default || 'Untitled',
      paywallHeader: metadata.commerce.paywallHeader || defaultText.header,
      paywallBody: metadata.commerce.paywallBody || defaultText.body,
      buttonText: metadata.commerce.buttonText || defaultText.buttonText,
      image: metadata.commerce.paywallImage,
      imageAlt: metadata.commerce.paywallImageAlt
    })
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
    // Just directly try to load the content - the loadContent function already handles
    // checking if the file exists and returns null if it doesn't
    const result = await loadContent(contentType, slug)
    if (!result) {
      console.log(`Content not found or failed to load: ${contentType}/${slug}`)
      return null
    }
    
    const { MdxContent, metadata } = result
    
    return {
      MdxContent,
      metadata: {
        ...metadata,
        slug,
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
    // Check if the MDX file exists in app directory
    const appMdxPath = path.join(appContentDirectory, contentType, slug, 'page.mdx')
    const existsInApp = fs.existsSync(appMdxPath)
    
    // Check if the MDX file exists in content directory
    const contentMdxPath = path.join(newContentDirectory, contentType, slug, 'page.mdx')
    const existsInContent = fs.existsSync(contentMdxPath)
    
    if (!existsInApp && !existsInContent) {
      console.log(`Content not found in either directory: ${contentType}/${slug}`)
      return null
    }
    
    let metadata;
    
    if (existsInApp) {
      console.log(`Loading metadata from app directory: ${contentType}/${slug}`)
      // Dynamically import the MDX content from app directory
      const mdxModule = await import(`@/app/${contentType}/${slug}/page.mdx`)
      metadata = mdxModule.metadata
    } else {
      console.log(`Loading metadata from content directory: ${contentType}/${slug}`)
      // Dynamically import the MDX content from content directory
      const mdxModule = await import(`@/content/${contentType}/${slug}/page.mdx`)
      metadata = mdxModule.metadata
    }

    if (!metadata) {
      console.log(`No metadata found for: ${contentType}/${slug}`)
      return null
    }
    
    // Process metadata to ensure consistent slug and ID generation
    let processedMetadata = { ...metadata } as ExtendedMetadata
    
    // Ensure the metadata has a slug (use the directory name if not provided)
    if (!processedMetadata.slug) {
      console.log(`No slug in metadata for ${slug}, using directory name`)
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