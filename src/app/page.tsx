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
  const mlProjectSlugs = [
    'mnist-pytorch-hand-drawn-digit-recognizer',
    'langchain-pinecone-chat-with-my-blog',
    'rag-evaluation'
  ]

  const aiDevSlugs = [
    'automations-project',
    'autocomplete-is-not-all-you-need',
    'codeium-analysis-4-2024'
  ]

  const refArchitectureSlugs = [
    'pinecone-reference-architecture-launch',
    'pinecone-reference-architecture-scaling',
    'pinecone-reference-architecture-technical-walkthrough'
  ]

  const careerAdviceSlugs = [
    'run-your-own-tech-blog',
    'wash-three-walls-with-one-bucket',
    'you-get-to-keep-the-neural-connections'
  ]

  const allSlugs = [...mlProjectSlugs, ...aiDevSlugs, ...refArchitectureSlugs, ...careerAdviceSlugs]

  try {
    // Fetch all articles matching the slugs
    const allArticles = await getAllArticles(allSlugs)

    const mlProjects = allArticles.filter(article => mlProjectSlugs.includes(article.slug))

    const aiDev = allArticles.filter(article => aiDevSlugs.includes(article.slug))

    const refArchitectures = allArticles.filter(article => 
      refArchitectureSlugs.includes(article.slug) || 
      article.type === 'demo' || 
      article.type === 'architecture'
    )

    const careerAdvice = allArticles.filter(article => careerAdviceSlugs.includes(article.slug))

    // Server-side mobile detection
    const userAgent = headers().get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const isMobile = parser.getDevice().type === 'mobile'
    console.log('Is Mobile:', isMobile)

    return (
      <HomepageClientComponent
        mlProjects={mlProjects}
        aiDev={aiDev}
        refArchitectures={refArchitectures}
        careerAdvice={careerAdvice}
        isMobile={isMobile}
      />
    )
  } catch (error) {
    console.error('Error in Page component:', error)
    return null
  }
}