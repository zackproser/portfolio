import { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/utils/createMetadata'
import EmbeddingsDemoClient from './EmbeddingsDemoClient'

export const metadata: Metadata = createMetadata({
  title: 'Embeddings Demo',
  description: 'Interactive demo of converting natural language into vectors or embeddings, a fundamental technique used in natural language processing (NLP) and generative AI.',
})

export default function EmbeddingsDemoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbeddingsDemoClient />
    </Suspense>
  )
}