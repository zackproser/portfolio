import { Metadata } from 'next'
import { Suspense } from 'react'

import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

import FirecrawlChangeTrackerDemoClient from './FirecrawlChangeTrackerDemoClient'

export const metadata: Metadata = {
  ...createMetadata({
    title: 'Monitor Any Website for Changes | Firecrawl Demo',
    description:
      'Interactive demo of website change monitoring with Firecrawl. Schedule a scrape, compare it to the previous snapshot, and see line-level git-diffs, field-level JSON diffs, the real changeTracking API response, and the webhook alert it fires.',
    type: 'demo',
    slug: 'firecrawl-change-tracker',
    author: 'Zachary Proser',
    keywords: [
      'website change monitoring',
      'change detection',
      'changeTracking',
      'page diff',
      'website diff tool',
      'monitor website for changes',
      'competitive monitoring',
      'compliance monitoring',
      'price monitoring',
      'documentation drift',
      'web scraping change tracking',
      'Firecrawl',
      'Firecrawl change tracking',
      'webhook alerts',
      'scheduled scraping',
      'Cloudflare Workers cron',
      'interactive demo',
    ],
    tags: [
      'Web Scraping',
      'Change Monitoring',
      'AI Tools',
      'Firecrawl',
      'Competitive Intelligence',
      'Compliance',
      'Interactive Demo',
    ],
    image: 'https://zackproser.b-cdn.net/images/fc-tracker-demo-hero.webp',
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

export default function FirecrawlChangeTrackerPage() {
  return (
    <Container className="mt-16 lg:mt-28">
      <div className="mx-auto max-w-6xl">
        <Suspense
          fallback={
            <div className="py-12 text-center text-sm text-zinc-500">
              Loading the change-tracking demo...
            </div>
          }
        >
          <FirecrawlChangeTrackerDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}
