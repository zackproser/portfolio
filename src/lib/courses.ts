import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'

async function importArticle(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { meta } = (await import(`../app/learn/courses/${articleFilename}`)) as {
    default: React.ComponentType
    meta: Article
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    ...meta,
  }
}

export async function getAllCourses() {
  let articleFilenames = await glob('*/page.mdx', {
    cwd: './src/app/learn/courses',
  })

  console.log(`getAllCourses: ${articleFilenames}`)

  let articles = await Promise.all(articleFilenames.map(importArticle))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
