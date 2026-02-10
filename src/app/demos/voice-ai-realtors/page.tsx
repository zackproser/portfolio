import { Metadata } from 'next'
import { Suspense } from 'react'

import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

import RealtorDemoClient from './RealtorDemoClient'

export const metadata: Metadata = {
  ...createMetadata({
    title: 'Voice AI for Real Estate Agents | Dictate Listings, Capture Client Calls',
    description:
      'Interactive demo: see how top-producing agents use voice AI to dictate MLS listings in 2 minutes, capture buyer consultations automatically, and save 11+ hours per week.',
    type: 'demo',
    slug: 'voice-ai-realtors',
    author: 'Zachary Proser',
    keywords: [
      'voice ai for realtors',
      'real estate voice tools',
      'dictate listing description',
      'mls voice to text',
      'realtor productivity tools',
      'ai for real estate agents',
      'wisprflow real estate',
      'granola real estate',
      'voice dictation real estate',
      'real estate crm voice',
      'listing description generator',
      'buyer consultation notes',
      'real estate meeting notes',
      'realtor ai tools 2026',
      'voice to text mls',
      'real estate agent productivity'
    ],
    tags: [
      'Voice AI',
      'Real Estate',
      'Productivity',
      'WisprFlow',
      'Granola',
      'Interactive Demo'
    ],
    image: 'https://zackproser.b-cdn.net/images/wisprflow.webp'
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

export default function RealtorVoiceAIDemoPage() {
  return (
    <Container className="mt-16 lg:mt-28">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={
          <div className="py-12 text-center text-sm text-zinc-500">
            Loading the voice AI experience for realtors...
          </div>
        }>
          <RealtorDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}
