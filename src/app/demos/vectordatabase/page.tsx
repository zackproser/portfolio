import { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/utils/createMetadata'
import { Container } from '@/components/Container'
import VectorDatabaseDemoClient from './VectorDatabaseDemoClient'

export const metadata: Metadata = createMetadata({
  title: "Interactive vector database demo for developers",
  description: 'Learn vector database basics like namespaces, upserts, and similarity search through an interactive demo.',
  type: 'demo',
  author: 'Zachary',
})

export default function VectorDatabaseDemoPage() {
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="mx-auto max-w-4xl">
        <header className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300 sm:text-5xl">
            How do vector databases work?
          </h1>
          <p className="mt-6 text-base text-gray-700 dark:text-gray-300">
            Follow the steps below to create a namespace, upsert vectors with metadata, then search and visualise the results.
          </p>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
          <VectorDatabaseDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}
