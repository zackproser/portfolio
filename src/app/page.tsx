import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'
import { createMetadata } from '@/utils/createMetadata'
import { getContentsByDirectorySlugs } from '@/lib/content-handlers'
import HomepageClientComponent from './HomepageClientComponent'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const baseMetadata = createMetadata({
  title: 'Modern Coding',
  description: 'AI Engineering Mastery for Teams that Ship',
});

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL('https://zackproser.com'),
};

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
    // Directly load each content collection with our optimized functions
    const deepMLTutorials = await getContentsByDirectorySlugs('blog', deepMLTutorialSlugs)
    const mlProjects = await getContentsByDirectorySlugs('blog', mlProjectSlugs)
    const aiDev = await getContentsByDirectorySlugs('blog', aiDevSlugs)
    const refArchitectures = await getContentsByDirectorySlugs('blog', refArchitectureSlugs)
    const careerAdvice = await getContentsByDirectorySlugs('blog', careerAdviceSlugs)
    const videos = await getContentsByDirectorySlugs('videos', videoSlugs)

    console.log(`Homepage: Loaded content directly with optimized performance`)
    console.log(`- Deep ML Tutorials: ${deepMLTutorials.length}/${deepMLTutorialSlugs.length}`)
    console.log(`- ML Projects: ${mlProjects.length}/${mlProjectSlugs.length}`)
    console.log(`- AI Dev: ${aiDev.length}/${aiDevSlugs.length}`)
    console.log(`- Ref Architectures: ${refArchitectures.length}/${refArchitectureSlugs.length}`)
    console.log(`- Career Advice: ${careerAdvice.length}/${careerAdviceSlugs.length}`)
    console.log(`- Videos: ${videos.length}/${videoSlugs.length}`)

    // Server-side mobile detection
    const headersList = await headers()
    const userAgent = headersList.get('user-agent') || ''
    const parser = new UAParser(userAgent)
    const isMobile = parser.getDevice().type === 'mobile'

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