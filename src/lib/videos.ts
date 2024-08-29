import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`../app/videos/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    type: 'video',
    ...metadata,
  }
}

// Extend getAllVideos to accept an optional array of slugs
export async function getAllVideos(matchingSlugs?: string[]) {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'videos'),
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  // Filter articles to include only those whose slug is in matchingSlugs
  if (matchingSlugs && matchingSlugs.length > 0) {
    articles = articles.filter(article => matchingSlugs.includes(article.slug))
  }

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
