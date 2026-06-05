import { Metadata } from 'next'
import { Suspense } from 'react'

import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

import FirecrawlSiteCrawlerDemoClient from './FirecrawlSiteCrawlerDemoClient'

export const metadata: Metadata = {
  ...createMetadata({
    title: 'Crawl an Entire Website into LLM-Ready Data | Firecrawl Demo',
    description:
      'Interactive demo of crawling a whole website with Firecrawl. Watch /map discover every URL, render each page, and return clean markdown ready for a RAG pipeline. Tune depth, limit, and path filters and see the live site map grow.',
    type: 'demo',
    slug: 'firecrawl-site-crawler',
    author: 'Zachary Proser',
    keywords: [
      'crawl website',
      'web crawler',
      'site mapping',
      'LLM-ready markdown',
      'Firecrawl crawl',
      'Firecrawl map',
      'website to markdown',
      'RAG corpus',
      'crawl entire site',
      'breadth-first crawl',
      'onlyMainContent',
      'includePaths excludePaths',
      'sitemap discovery',
      'web scraping for AI',
      'markdown extraction',
      'interactive demo',
    ],
    tags: [
      'Web Scraping',
      'Web Crawling',
      'AI Tools',
      'Firecrawl',
      'RAG',
      'Interactive Demo',
      'LLM',
    ],
    image: 'https://zackproser.b-cdn.net/images/firecrawl-hero.webp',
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

export default function FirecrawlSiteCrawlerPage() {
  return (
    <Container className="mt-16 lg:mt-28">
      <div className="mx-auto max-w-6xl">
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-zinc-500">Loading the site-crawler walkthrough...</div>
          }
        >
          <FirecrawlSiteCrawlerDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}
