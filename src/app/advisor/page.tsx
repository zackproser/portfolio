import type { Metadata } from 'next'
import { Container } from '@/components/Container'
import AdvisorChat from '@/components/advisor/AdvisorChat'
import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: 'AI Tool Advisor — Get a Straight Answer',
  description: 'Answer a question or two and get a practical AI tool recommendation, including the tradeoffs and articles that support it.',
})

export default function AdvisorPage() {
  return (
    <Container>
      <main className="mx-auto max-w-4xl pb-16 pt-16 sm:pb-24 sm:pt-24">
        <header className="mx-auto mb-8 max-w-2xl text-center sm:mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400">
            AI Tool Advisor
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-5xl">
            Get a straight answer about which tool fits.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
            The advisor asks a question or two, then gives you an honest recommendation and the posts that back it up.
          </p>
        </header>
        <AdvisorChat />
      </main>
    </Container>
  )
}
