import glob from 'fast-glob'
import { Article, ArticleWithSlug } from '@/lib/shared-types'

export async function importTool(
  toolFilename: string,
): Promise<ArticleWithSlug> {
  const { metadata } = await import(`../app/devtools/${toolFilename}`) as {
    metadata: Article
  }

  return {
    slug: toolFilename.replace('/page.mdx', '').toLowerCase().replace(/ /g, '-'),
    ...metadata,
  }
}

export async function getAllTools() {
  const toolFilenames = await glob('**/page.mdx', {
    cwd: './src/app/devtools',
  })

  const tools = await Promise.all(toolFilenames.map(importTool))

  return tools.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}
