import { getAllArticles } from "@/lib/articles"
import HomepageClientComponent from './HomepageClientComponent'

export default async function Page() {
  // Fetch all articles
  const allArticles = await getAllArticles()

  console.log(`allArticles: %o`, allArticles)

  // Define static arrays for each category
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

  return (
    <HomepageClientComponent
      mlProjects={mlProjects}
      aiDev={aiDev}
      refArchitectures={refArchitectures}
    />
  )
}