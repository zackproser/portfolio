import { Metadata } from 'next'
import { Suspense } from 'react'

import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

import FirecrawlDemoClient from './FirecrawlDemoClient'

export const metadata: Metadata = {
  ...createMetadata({
    title: 'Web Scraping for AI Demo | Firecrawl in Action',
    description:
      'Interactive demo showing how Firecrawl turns any website into clean, structured data for AI agents, RAG pipelines, and LLM applications. See the web crawling pipeline visualized.',
    type: 'demo',
    slug: 'firecrawl',
    author: 'Zachary Proser',
    keywords: [
      'web scraping',
      'web crawling',
      'Firecrawl',
      'Firecrawl review',
      'web scraping API',
      'web scraping for AI',
      'crawl website for LLM',
      'RAG pipeline data',
      'structured data extraction',
      'AI web scraping',
      'scrape website to markdown',
      'web data for AI agents',
      'Firecrawl vs Puppeteer',
      'Firecrawl vs Beautiful Soup',
      'web scraping tool 2026',
      'crawl4ai alternative',
      'AI data pipeline',
      'LLM training data',
      'website to structured data'
    ],
    tags: [
      'Web Scraping',
      'AI Tools',
      'Developer Tools',
      'Firecrawl',
      'Data Extraction',
      'Interactive Demo',
      'RAG'
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

export default function FirecrawlDemoPage() {
  return (
    <Container className="mt-16 lg:mt-28">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={
          <div className="py-12 text-center text-sm text-zinc-500">
            Loading the web scraping experience...
          </div>
        }>
          <FirecrawlDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}
