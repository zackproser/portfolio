import { BaseArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'

export async function importTool(
  toolFilename: string,
): Promise<BaseArticleWithSlug> {
  let { metadata } = (await import(`@/app/tools/${toolFilename}`)) as {
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
    slug: toolFilename.replace('/page.mdx', '').toLowerCase().replace(/ /g, '-'),
    type: 'tool',
    ...metadata,
  }
}

export async function getAllTools() {
  let toolFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'tools'),
  })

  let tools = await Promise.all(toolFilenames.map(importTool))

  return tools.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}
