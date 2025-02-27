import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import { auth } from '../../auth'
import { sql } from '@vercel/postgres'
import { Session } from 'next-auth'

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
 * Generate metadata for a content item
 * @param contentType The content type directory (e.g., 'blog', 'videos', 'learn/courses')
 * @param slug The content slug
 * @returns Metadata for the content
 */
export async function generateContentMetadata(contentType: string, slug: string): Promise<Metadata> {
  try {
    // Import the MDX file to get its metadata
    const mdxModule = await import(`@/app/${contentType}/${slug}/page.mdx`)
    return mdxModule.metadata || {}
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
      return notFound()
    }
    
    // Dynamically import the MDX content
    const mdxModule = await import(`@/app/${contentType}/${slug}/page.mdx`)
    const MdxContent = mdxModule.default
    const metadata = mdxModule.metadata
    
    return { MdxContent, metadata }
  } catch (error) {
    console.error(`Error loading content ${contentType}/${slug}:`, error)
    return notFound()
  }
} 