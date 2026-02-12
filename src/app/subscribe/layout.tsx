import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Subscribe to Modern Coding Newsletter',
  description: 'Join 4,000+ engineers getting weekly insights on AI engineering, RAG pipelines, developer tools, and building with LLMs.',
  alternates: {
    canonical: 'https://zackproser.com/subscribe',
  },
  openGraph: {
    title: 'Subscribe to Modern Coding Newsletter',
    description: 'Join 4,000+ engineers getting weekly insights on AI engineering, RAG pipelines, developer tools, and building with LLMs.',
    url: 'https://zackproser.com/subscribe',
    siteName: 'Zachary Proser',
    type: 'website',
  },
}

export default function SubscribeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
