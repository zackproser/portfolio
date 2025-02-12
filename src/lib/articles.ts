import { Article } from './shared-types'
import path from 'path'
import glob from 'fast-glob'

// Import an article from an MDX file
export async function importArticle(
  articleFilename: string,
  rootPath: string = 'blog'
): Promise<Article> {
  const importedData = await import(`@/app/${rootPath}/${articleFilename}`) as {
    metadata: {
      title: string
      description: string
      author: string
      date: string
      image?: string
      status?: 'draft' | 'published' | 'archived'
      isPaid?: boolean
      price?: number
      stripe_price_id?: string
      previewLength?: number
      paywallHeader?: string
      paywallBody?: string
      buttonText?: string
      landing?: Article['landing']
    }
  }

  // Convert Next.js metadata to our Article type
  const normalizedMetadata: Article = {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    title: importedData.metadata.title,
    description: importedData.metadata.description,
    author: importedData.metadata.author,
    date: importedData.metadata.date,
    image: importedData.metadata.image,
    status: importedData.metadata.status || 'published',
    type: rootPath === 'blog' ? 'blog' : 
          rootPath === 'tutorials' ? 'tutorial' : 'course',
    // Add commerce fields if this is a paid article
    ...(importedData.metadata.isPaid && {
      commerce: {
        isPaid: true,
        price: importedData.metadata.price || 0,
        stripe_price_id: importedData.metadata.stripe_price_id,
        previewLength: importedData.metadata.previewLength,
        paywallHeader: importedData.metadata.paywallHeader,
        paywallBody: importedData.metadata.paywallBody,
        buttonText: importedData.metadata.buttonText
      }
    }),
    // Add landing page fields if present
    ...(importedData.metadata.landing && {
      landing: importedData.metadata.landing
    })
  }

  return normalizedMetadata
}

// Import just the metadata from an article
export async function importArticleMetadata(
  articleFilename: string,
  rootPath: string = 'blog'
): Promise<Article> {
  return importArticle(articleFilename, rootPath)
}

// Get all articles, optionally filtered by slug
export async function getAllArticles(matchingSlugs?: string[]): Promise<Article[]> {
  // Get blog articles
  let blogFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'blog')
  })

  // Get tutorial articles
  let tutorialFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'tutorials')
  })

  // Map blog articles
  let blogArticles = await Promise.all(blogFilenames.map(filename =>
    importArticle(filename, 'blog')
  ))

  // Map tutorial articles
  let tutorialArticles = await Promise.all(tutorialFilenames.map(filename =>
    importArticle(filename, 'tutorials')
  ))

  let articles = [...blogArticles, ...tutorialArticles]

  // Filter by slug if provided
  if (matchingSlugs) {
    articles = articles.filter(article => matchingSlugs.includes(article.slug))
  }

  // Sort by date descending
  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
