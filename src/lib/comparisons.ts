import { ArticleWithSlug } from '@/types/content'
import { getTools } from './getTools'

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

export async function getAllComparisons(): Promise<ArticleWithSlug[]> {
  const tools = getTools()
  const comparisons: ArticleWithSlug[] = []

  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const tool1 = tools[i]
      const tool2 = tools[j]
      comparisons.push({
        title: `${tool1.name} vs ${tool2.name}`,
        description: `A detailed comparison of ${tool1.name} and ${tool2.name}.`,
        author: 'Zachary Proser',
        date: new Date().toISOString(),
        type: 'comparison',
        slug: `${slugify(tool1.name)}-vs-${slugify(tool2.name)}`
      })
    }
  }

  return comparisons
}

export async function getComparisonsForProduct(productSlug: string): Promise<ArticleWithSlug[]> {
  const comparisons = await getAllComparisons()
  return comparisons.filter(comparison =>
    comparison.slug.includes(productSlug)
  )
}