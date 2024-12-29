import { BaseArticleWithSlug } from './shared-types'
import glob from 'fast-glob'
import path from 'path'

export async function importComparison(
  comparisonFilename: string,
): Promise<BaseArticleWithSlug> {
  let { metadata } = (await import(`@/app/comparisons/${comparisonFilename}`)) as {
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
    slug: comparisonFilename.replace('/page.mdx', ''),
    type: 'comparison',
    ...metadata,
  }
}

export async function getAllComparisons() {
  let comparisonFilenames = await glob('*/page.mdx', {
    cwd: path.join(process.cwd(), 'src', 'app', 'comparisons'),
  })

  let comparisons = await Promise.all(comparisonFilenames.map(importComparison))

  return comparisons.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}