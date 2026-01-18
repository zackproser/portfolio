import { Metadata } from 'next'
import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: 'Best AI Tools for Small Business Owners in 2026 | Zack Proser',
  description: 'The 4 AI tools that actually move the needle: Claude for thinking, WisprFlow for 179 WPM voice input, Granola for meeting intelligence, and Claude Max for document-heavy work. Battle-tested recommendations from an AI engineer.',
  openGraph: {
    title: 'Best AI Tools for Small Business Owners in 2026',
    description: 'The 4 AI tools that actually move the needle: Claude for thinking, WisprFlow for 179 WPM voice input, Granola for meeting intelligence, and Claude Max for document-heavy work.',
    images: [
      {
        url: 'https://zackproser.b-cdn.net/images/ai-tools-2026-og.webp',
        width: 1200,
        height: 630,
        alt: 'Best AI Tools for Small Business Owners in 2026',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best AI Tools for Small Business Owners in 2026',
    description: 'The 4 AI tools that actually move the needle: Claude, WisprFlow, Granola, and Claude Max.',
    images: ['https://zackproser.b-cdn.net/images/ai-tools-2026-og.webp'],
  },
  keywords: [
    'AI tools for small business',
    'best AI tools 2026',
    'Claude AI',
    'WisprFlow review',
    'Granola AI',
    'voice to text AI',
    'meeting transcription AI',
    'AI productivity tools',
    'small business AI',
    'Claude Code',
    'AI for entrepreneurs',
  ],
})

export default function AITools2026Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
