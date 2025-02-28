import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'
import { createMetadata } from '@/utils/createMetadata'
import { getAllContent } from '@/lib/content-handlers'
import HomepageClientComponent from './HomepageClientComponent'

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
    // Get all articles and videos
    const allArticles = await getAllContent('blog')
    const allVideos = await getAllContent('videos')

    console.log(`Homepage: Loaded ${allArticles.length} blog articles and ${allVideos.length} videos`)
    
    // Log the slugs of all articles for debugging
    console.log('All article slugs:', allArticles.map(article => article.slug))
    
    // Log the slugs we're looking for
    console.log('Looking for deepMLTutorial slugs:', deepMLTutorialSlugs)
    console.log('Looking for mlProject slugs:', mlProjectSlugs)
    console.log('Looking for aiDev slugs:', aiDevSlugs)
    console.log('Looking for refArchitecture slugs:', refArchitectureSlugs)
    console.log('Looking for careerAdvice slugs:', careerAdviceSlugs)

    // Helper function to normalize slugs for comparison
    const normalizeSlug = (slug: string) => {
      // Remove any leading slashes and 'blog/' prefix
      return slug.replace(/^\/+/, '').replace(/^blog\//, '')
    }

    // Filter articles using normalized slugs for comparison
    const deepMLTutorials = allArticles.filter(article => 
      deepMLTutorialSlugs.some(slug => normalizeSlug(article.slug) === normalizeSlug(slug))
    )
    
    const mlProjects = allArticles.filter(article => 
      mlProjectSlugs.some(slug => normalizeSlug(article.slug) === normalizeSlug(slug))
    )
    
    const aiDev = allArticles.filter(article => 
      aiDevSlugs.some(slug => normalizeSlug(article.slug) === normalizeSlug(slug))
    )
    
    const refArchitectures = allArticles.filter(article => 
      refArchitectureSlugs.some(slug => normalizeSlug(article.slug) === normalizeSlug(slug))
    )
    
    const careerAdvice = allArticles.filter(article => 
      careerAdviceSlugs.some(slug => normalizeSlug(article.slug) === normalizeSlug(slug))
    )
    
    const videos = allVideos.filter((video) => 
      videoSlugs.some(slug => normalizeSlug(video.slug) === normalizeSlug(slug))
    )

    // Log how many articles were found for each category
    console.log(`Found ${deepMLTutorials.length} deepMLTutorials`)
    console.log(`Found ${mlProjects.length} mlProjects`)
    console.log(`Found ${aiDev.length} aiDev`)
    console.log(`Found ${refArchitectures.length} refArchitectures`)
    console.log(`Found ${careerAdvice.length} careerAdvice`)
    console.log(`Found ${videos.length} videos`)

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