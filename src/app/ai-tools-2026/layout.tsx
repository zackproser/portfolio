import { Metadata } from 'next'
import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: 'Best AI Tools for Small Business Owners in 2026 | Zack Proser',
  description: 'Skip the AI overwhelm. If you\'re a small business owner wondering which AI tools actually matter, start here. Four tools that solve real problems: Claude, WisprFlow, Granola, and Claude Max.',
  openGraph: {
    title: 'Skip the AI Overwhelm. Start Here.',
    description: 'If you\'re a small business owner wondering which AI tools actually matter, you\'re not behind. Four tools that solve real problems: thinking, voice input, meetings, and documents.',
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
    title: 'Skip the AI Overwhelm. Start Here.',
    description: 'If you\'re a small business owner wondering which AI tools matter, you\'re not behind. Four tools that solve real problems.',
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
