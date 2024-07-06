import { Tool } from '@/types/Tool'
import glob from 'fast-glob'

export async function importTool(
  toolFilename: string,
): Promise<ArticleWithSlug> {
  const { metadata } = await import(`../app/devtools/${toolFilename}`) as {
    metadata: Article
  }

  return {
    slug: toolFilename.replace('/page.mdx', ''),
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

export async function getCategories(): Promise<string[]> {
  const tools = await getAllTools()
  const categories = new Set(tools.flatMap(tool => tool.categories || []))
  return Array.from(categories).sort()
}

export async function getFeatures(): Promise<string[]> {
  const tools = await getAllTools()
  const features = new Set(tools.flatMap(tool => Object.keys(tool)))
  return Array.from(features).sort()
}
