import { Article, ArticleWithSlug } from './shared-types'

import glob from 'fast-glob'

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { meta } = (await import(`../app/videos/${articleFilename}`)) as {
    default: React.ComponentType
    meta: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    type: 'video',
    ...meta,
  }
}

export async function getAllVideos() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/videos',
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
