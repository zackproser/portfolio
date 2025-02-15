import { headers } from 'next/headers'

/**
 * Gets the slug from the current URL path
 * Example: /blog/rag-pipeline-tutorial -> rag-pipeline-tutorial
 */
export async function getSlugFromPath() {
  try {
    // Get the current path from headers
    const headersList = await headers()
    const pathname = headersList.get('x-invoke-path') || ''
    
    // Split the path and get the last non-empty segment
    const segments = pathname.split('/').filter(Boolean)
    return segments[segments.length - 1] || null
  } catch (error) {
    console.warn('Could not determine slug from headers:', error)
    return null
  }
} 