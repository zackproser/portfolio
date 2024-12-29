import { Metadata } from 'next'
import { getAllArticles } from '@/lib/articles'
import { getAllVideos } from '@/lib/videos'
import { createMetadata } from '@/utils/createMetadata'
import HomepageClientComponent from './HomepageClientComponent'
import { headers } from 'next/headers'
import { UAParser } from 'ua-parser-js'

export const metadata: Metadata = createMetadata({
  title: "Zachary Proser - Staff Developer",
  description: "Staff Developer, open-source maintainer and technical writer"
});

export default async function Home() {
  const allArticles = await getAllArticles()

  // Filter articles by type
  const deepMLTutorials = allArticles.filter(article => article.type === 'deep-ml')
  const mlProjects = allArticles.filter(article => article.type === 'ml-project')
  const aiDev = allArticles.filter(article => article.type === 'ai-dev')
  const refArchitectures = allArticles.filter(article => article.type === 'ref-arch')
  const careerAdvice = allArticles.filter(article => article.type === 'career')

  // Get videos
  const videos = await getAllVideos()

  // Use UAParser to detect mobile
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
}