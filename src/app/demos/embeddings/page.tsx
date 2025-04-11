import { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/utils/createMetadata'
import { Container } from '@/components/Container'
import EmbeddingsDemoClient from './EmbeddingsDemoClient'

export const metadata: Metadata = createMetadata({
  title: "Interactive vector embeddings demo for developers",
  description: 'Visualize how text is transformed into meaningful vector embeddings. Learn how AI systems understand semantic meaning and build powerful retrieval systems.',
  type: 'demo',
  author: 'Zachary',
})

export default function EmbeddingsDemoPage() {
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="mx-auto max-w-4xl">
        <header className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300 sm:text-5xl">
            How do AI systems understand meaning?
          </h1>
          <p className="mt-6 text-base text-gray-700 dark:text-gray-300">
            Explore how text becomes numerical vectors that capture semantic relationships in AI applications.
          </p>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
          <EmbeddingsDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}