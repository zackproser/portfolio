import { ArticleWithSlug } from '@/types/content'
import glob from 'fast-glob'
import path from 'path'

export async function importTool(
  toolPath: string
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`@/app/tools/${toolPath}`)) as {
    default: React.ComponentType
    metadata: Omit<ArticleWithSlug, 'type' | 'slug'>
  }

  return {
    ...metadata,
    type: 'blog',
    slug: path.basename(toolPath, '.mdx'),
  }
}

export async function getAllTools() {
  let toolFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'tools'),
  })

  let tools = await Promise.all(toolFilenames.map(importTool))

  return tools.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
