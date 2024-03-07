import { Article, ArticleWithSlug } from './shared-types'

import glob from 'fast-glob'

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`../app/newsletter/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    type: 'newsletter',
    ...metadata,
  }
}

export async function getAllNewsletters() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/newsletter',
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
