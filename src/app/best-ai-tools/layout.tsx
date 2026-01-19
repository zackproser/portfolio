import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://zackproser.com'),
  title: 'Best AI Tools for Small Business Owners | Zack Proser',
  description: 'Skip the AI overwhelm. If you\'re a small business owner wondering which AI tools actually matter, start here. Four tools that solve real problems: Claude, WisprFlow, Granola, and Claude Max.',
  openGraph: {
    type: 'website',
    title: 'Skip the AI Overwhelm. Start Here.',
    description: 'If you\'re a small business owner wondering which AI tools actually matter, you\'re not behind. Four tools that solve real problems: thinking, voice input, meetings, and documents.',
    url: 'https://zackproser.com/best-ai-tools',
    siteName: 'Zachary Proser',
    images: [
      {
        url: 'https://zackproser.b-cdn.net/images/best-ai-tools-og.webp',
        width: 1200,
        height: 630,
        alt: 'Best AI Tools for Small Business Owners',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Skip the AI Overwhelm. Start Here.',
    description: 'If you\'re a small business owner wondering which AI tools matter, you\'re not behind. Four tools that solve real problems.',
    images: ['https://zackproser.b-cdn.net/images/best-ai-tools-og.webp'],
  },
  keywords: [
    'AI tools for small business',
    'best AI tools',
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
  alternates: {
    canonical: 'https://zackproser.com/best-ai-tools',
  },
}

export default function BestAIToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
