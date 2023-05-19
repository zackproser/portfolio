import glob from 'fast-glob'
import * as path from 'path'

async function importArticle(articleFilename) {
  let { meta, default: component } = await import(
    `../pages/blog/${articleFilename}`
  )
  return {
    slug: articleFilename.replace(/(\/index)?\.mdx$/, ''),
    ...meta,
    component,
  }
}

export async function getAllArticles() {
  // Get all .mdx files in the pages directory and convert each to a blog article
  let articleFilenames = await glob(['*.mdx', '*/index.mdx'], {
    cwd: path.join(process.cwd(), 'src/pages/blog/'),
  })

  let articles = await Promise.all(articleFilenames.map(importArticle))

  // Sort articles by date in descending order
  return articles.sort((a, z) => new Date(z.date) - new Date(a.date))
}
