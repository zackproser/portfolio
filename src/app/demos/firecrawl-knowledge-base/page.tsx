import { Metadata } from 'next'
import { Suspense } from 'react'

import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

import FirecrawlKnowledgeBaseDemoClient from './FirecrawlKnowledgeBaseDemoClient'

export const metadata: Metadata = {
  ...createMetadata({
    title: 'Build a Knowledge Base from Any Website | Firecrawl Demo',
    description:
      'Interactive demo showing how to transform any website into a structured knowledge base using Firecrawl. See the complete pipeline: crawl → extract → categorize → searchable knowledge base.',
    type: 'demo',
    slug: 'firecrawl-knowledge-base',
    author: 'Zachary Proser',
    keywords: [
      'knowledge base creation',
      'website to knowledge base',
      'Firecrawl knowledge base',
      'automated knowledge extraction',
      'web scraping knowledge base',
      'content categorization',
      'knowledge management system',
      'AI knowledge base builder',
      'structured data extraction',
      'website content organization',
      'enterprise knowledge base',
      'content management automation',
      'information architecture',
      'knowledge discovery',
      'content intelligence'
    ],
    tags: [
      'Web Scraping',
      'Knowledge Management',
      'AI Tools',
      'Firecrawl',
      'Data Organization',
      'Interactive Demo',
      'Content Intelligence'
    ],
    image: 'https://zackproser.b-cdn.net/images/firecrawl-hero.webp'
  }),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  category: 'technology',
}

export default function FirecrawlKnowledgeBaseDemoPage() {
  return (
    <Container className="mt-16 lg:mt-28">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={
          <div className="py-12 text-center text-sm text-zinc-500">
            Loading the knowledge base building experience...
          </div>
        }>
          <FirecrawlKnowledgeBaseDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}