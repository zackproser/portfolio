import { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/utils/createMetadata'
import { Container } from '@/components/Container'
import TokenizeDemoLoader from './TokenizeDemoLoader'

export const metadata: Metadata = createMetadata({
  title: "Interactive tokenization demo for developers",
  description: 'Explore how language models break text into tokens. Visualize different tokenization methods and understand their impact on AI performance, context limits, and costs.',
  type: 'demo',
  author: 'Zachary',
})

export default function TokenizationDemoPage() {
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="mx-auto max-w-4xl">
        <header className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300 sm:text-5xl">
            How do language models &quot;see&quot; text?
          </h1>
          <p className="mt-6 text-base text-gray-700 dark:text-gray-300">
            Understand how text becomes tokens in language models and how this affects your AI applications.
          </p>
        </header>
        <Suspense fallback={<div>Loading...</div>}>
          <TokenizeDemoLoader />
        </Suspense>
      </div>
    </Container>
  )
}