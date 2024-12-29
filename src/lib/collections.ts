import { BaseArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'

export async function importCollection(
  articleFilename: string,
): Promise<BaseArticleWithSlug> {
  let { metadata } = (await import(`@/app/collections/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: {
      title: string
      description: string
      author: string
      date: string
      image?: string
      status?: string
    }
  }

  return {
    slug: articleFilename.replace(/(\/page)?\.jsx$/, ''),
    type: 'collection',
    ...metadata,
  }
}

export async function getAllCollections() {
  let articleFilenames = await glob('*/page.jsx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'collections'),
  })

  let articles = await Promise.all(articleFilenames.map(importCollection))

  return articles.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
