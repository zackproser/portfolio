import { Metadata } from 'next'
import { Suspense } from 'react'
import { createMetadata } from '@/utils/createMetadata'
import TokenizationDemoClient from './TokenizationDemoClient'

export const metadata: Metadata = createMetadata({
  title: 'Tokenization Demo',
  description: 'Interactive demo showcasing the process of tokenization, a fundamental technique used in natural language processing (NLP) and generative AI.',
})

export default function TokenizationDemoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TokenizationDemoClient />
    </Suspense>
  )
}