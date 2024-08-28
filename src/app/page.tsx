import { getAllArticles } from "@/lib/articles"
import HomepageClientComponent from './HomepageClientComponent'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'
import { createMetadata } from '@/utils/createMetadata'

export const metadata = createMetadata({
  title: 'Modern Coding',
  description: 'Supercharge your development workflow',
});

export default async function Page() {
  // Fetch all articles
  const allArticles = await getAllArticles()

  const mlProjectSlugs = [
    'mnist-pytorch-hand-drawn-digit-recognizer',
    'langchain-pinecone-chat-with-my-blog',
    'rag-evaluation'
  ]

  const aiDevSlugs = [
    'automations-project',
    'how-are-embeddings-models-trained-for-rag',
    'codeium-review'
  ]

  const refArchitectureSlugs = [
    'pinecone-reference-architecture-launch',
    'pinecone-reference-architecture-scaling'
  ]

  const mlProjects = allArticles.filter(article => mlProjectSlugs.includes(article.slug))
  const aiDev = allArticles.filter(article => aiDevSlugs.includes(article.slug))
  const refArchitectures = allArticles.filter(article => 
    refArchitectureSlugs.includes(article.slug) || 
    article.type === 'demo' || 
    article.type === 'architecture'
  )

  // Server-side mobile detection
  const userAgent = headers().get('user-agent') || ''
  const parser = new UAParser(userAgent)
  const isMobile = parser.getDevice().type === 'mobile'

  return (
    <HomepageClientComponent
      mlProjects={mlProjects}
      aiDev={aiDev}
      refArchitectures={refArchitectures}
      isMobile={isMobile}
    />
  )
}