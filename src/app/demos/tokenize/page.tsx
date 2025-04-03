import { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/utils/createMetadata'
import { Container } from '@/components/Container'
import TokenizationDemoClient from './TokenizationDemoClient'

export const metadata: Metadata = createMetadata({
  title: 'Tokenization Demo',
  description: 'Interactive demo showcasing the process of tokenization, a fundamental technique used in natural language processing (NLP) and generative AI.',
})

export default function TokenizationDemoPage() {
  return (
    <Container className="mt-16 lg:mt-32">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          Tokenization Demo
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Explore how different tokenization methods work and how they&apos;re used in modern language models.
        </p>
        <Suspense fallback={<div>Loading...</div>}>
          <TokenizationDemoClient />
        </Suspense>
      </div>
    </Container>
  )
}