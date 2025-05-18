import { Metadata } from 'next'
import { getTools, getCategories } from '@/lib/getTools'
import ComparisonPageLayout from '@/components/ComparisonPageLayout'
import { generateComparison } from '@/templates/comparison-tool-prose.jsx'

function slugify(str: string) {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '')
}

interface PageProps {
  params: { comparison: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [slug1, slug2] = params.comparison.split('-vs-')
  const tools = getTools()
  const tool1 = tools.find(t => slugify(t.name) === slug1)
  const tool2 = tools.find(t => slugify(t.name) === slug2)
  const title = tool1 && tool2 ? `${tool1.name} vs ${tool2.name}` : 'Tool comparison'
  return {
    title,
    description: `A detailed comparison of ${tool1?.name || slug1} and ${tool2?.name || slug2}`,
  }
}

export default function ComparisonPage({ params }: PageProps) {
  const [slug1, slug2] = params.comparison.split('-vs-')
  const tools = getTools()
  const categories = getCategories()
  const tool1 = tools.find(t => slugify(t.name) === slug1)
  const tool2 = tools.find(t => slugify(t.name) === slug2)

  if (!tool1 || !tool2) {
    return null
  }

  const proseParagraphs = generateComparison(tool1, tool2, categories)

  return <ComparisonPageLayout tool1={tool1} tool2={tool2} proseParagraphs={proseParagraphs} />
}
