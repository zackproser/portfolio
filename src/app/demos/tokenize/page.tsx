import { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/utils/createMetadata'
import { Container } from '@/components/Container'
import TokenizationDemoClient from './TokenizationDemoClient'

export const metadata: Metadata = createMetadata({
  title: "How do language models \"see\" text?",
  description: 'Interactive demo showcasing the process of tokenization, a fundamental technique used in natural language processing (NLP) and generative AI.',
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
          <TokenizationDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}