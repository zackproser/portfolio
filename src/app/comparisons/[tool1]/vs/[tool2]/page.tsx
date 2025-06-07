import { Suspense } from 'react'
import { notFound, redirect } from 'next/navigation'
import { Metadata } from 'next'
import { getToolBySlug, getAllTools } from '@/actions/tool-actions'
import ComparisonPageLayout from '@/components/ComparisonPageLayout'

import { createMetadata } from '@/utils/createMetadata'
import { ComparisonPageSkeleton } from '@/components/comparison-page-skeleton'

interface PageProps {
  params: Promise<{
    tool1: string
    tool2: string
  }>
}

// Helper function to create slug from tool name
const createSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
}

// Cache for tools to avoid repeated DB calls during build
let toolsCache: Awaited<ReturnType<typeof getAllTools>> | null = null

// Popular tool pairs that should be pre-generated for better SEO and performance
const POPULAR_COMPARISONS = [
  // AI Code Generation Tools
  ['github-copilot', 'cursor'],
  ['github-copilot', 'codeium'],
  ['cursor', 'codeium'],
  ['github-copilot', 'tabnine'],
  ['cursor', 'tabnine'],
  
  // Vector Databases
  ['pinecone', 'chroma'],
  ['pinecone', 'weaviate'],
  ['chroma', 'weaviate'],
  ['pinecone', 'qdrant'],
  ['chroma', 'qdrant'],
  
  // LLM APIs
  ['openai-api', 'anthropic-claude-api'],
  ['openai-api', 'mistral-ai'],
  ['anthropic-claude-api', 'mistral-ai'],
  
  // AI Frameworks
  ['langchain', 'llamaindex'],
  ['langchain', 'autogen'],
  ['llamaindex', 'autogen'],
  
  // Code Analysis Tools
  ['coderabbit', 'qodo'],
  ['manus', 'outerbase'],
  
  // Popular cross-category comparisons
  ['github-copilot', 'openai-api'],
  ['cursor', 'v0-by-vercel'],
]

// Generate static params for popular tool combinations only
// Other combinations will be generated on-demand with ISR
export async function generateStaticParams() {
  // Return empty array to make ALL comparison pages use ISR
  // This maximizes build time performance while maintaining excellent runtime performance
  console.log('All comparison pages will be generated on-demand with ISR for maximum build performance')
  return []
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool1: tool1Slug, tool2: tool2Slug } = await params
  
  try {
    // Use Promise.all to fetch both tools concurrently
    const [tool1, tool2] = await Promise.all([
      getToolBySlug(tool1Slug),
      getToolBySlug(tool2Slug)
    ])

    if (!tool1 || !tool2) {
      return createMetadata({
        title: "Comparison Not Found",
        description: "The requested tool comparison could not be found."
      })
    }

    return createMetadata({
      title: `${tool1.name} vs ${tool2.name}`,
      description: `Compare ${tool1.name} and ${tool2.name} - features, pricing, pros and cons. Find the best tool for your development needs.`,
      slug: `${tool1Slug}-vs-${tool2Slug}`
    })
  } catch (error) {
    console.error('Error generating metadata:', error)
    return createMetadata({
      title: "Comparison Error",
      description: "Error loading comparison data."
    })
  }
}

async function ComparisonContent({ tool1Slug, tool2Slug }: { tool1Slug: string, tool2Slug: string }) {
  try {
    // Check if this is the canonical URL order, if not redirect
    if (tool1Slug > tool2Slug) {
      redirect(`/comparisons/${tool2Slug}/vs/${tool1Slug}`)
    }
    
    // Use Promise.all to fetch both tools concurrently
    const [tool1, tool2] = await Promise.all([
      getToolBySlug(tool1Slug),
      getToolBySlug(tool2Slug)
    ])
    
    if (!tool1 || !tool2) {
      notFound()
    }
    
    // Generate simple comparison prose
    const proseParagraphs = [
      `Choosing between ${tool1.name} and ${tool2.name} is a common decision for developers. Both tools have their unique strengths and serve different use cases in the development workflow.`,
      `${tool1.name} ${tool1.description ? `is ${tool1.description.toLowerCase()}` : 'offers a comprehensive set of features'}, making it suitable for teams that prioritize reliability and ease of use.`,
      `${tool2.name} ${tool2.description ? `focuses on ${tool2.description.toLowerCase()}` : 'provides powerful capabilities'}, which appeals to developers who value performance and flexibility.`,
      `When making your decision, consider factors like your budget, team size, integration requirements, and long-term scalability needs. This comparison will help you understand which tool aligns better with your specific requirements.`
    ]
    
    return (
      <ComparisonPageLayout 
        tool1={tool1} 
        tool2={tool2} 
        proseParagraphs={proseParagraphs}
      />
    )
  } catch (error) {
    console.error('Error loading comparison:', error)
    throw error
  }
}

export default async function ComparisonPage({ params }: PageProps) {
  const { tool1: tool1Slug, tool2: tool2Slug } = await params
  
  return (
    <Suspense fallback={<ComparisonPageSkeleton />}>
      <ComparisonContent tool1Slug={tool1Slug} tool2Slug={tool2Slug} />
    </Suspense>
  )
}

// Enable ISR with 1 hour revalidation for excellent performance
// Pages not generated at build time will be created on first request
export const revalidate = 3600 