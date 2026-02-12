import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Writing Collections | Zachary Proser',
  description: 'Curated collections of articles on AI engineering, developer tools, vector databases, RAG pipelines, and more.',
  alternates: {
    canonical: 'https://zackproser.com/collections',
  },
  openGraph: {
    title: 'Writing Collections | Zachary Proser',
    description: 'Curated collections of articles on AI engineering, developer tools, vector databases, RAG pipelines, and more.',
    url: 'https://zackproser.com/collections',
    siteName: 'Zachary Proser',
    type: 'website',
  },
}

export default function CollectionsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
