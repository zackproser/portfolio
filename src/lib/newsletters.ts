import { BaseArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'

export async function importNewsletter(
  articleFilename: string,
): Promise<BaseArticleWithSlug> {
  let { metadata } = (await import(`@/app/newsletter/${articleFilename}`)) as {
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
    slug: articleFilename.replace(/(\/page)?\.mdx$/, ''),
    type: 'newsletter',
    ...metadata,
  }
}

export async function getAllNewsletters() {
  let newsletterFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'newsletter'),
  })

  let newsletters = await Promise.all(newsletterFilenames.map(importNewsletter))

  return newsletters.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
