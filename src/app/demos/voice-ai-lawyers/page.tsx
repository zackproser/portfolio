import { Metadata } from 'next'
import { Suspense } from 'react'

import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

import LawyerDemoClient from './LawyerDemoClient'

export const metadata: Metadata = {
  ...createMetadata({
    title: 'Voice AI for Lawyers | Legal Dictation, Client Notes & Billing',
    description:
      'Interactive demo: see how attorneys use voice AI to dictate briefs and motions in minutes, capture client consultations automatically, and bill more hours per day.',
    type: 'demo',
    slug: 'voice-ai-lawyers',
    author: 'Zachary Proser',
    keywords: [
      'voice ai for lawyers',
      'legal dictation demo',
      'attorney voice tools',
      'ai dictation for legal documents',
      'lawyer productivity tools',
      'ai for attorneys',
      'wisprflow legal',
      'granola legal meetings',
      'voice dictation legal',
      'legal billing voice',
      'brief dictation software',
      'client consultation notes',
      'legal meeting notes',
      'lawyer ai tools 2026',
      'voice to text legal',
      'attorney productivity'
    ],
    tags: [
      'Voice AI',
      'Legal',
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

export default function LawyerVoiceAIDemoPage() {
  return (
    <Container className="mt-16 lg:mt-28">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={
          <div className="py-12 text-center text-sm text-zinc-500">
            Loading the voice AI experience for legal professionals...
          </div>
        }>
          <LawyerDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}
