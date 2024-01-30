import { type Article, type ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'

async function importArticle (
  articleFilename: string
): Promise<ArticleWithSlug> {
  const { meta } = (await import(`../app/blog/${articleFilename}`)) as {
    default: React.ComponentType
    meta: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...meta
  }
}

export async function getAllArticles () {
  const articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/blog'
  })

  const articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
