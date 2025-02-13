import Link from 'next/link'

import { CheckIcon } from '@/components/CheckIcon'
import { Container } from '@/components/Container'

export function Introduction() {
  return (
    <section
      id="introduction"
      aria-label="Introduction"
      className="pt-20 pb-16 sm:pb-20 md:pt-36 lg:py-32"
    >
      <Container className="text-lg tracking-tight text-slate-700">
        <p className="font-display text-4xl font-bold tracking-tight text-slate-900">
          &ldquo;Build Production-Ready RAG Applications&rdquo; is a comprehensive guide that teaches you how to build robust and scalable RAG systems from the ground up.
        </p>
        <p className="mt-4">
          Whether you&apos;re building a question-answering system, a chatbot, or a document search engine,
          this guide will teach you everything you need to know about implementing RAG pipelines in production.
        </p>
        <ul role="list" className="mt-8 space-y-3">
          {[
            'Master the fundamentals of Retrieval Augmented Generation',
            'Learn vector database integration and optimization',
            'Implement efficient chunking and embedding strategies',
            'Build reranking and post-processing pipelines',
            'Deploy and scale RAG systems in production',
            'Handle edge cases and improve response quality',
          ].map((feature) => (
            <li key={feature} className="flex">
              <CheckIcon className="h-8 w-8 flex-none fill-blue-500" />
              <span className="ml-4">{feature}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          This guide is designed for developers and engineers who want to build production-grade
          RAG applications, covering both fundamental concepts and advanced implementation details.
        </p>
        <p className="mt-10">
          <Link
            href="#free-chapters"
            className="text-base font-medium text-blue-600 hover:text-blue-800"
          >
            Get two free chapters straight to your inbox{' '}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </p>
      </Container>
    </section>
  )
} 