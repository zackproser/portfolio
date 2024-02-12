import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`../app/blog/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...metadata,
  }
}

export async function getAllArticles() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/blog',
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
