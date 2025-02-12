import { ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'

export async function importNewsletter(
  articleFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`@/app/newsletter/${articleFilename}`)) as {
    default: React.ComponentType
    metadata: {
      title: string
      description: string
      author: string
      date: string
      image?: string
      status?: 'draft' | 'published' | 'archived'
    }
  }

  return {
    ...metadata,
    type: 'blog',
    slug: path.basename(articleFilename, '.mdx')
  }
}

export async function getAllNewsletters(): Promise<ArticleWithSlug[]> {
  const files = await glob('**/page.mdx', {
    cwd: path.join(process.cwd(), 'src/app/newsletter')
  })

  const newsletters = await Promise.all(
    files.map(async (filename) => {
      return importNewsletter(filename)
    })
  )

  return newsletters.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
