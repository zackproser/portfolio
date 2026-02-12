import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Vector Database Comparison Tool | Zachary Proser',
  description: 'Compare vector databases side-by-side: Pinecone, Weaviate, Chroma, Milvus, Qdrant and more. Features, pricing, and performance data.',
  alternates: {
    canonical: 'https://zackproser.com/vectordatabases',
  },
  openGraph: {
    title: 'Vector Database Comparison Tool | Zachary Proser',
    description: 'Compare vector databases side-by-side: Pinecone, Weaviate, Chroma, Milvus, Qdrant and more.',
    url: 'https://zackproser.com/vectordatabases',
    siteName: 'Zachary Proser',
    type: 'website',
  },
}

export default function VectorDatabasesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
