import { Metadata } from 'next'
import { Suspense } from 'react'

import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

import RagDemoClient from './RagDemoClient'

export const metadata: Metadata = createMetadata({
  title: 'RAG Visualized | Interactive Retrieval-Augmented Generation Demo',
  description:
    'Step through retrieval-augmented generation interactively. See why RAG reduces hallucinations and cost, with embeddings, vector search, and LLM composition visualized.',
  type: 'demo',
  author: 'Zachary Proser',
  keywords: [
    'RAG',
    'retrieval-augmented generation',
    'vector embeddings',
    'semantic search',
    'LLM',
    'AI copilot',
    'vector database',
    'Pinecone',
    'OpenAI embeddings',
    'grounded AI',
    'AI hallucinations',
    'interactive demo',
    'RAG pipeline',
    'vector similarity',
    'cosine similarity',
    'document retrieval',
    'AI tutorial'
  ],
  tags: [
    'RAG',
    'AI',
    'Machine Learning',
    'Vector Databases',
    'LLM',
    'Interactive Demo',
    'Tutorial'
  ],
  image: 'https://zackproser.b-cdn.net/images/rag-demo-hero.webp'
})

export default function RagVisualizedPage() {
  return (
    <Container className="mt-16 lg:mt-28">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<div className="py-12 text-center text-sm text-zinc-500">Loading the RAG walkthrough?</div>}>
          <RagDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}
