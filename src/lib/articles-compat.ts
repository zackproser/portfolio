import { Blog, ArticleWithSlug, ExtendedMetadata } from './shared-types'
import path from 'path'
import glob from 'fast-glob'

// Import an article from an MDX file
export async function importArticle(
  filename: string,
  baseDir: string = 'blog'
): Promise<Blog> {
  // Remove the page.mdx from the filename to get the directory name
  const dirName = filename.replace('/page.mdx', '')
  // Get the slug from the directory name
  const slug = dirName
  
  try {
    const imported = await import(
      `../app/${baseDir}/${dirName}/page.mdx`
    )
    
    // Get metadata from the MDX file
    const metadata = imported.metadata
  
    if (!metadata) {
      throw new Error(`No metadata found in ${filename}`)
    }
  
    // Convert the extended metadata to Blog type
    return {
      author: metadata.author || 'Unknown',
      date: metadata.date || new Date().toISOString(),
      title: typeof metadata.title === 'string' ? metadata.title : metadata.title?.default || 'Untitled',
      description: metadata.description || '',
      image: metadata.image,
      type: metadata.type || 'blog',
      slug,
      ...(metadata.commerce && { commerce: metadata.commerce }),
      ...(metadata.landing && { landing: metadata.landing })
    }
  } catch (error) {
    console.error(`Error importing article ${filename}:`, error)
    throw error
  }
}

// Import just the metadata from an article
export async function importArticleMetadata(
  filename: string,
  baseDir: string = 'blog'
): Promise<Blog> {
  return importArticle(filename, baseDir)
}

// Get a single article by slug - direct import for performance
export async function getArticleBySlug(slug: string): Promise<ArticleWithSlug | null> {
  try {
    const imported = await import(`../app/blog/${slug}/page.mdx`)
    const metadata = imported.metadata
    
    if (!metadata) {
      throw new Error(`No metadata found for slug ${slug}`)
    }
    
    // Create an ArticleWithSlug object directly without using the Article class
    const article: ArticleWithSlug = {
      author: metadata.author || 'Unknown',
      date: metadata.date || new Date().toISOString(),
      title: typeof metadata.title === 'string' ? metadata.title : metadata.title?.default || 'Untitled',
      description: metadata.description || '',
      image: metadata.image,
      type: metadata.type || 'blog',
      slug,
      ...(metadata.commerce && { commerce: metadata.commerce }),
      ...(metadata.landing && { landing: metadata.landing })
    }
    
    return article
  } catch (error) {
    console.error(`Error importing article ${slug}:`, error)
    return null
  }
}

// Get all articles
export async function getAllArticles(): Promise<ArticleWithSlug[]> {
  try {
    const files = await glob(['**/page.mdx'], {
      cwd: path.join(process.cwd(), 'src/app/blog'),
    })
    
    const articles = await Promise.all(
      files.map(async (filename) => {
        try {
          const slug = path.dirname(filename)
          return await getArticleBySlug(slug)
        } catch (error) {
          console.error(`Error importing article ${filename}:`, error)
          return null
        }
      })
    )
    
    // Filter out any null articles and sort by date
    const validArticles = articles.filter((article): article is ArticleWithSlug => article !== null)
    validArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    return validArticles
  } catch (error) {
    console.error('Error in getAllArticles:', error)
    return []
  }
} 