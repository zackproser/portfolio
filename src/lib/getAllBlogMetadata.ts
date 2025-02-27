import fs from 'fs'
import path from 'path'
import { ExtendedMetadata } from '@/lib/shared-types'

/**
 * Gets metadata from all blog posts
 * @returns Array of blog post metadata
 */
export async function getAllBlogMetadata(): Promise<ExtendedMetadata[]> {
  const blogDir = path.join(process.cwd(), 'src/app/blog')
  
  // Get all directories in the blog folder (excluding [slug] and page.tsx)
  const slugs = fs.readdirSync(blogDir)
    .filter(item => {
      const itemPath = path.join(blogDir, item)
      return fs.statSync(itemPath).isDirectory() && item !== '[slug]'
    })
  
  // Load metadata from each blog post
  const metadataPromises = slugs.map(async (slug) => {
    try {
      // Check if the directory contains a page.mdx file
      const mdxPath = path.join(blogDir, slug, 'page.mdx')
      if (!fs.existsSync(mdxPath)) {
        // Skip directories without page.mdx files
        return null
      }
      
      // Dynamic import of the MDX file to get its metadata
      const mdxModule = await import(`@/app/blog/${slug}/page.mdx`)
      
      if (!mdxModule.metadata) {
        console.warn(`No metadata found for blog post: ${slug}`)
        return null
      }
      
      // Ensure the metadata has a slug (use the directory name if not provided)
      const metadata = mdxModule.metadata as ExtendedMetadata
      if (!metadata.slug) {
        metadata.slug = slug
      }
      
      return metadata
    } catch (error) {
      console.error(`Error loading metadata for ${slug}:`, error)
      return null
    }
  })
  
  // Wait for all metadata to be loaded
  const metadataResults = await Promise.all(metadataPromises)
  
  // Filter out null values and sort by date (newest first)
  return metadataResults
    .filter((metadata): metadata is ExtendedMetadata => metadata !== null)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
} 