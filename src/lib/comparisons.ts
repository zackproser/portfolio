import { Article, ArticleWithSlug } from './shared-types'
import glob from 'fast-glob'

export async function importComparison(
  comparisonFilename: string,
): Promise<ArticleWithSlug> {
  const { metadata } = await import(`../app/comparisons/${comparisonFilename}`) as {
    metadata: Article
  }

  return {
    slug: comparisonFilename.replace('/page.mdx', ''),
    ...metadata,
  }
}

export async function getAllComparisons() {
  const comparisonFilenames = await glob('**/page.mdx', {
    cwd: './src/app/comparisons',
  });

  const comparisons = await Promise.all(comparisonFilenames.map(importComparison));

  return comparisons.sort((a, z) => +new Date(z.date) - +new Date(a.date));
}