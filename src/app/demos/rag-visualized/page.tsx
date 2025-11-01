import { Metadata } from 'next'
import { Suspense } from 'react'

import { Container } from '@/components/Container'
import { createMetadata } from '@/utils/createMetadata'

import RagDemoClient from './RagDemoClient'

export const metadata: Metadata = createMetadata({
  title: 'RAG Visualized ? Build grounded AI experiences',
  description:
    'Step through retrieval-augmented generation interactively. Learn why RAG reduces hallucinations, keeps costs in check, and helps engineers ship trustworthy copilots fast.',
  type: 'demo',
  author: 'Zachary Proser'
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
