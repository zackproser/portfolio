import { Metadata } from 'next'
import { Suspense } from 'react'

import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

import VoiceAIDemoClient from './VoiceAIDemoClient'

export const metadata: Metadata = {
  ...createMetadata({
    title: 'Voice-First AI Demo | WisprFlow & Granola in Action',
    description:
      'Interactive demo of voice-driven development. See how WisprFlow (179 WPM voice-to-text) and Granola (AI meeting notes) transform developer productivity with live visualizations.',
    type: 'demo',
    slug: 'voice-ai',
    author: 'Zachary Proser',
    keywords: [
      'voice to text',
      'WisprFlow',
      'WisprFlow review',
      'Granola',
      'Granola AI',
      'voice dictation software',
      'AI productivity tools',
      'voice-first development',
      'speech to text for developers',
      'AI meeting notes',
      'Cursor IDE voice',
      'ADHD productivity tools',
      'neurodivergent developer tools',
      'voice coding',
      'AI transcription',
      'developer productivity',
      'voice driven development',
      '179 WPM typing',
      'multi-agent orchestration'
    ],
    tags: [
      'Voice AI',
      'Productivity',
      'Developer Tools',
      'WisprFlow',
      'Granola',
      'Interactive Demo',
      'AI Tools'
    ],
    image: 'https://zackproser.b-cdn.net/images/voice-demo.webp'
  }),
  // Additional SEO enhancements
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

export default function VoiceAIDemoPage() {
  return (
    <Container className="mt-16 lg:mt-28">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={
          <div className="py-12 text-center text-sm text-zinc-500">
            Loading the voice AI experience...
          </div>
        }>
          <VoiceAIDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}


