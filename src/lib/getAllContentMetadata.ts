import fs from 'fs'
import path from 'path'
import { ExtendedMetadata } from '@/lib/shared-types'

/**
 * Gets metadata from all content of a specific type
 * @param contentType The type of content to get metadata for (e.g., 'blog', 'videos', 'learn/courses')
 * @returns Array of content metadata
 */
export async function getAllContentMetadata(contentType: string): Promise<ExtendedMetadata[]> {
  console.log(`Getting metadata for content type: ${contentType}`)
  const contentDir = path.join(process.cwd(), 'src/app', contentType)
  
  // Check if the directory exists
  if (!fs.existsSync(contentDir)) {
    console.warn(`Content directory not found: ${contentDir}`)
    return []
  }
  
  // Get all directories in the content folder (excluding [slug] and page.tsx)
  const allItems = fs.readdirSync(contentDir)
  console.log(`Found ${allItems.length} total items in ${contentDir}`)
  
  const slugs = allItems
    .filter(item => {
      const itemPath = path.join(contentDir, item)
      const isDirectory = fs.statSync(itemPath).isDirectory()
      const isNotSlugDir = item !== '[slug]'
      return isDirectory && isNotSlugDir
    })
    .filter(slug => {
      // Only include directories that have a page.mdx file
      const mdxPath = path.join(contentDir, slug, 'page.mdx')
      const hasMdxFile = fs.existsSync(mdxPath)
      if (!hasMdxFile) {
        console.log(`Skipping ${slug} - no page.mdx file found`)
      }
      return hasMdxFile
    })
  
  console.log(`Found ${slugs.length} valid content directories with page.mdx files`)
  
  // Load metadata from each content item
  const metadataPromises = slugs.map(async (slug) => {
    try {
      console.log(`Loading metadata for ${contentType}/${slug}`)
      // Dynamic import of the MDX file to get its metadata
      const mdxModule = await import(`@/app/${contentType}/${slug}/page.mdx`)
      
      if (!mdxModule.metadata) {
        console.warn(`No metadata found for content: ${contentType}/${slug}`)
        return null
      }
      
      // Ensure the metadata has a slug (use the directory name if not provided)
      const metadata = mdxModule.metadata as ExtendedMetadata
      if (!metadata.slug) {
        console.log(`No slug in metadata for ${slug}, using directory name`)
        metadata.slug = slug
      }
      
      // Add a unique ID to prevent duplicate key issues
      metadata._id = `${contentType}-${slug}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      
      console.log(`Successfully loaded metadata for ${contentType}/${slug}`)
      return metadata
    } catch (error) {
      console.error(`Error loading metadata for ${contentType}/${slug}:`, error)
      return null
    }
  })
  
  // Wait for all metadata to be loaded
  const metadataResults = await Promise.all(metadataPromises)
  
  // Filter out null values and sort by date (newest first)
  const validResults = metadataResults
    .filter((metadata): metadata is ExtendedMetadata => metadata !== null)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  
  console.log(`Returning ${validResults.length} valid metadata items for ${contentType}`)
  return validResults
} 