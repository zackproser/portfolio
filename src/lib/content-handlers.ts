import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { auth } from '../../auth'
import { sql } from '@vercel/postgres'
import { Session } from 'next-auth'
import glob from 'fast-glob'
import { Blog, ArticleWithSlug, ExtendedMetadata, Content } from './shared-types'

/**
 * Generate static params for content of a specific type
 * @param contentType The content type directory (e.g., 'blog', 'videos', 'learn/courses')
 * @returns Array of slug params for static generation
 */
export async function generateContentStaticParams(contentType: string) {
  const contentDir = path.join(process.cwd(), 'src/app', contentType)
  
  // Check if the directory exists
  if (!fs.existsSync(contentDir)) {
    console.warn(`Content directory not found: ${contentDir}`)
    return []
  }
  
  // Get all directories in the content folder (excluding [slug] and page.tsx)
  const slugs = fs.readdirSync(contentDir)
    .filter(item => {
      const itemPath = path.join(contentDir, item)
      return fs.statSync(itemPath).isDirectory() && item !== '[slug]'
    })
    .filter(slug => {
      // Only include directories that have a page.mdx file
      const mdxPath = path.join(contentDir, slug, 'page.mdx')
      return fs.existsSync(mdxPath)
    })
  
  return slugs.map(slug => ({ slug }))
}

/**
 * Import content from an MDX file
 * @param slug The content slug
 * @param contentType The content type directory (e.g., 'blog', 'videos', 'learn/courses')
 * @returns Content object with metadata
 */
export async function importContent(
  slug: string,
  contentType: string = 'blog'
): Promise<Content> {
  try {
    const imported = await import(
      `../app/${contentType}/${slug}/page.mdx`
    )
    
    // Get metadata from the MDX file
    const metadata = imported.metadata
  
    if (!metadata) {
      throw new Error(`No metadata found for ${contentType}/${slug}`)
    }
  
    // Ensure the slug is correctly formatted
    let formattedSlug = slug
    
    // Convert the metadata to Content type
    return {
      author: metadata.author || 'Unknown',
      date: metadata.date || new Date().toISOString(),
      title: typeof metadata.title === 'string' ? metadata.title : metadata.title?.default || 'Untitled',
      description: metadata.description || '',
      image: metadata.image,
      type: metadata.type || (
        contentType === 'blog' ? 'blog' : 
        contentType === 'videos' ? 'video' : 
        contentType === 'learn/courses' ? 'course' : 'blog'
      ),
      slug: formattedSlug,
      ...(metadata.commerce && { commerce: metadata.commerce }),
      ...(metadata.landing && { landing: metadata.landing }),
      ...(metadata.tags && { tags: metadata.tags })
    }
  } catch (error) {
    console.error(`Error importing content ${contentType}/${slug}:`, error)
    throw error
  }
}

/**
 * Import just the metadata from content
 * @param slug The content slug
 * @param contentType The content type directory
 * @returns Content object with metadata
 */
export async function importContentMetadata(
  slug: string,
  contentType: string = 'blog'
): Promise<Content> {
  return importContent(slug, contentType)
}

/**
 * Get a single content item by slug - direct import for performance
 * @param slug The content slug
 * @param contentType The content type directory
 * @returns Content object with slug
 */
export async function getContentBySlug(
  slug: string, 
  contentType: string = 'blog'
): Promise<Content | null> {
  try {
    return await importContent(slug, contentType)
  } catch (error) {
    console.error(`Error importing content ${contentType}/${slug}:`, error)
    return null
  }
}

/**
 * Get all content items of a specific type
 * @param contentType The content type directory
 * @returns Array of content items
 */
export async function getAllContent(contentType: string = 'blog'): Promise<Content[]> {
  try {
    const files = await glob(['**/page.mdx'], {
      cwd: path.join(process.cwd(), `src/app/${contentType}`),
    })
    
    const contentItems = await Promise.all(
      files.map(async (filename) => {
        try {
          const slug = path.dirname(filename)
          return await getContentBySlug(slug, contentType)
        } catch (error) {
          console.error(`Error importing content ${filename}:`, error)
          return null
        }
      })
    )
    
    // Filter out any null items and sort by date
    const validItems = contentItems.filter((item): item is Content => item !== null)
    validItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return validItems
  } catch (error) {
    console.error(`Error in getAllContent for ${contentType}:`, error)
    return []
  }
}

/**
 * Generate metadata for a content item
 * @param contentType The content type directory (e.g., 'blog', 'videos', 'learn/courses')
 * @param slug The content slug
 * @returns Metadata for the content
 */
export async function generateContentMetadata(contentType: string, slug: string): Promise<Metadata> {
  try {
    // Import the MDX file to get its metadata
    const mdxModule = await import(`@/app/${contentType}/${slug}/page.mdx`)
    
    // Make a copy of the metadata to avoid modifying the original
    const metadata = mdxModule.metadata ? { ...mdxModule.metadata } : {}
    
    // Ensure the slug is correctly formatted (without content type prefix)
    if (metadata.slug) {
      // Remove any leading slashes
      let formattedSlug = metadata.slug.replace(/^\/+/, '')
      
      // Remove content type prefix if it exists (e.g., 'blog/' from 'blog/my-post')
      if (formattedSlug.startsWith(`${contentType}/`)) {
        formattedSlug = formattedSlug.substring(contentType.length + 1)
      }
      
      // Update the slug in the metadata
      metadata.slug = formattedSlug
    }
    
    return metadata
  } catch (error) {
    console.error(`Error loading metadata for ${contentType}/${slug}:`, error)
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
  if (!userId) return false
  
  try {
    // Check if the user has purchased this content
    const { rows } = await sql`
      SELECT * FROM purchases 
      WHERE user_id = ${userId} AND content_slug = ${slug}
    `
    return rows.length > 0
  } catch (error) {
    console.error('Error checking purchase status:', error)
    return false
  }
}

/**
 * Get the default paywall text for a content type
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
 * Check if the MDX file exists for a content item
 * @param contentType The content type directory
 * @param slug The content slug
 * @returns Whether the MDX file exists
 */
export function contentExists(contentType: string, slug: string): boolean {
  const mdxPath = path.join(process.cwd(), 'src/app', contentType, slug, 'page.mdx')
  return fs.existsSync(mdxPath)
}

/**
 * Load content and handle authentication and paywall
 * @param contentType The content type directory
 * @param slug The content slug
 * @returns The content component with appropriate paywall if needed
 */
export async function loadContent(contentType: string, slug: string) {
  try {
    // Check if the MDX file exists
    if (!contentExists(contentType, slug)) {
      console.error(`Content does not exist: ${contentType}/${slug}`)
      return notFound()
    }
    
    // Dynamically import the MDX content
    console.log(`Attempting to import: @/app/${contentType}/${slug}/page.mdx`)
    
    try {
      const mdxModule = await import(`@/app/${contentType}/${slug}/page.mdx`)
      const MdxContent = mdxModule.default
      const metadata = mdxModule.metadata

      if (!MdxContent) {
        console.error(`No default export found in ${contentType}/${slug}/page.mdx`)
        return null
      }

      if (!metadata) {
        console.error(`No metadata export found in ${contentType}/${slug}/page.mdx`)
      }
      
      console.log(`Successfully loaded content ${contentType}/${slug}`)
      return { MdxContent, metadata }
    } catch (importError) {
      console.error(`Import error for ${contentType}/${slug}:`, importError)
      // Instead of calling notFound() immediately, return null and let the caller decide
      return null
    }
  } catch (error) {
    console.error(`Error loading content ${contentType}/${slug}:`, error)
    return null
  }
} 