import { getAllArticles } from "@/lib/articles"
import { getAllVideos } from "@/lib/videos"
import HomepageClientComponent from './HomepageClientComponent'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'
import { createMetadata } from '@/utils/createMetadata'
import { auth } from '../../auth'
import { sql } from '@vercel/postgres'
import { importArticleMetadata } from '@/lib/articles'
import { importCourse } from '@/lib/courses'

export const dynamic = 'force-dynamic'

export const metadata = createMetadata({
  title: 'Modern Coding',
  description: 'Supercharge your development workflow',
});

export default async function Page() {
  const deepMLTutorialSlugs = [
    'cloud-gpu-services-jupyter-notebook-reviewed',
    'how-to-create-a-custom-alpaca-dataset',
    'how-to-fine-tune-llama-3-1-on-lightning-ai-with-torchtune'
  ]

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

  const videoSlugs = [
    'how-to-build-chat-with-your-data-rag',
    'how-to-use-chatgpt-in-your-terminal',
    'what-is-a-vector-database'
  ]

  try {
    // Fetch all articles and videos
    const allArticles = await getAllArticles()
    const allVideos = await getAllVideos()

    const deepMLTutorials = allArticles.filter(article => deepMLTutorialSlugs.includes(article.slug))
    const mlProjects = allArticles.filter(article => mlProjectSlugs.includes(article.slug))
    const aiDev = allArticles.filter(article => aiDevSlugs.includes(article.slug))
    const refArchitectures = allArticles.filter(article => 
      refArchitectureSlugs.includes(article.slug) || 
      article.type === 'demo' || 
      article.type === 'architecture'
    )
    const careerAdvice = allArticles.filter(article => careerAdviceSlugs.includes(article.slug))
    const videos = allVideos.filter(video => videoSlugs.includes(video.slug))

    // Server-side mobile detection
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const isMobile = parser.getDevice().type === 'mobile'
    console.log('Is Mobile:', isMobile)

    return (
      <HomepageClientComponent
        deepMLTutorials={deepMLTutorials}
        mlProjects={mlProjects}
        aiDev={aiDev}
        refArchitectures={refArchitectures}
        careerAdvice={careerAdvice}
        videos={videos}  
        isMobile={isMobile}
      />
    )
  } catch (error) {
    console.error('Error in Page component:', error)
    return null
  }
}