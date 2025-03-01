import { ArticleWithSlug } from '@/types/content'
import glob from 'fast-glob'
import path from 'path'

export async function importComparison(
  comparisonFilename: string,
): Promise<ArticleWithSlug> {
  let { metadata } = (await import(`@/app/comparisons/${comparisonFilename}`)) as {
    default: React.ComponentType
    metadata: ArticleWithSlug
  }

  return {
    ...metadata,
    type: 'blog',
    slug: path.basename(comparisonFilename, '.mdx')
  }
}

export async function getAllComparisons(): Promise<ArticleWithSlug[]> {
  const files = await glob('**/page.mdx', {
    cwd: path.join(process.cwd(), 'src/app/comparisons')
  })

  const comparisons = await Promise.all(
    files.map(async (filename) => {
      return importComparison(filename)
    })
  )

  return comparisons.sort((a, z) => +new Date(z.date) - +new Date(a.date))
}

export async function getComparisonsForProduct(productSlug: string): Promise<ArticleWithSlug[]> {
  const comparisons = await getAllComparisons()
  return comparisons.filter(comparison => 
    comparison.slug.includes(productSlug)
  )
}