import fs from 'fs'
import path from 'path'
import glob from 'fast-glob'
import { Article, ArticleWithSlug } from './shared-types'

const contentDirectory = path.join(process.cwd(), 'src/content')

async function importContent(contentType: string, filename: string): Promise<ArticleWithSlug> {
  const { metadata } = (await import(`../content/${contentType}/${filename}`)) as {
    default: React.ComponentType
    metadata: Article
  }
  return {
    slug: `${contentType}/${filename.replace(/(\/page)?\.mdx$/, '')}`,
    ...metadata,
  }
}

export async function getAllContent(contentType: string): Promise<ArticleWithSlug[]> {
  const dir = path.join(contentDirectory, contentType)
  if (!fs.existsSync(dir)) {
    return []
  }
  const filenames = await glob('*/page.mdx', { cwd: dir })
  const contents = await Promise.all(filenames.map(f => importContent(contentType, f)))
  return contents.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

export async function getContentWithComponentByDirectorySlug(contentType: string, slug: string) {
  const filePath = `${slug}/page.mdx`
  try {
    const mod = await import(`../content/${contentType}/${filePath}`)
    const MdxContent = mod.default as React.ComponentType
    const metadata = mod.metadata as Article
    return { MdxContent, content: { slug: `${contentType}/${slug}`, ...metadata } }
  } catch (e) {
    return null
  }
}
