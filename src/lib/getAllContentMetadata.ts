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
  
  // Check both app directory and content directory
  const appDir = path.join(process.cwd(), 'src/app', contentType)
  const contentDir = path.join(process.cwd(), 'src/content', contentType)
  
  // Get all directories in both content folders
  const appItems = fs.existsSync(appDir) ? fs.readdirSync(appDir) : []
  const contentItems = fs.existsSync(contentDir) ? fs.readdirSync(contentDir) : []
  
  console.log(`Found ${appItems.length} items in app/${contentType} and ${contentItems.length} items in content/${contentType}`)
  
  // Process app directory slugs
  const appSlugs = appItems
    .filter(item => {
      const itemPath = path.join(appDir, item)
      const isDirectory = fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory()
      const isNotSlugDir = item !== '[slug]'
      return isDirectory && isNotSlugDir
    })
    .filter(slug => {
      // Only include directories that have a page.mdx file
      const mdxPath = path.join(appDir, slug, 'page.mdx')
      const hasMdxFile = fs.existsSync(mdxPath)
      if (!hasMdxFile) {
        console.log(`Skipping app/${contentType}/${slug} - no page.mdx file found`)
      }
      return hasMdxFile
    })
  
  // Process content directory slugs
  const contentSlugs = contentItems
    .filter(item => {
      const itemPath = path.join(contentDir, item)
      const isDirectory = fs.existsSync(itemPath) && fs.statSync(itemPath).isDirectory()
      return isDirectory
    })
    .filter(slug => {
      // Only include directories that have a page.mdx file
      const mdxPath = path.join(contentDir, slug, 'page.mdx')
      const hasMdxFile = fs.existsSync(mdxPath)
      if (!hasMdxFile) {
        console.log(`Skipping content/${contentType}/${slug} - no page.mdx file found`)
      }
      return hasMdxFile
    })
  
  console.log(`Found ${appSlugs.length} valid app directories and ${contentSlugs.length} valid content directories with page.mdx files`)
  
  // Load metadata from app directory
  const appMetadataPromises = appSlugs.map(async (slug) => {
    try {
      console.log(`Loading metadata for app/${contentType}/${slug}`)
      const mdxPath = path.join(appDir, slug, 'page.mdx')
      
      // Check file size to avoid issues with large files
      const stats = fs.statSync(mdxPath)
      if (stats.size > 1024 * 1024) { // 1MB limit
        console.warn(`Skipping large file (${Math.round(stats.size/1024)}KB): app/${contentType}/${slug}`)
        return null
      }
      
      try {
        const mdxModule = await import(`@/app/${contentType}/${slug}/page.mdx`)
        
        if (!mdxModule.metadata) {
          console.warn(`No metadata found for content: app/${contentType}/${slug}`)
          return null
        }
        
        // Process metadata
        const metadata = processMetadata(mdxModule.metadata, contentType, slug)
        console.log(`Successfully loaded metadata for app/${contentType}/${slug}`)
        return metadata
      } catch (importError) {
        console.error(`Import error for app/${contentType}/${slug}:`, importError)
        return null
      }
    } catch (error) {
      console.error(`Error loading metadata for app/${contentType}/${slug}:`, error)
      return null
    }
  })
  
  // Load metadata from content directory
  const contentMetadataPromises = contentSlugs.map(async (slug) => {
    try {
      console.log(`Loading metadata for content/${contentType}/${slug}`)
      const mdxPath = path.join(contentDir, slug, 'page.mdx')
      
      // Check file size to avoid issues with large files
      const stats = fs.statSync(mdxPath)
      if (stats.size > 1024 * 1024) { // 1MB limit
        console.warn(`Skipping large file (${Math.round(stats.size/1024)}KB): content/${contentType}/${slug}`)
        return null
      }
      
      try {
        const mdxModule = await import(`@/content/${contentType}/${slug}/page.mdx`)
        
        if (!mdxModule.metadata) {
          console.warn(`No metadata found for content: content/${contentType}/${slug}`)
          return null
        }
        
        // Process metadata
        const metadata = processMetadata(mdxModule.metadata, contentType, slug)
        console.log(`Successfully loaded metadata for content/${contentType}/${slug}`)
        return metadata
      } catch (importError) {
        console.error(`Import error for content/${contentType}/${slug}:`, importError)
        return null
      }
    } catch (error) {
      console.error(`Error loading metadata for content/${contentType}/${slug}:`, error)
      return null
    }
  })
  
  // Wait for all metadata to be loaded
  const appMetadataResults = await Promise.all(appMetadataPromises)
  const contentMetadataResults = await Promise.all(contentMetadataPromises)
  
  // Combine results
  const allMetadataResults = [...appMetadataResults, ...contentMetadataResults]
  
  // Filter out null values and sort by date (newest first)
  const validResults = allMetadataResults
    .filter((metadata): metadata is ExtendedMetadata => metadata !== null)
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return dateB - dateA
    })
  
  console.log(`Returning ${validResults.length} valid metadata items for ${contentType}`)
  return validResults
}

/**
 * Helper function to process metadata
 */
function processMetadata(metadata: any, contentType: string, slug: string): ExtendedMetadata | null {
  if (!metadata) return null
  
  // Ensure the metadata has a slug (use the directory name if not provided)
  const processedMetadata = { ...metadata } as ExtendedMetadata
  
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
    console.log(`Normalized slug for ${contentType}/${slug}: ${processedMetadata.slug}`)
  }
  
  // Add a unique ID to prevent duplicate key issues
  processedMetadata._id = `${contentType}-${slug}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
  
  // Ensure the type is set correctly
  processedMetadata.type = processedMetadata.type || (
    contentType === 'blog' ? 'blog' : 
    contentType === 'videos' ? 'video' : 
    contentType === 'learn/courses' ? 'course' : 'blog'
  )
  
  return processedMetadata
} 