import { Metadata } from 'next'
import Link from 'next/link'
import { createMetadata } from '@/utils/createMetadata'
import { getAffiliateLink } from '@/lib/affiliate'
import { GranolaLandingClient } from './GranolaLandingClient'

export const metadata: Metadata = createMetadata({
  title: 'Granola — the AI meeting notetaker I actually use',
  description:
    'My personal walkthrough of why I use Granola for every meeting at WorkOS, plus my exclusive link and the meeting workflow guide I send to subscribers.',
  author: 'Zachary Proser',
  keywords: [
    'Granola',
    'Granola AI',
    'meeting notes',
    'AI notetaker',
    'meeting workflow',
    'Applied AI',
  ],
})

const directLink = getAffiliateLink({
  product: 'granola',
  campaign: 'granola-landing',
  medium: 'homepage',
  placement: 'text-link',
})

export default function GranolaLandingPage() {
  return (
    <main className="min-h-screen bg-parchment-100 dark:bg-charcoal-400 text-charcoal-50 dark:text-parchment-100">
      <div className="container mx-auto max-w-5xl px-4 md:px-6 py-16 md:py-24">
        <div className="post-crumbs mb-8">
          <Link href="/">Home</Link>
          <span className="sep">/</span>
          <span className="current">Granola</span>
        </div>

        <header className="mb-12">
          <div className="text-sm uppercase tracking-widest text-stone-500 dark:text-stone-400 mb-3">
            § Personal walkthrough · affiliate disclosure below
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Granola is the AI notetaker I actually use.
          </h1>
          <p className="text-xl md:text-2xl text-stone-700 dark:text-stone-300 leading-relaxed max-w-3xl">
            Every WorkOS exec sync, every 1:1, every customer call. The notes
            generate while I&apos;m listening — not after, not from a recording I
            have to upload. That&apos;s why it stuck.
          </p>
        </header>

        <div className="grid md:grid-cols-5 gap-10 md:gap-16 items-start">
          <section className="md:col-span-3 space-y-6 text-lg text-stone-800 dark:text-stone-200 leading-relaxed">
            <p>
              I&apos;ve tried Otter, Fireflies, Fathom, the Zoom AI Companion,
              Notion AI for meetings. They all share the same failure mode:
              transcripts no one reads, summaries that arrive after the moment
              has passed, and a permission flow that makes my legal team
              nervous.
            </p>
            <p>
              Granola runs locally on my Mac, captures meeting audio without a
              bot joining the call, and produces notes shaped like the notes I
              would have taken myself — if I weren&apos;t actively trying to
              listen.
            </p>
            <p>
              The exclusive link below is mine. If you sign up through it,
              you&apos;ll get extended access and I&apos;ll know you came from
              this page. Drop your email and I&apos;ll send you the meeting
              workflow guide I use to run my week: which meetings I have
              Granola in, what I prompt it with afterward, and how the notes
              feed into my weekly review.
            </p>
          </section>

          <aside className="md:col-span-2">
            <div className="border-2 border-charcoal-200 dark:border-stone-700 rounded-2xl p-6 md:p-8 bg-white dark:bg-charcoal-300 shadow-xl">
              <h2 className="text-2xl font-bold mb-2">
                Get my meeting workflow guide
              </h2>
              <p className="text-stone-600 dark:text-stone-400 mb-6 text-sm">
                Drop your email. I&apos;ll send the workflow, and you&apos;ll
                land on Granola with my partner code applied.
              </p>
              <GranolaLandingClient />
              <p className="mt-6 text-xs text-stone-500 dark:text-stone-500 leading-relaxed">
                No spam. One-click unsubscribe. Affiliate disclosure: I earn a
                small commission if you stay on Granola past the trial.
                It&apos;s the tool I&apos;d recommend either way — the
                commission lets me write about it instead of squeezing it in
                between WorkOS responsibilities.
              </p>
            </div>

            <div className="mt-4 text-center text-sm">
              <a
                href={directLink}
                rel="sponsored noopener"
                target="_blank"
                className="text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200 underline underline-offset-4"
              >
                Skip the email, take me straight to Granola →
              </a>
            </div>
          </aside>
        </div>

        <section className="mt-20 border-t border-stone-200 dark:border-stone-800 pt-12">
          <h3 className="text-2xl font-bold mb-6">
            More on how I use it
          </h3>
          <ul className="grid md:grid-cols-2 gap-4 text-stone-700 dark:text-stone-300">
            <li>
              <Link
                href="/blog/adhd-meeting-notes-strategy"
                className="block p-5 border border-stone-200 dark:border-stone-800 rounded-xl hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
              >
                <div className="font-semibold mb-1">
                  Why traditional note-taking fails ADHD brains
                </div>
                <div className="text-sm text-stone-500 dark:text-stone-400">
                  And what I do instead with Granola in the loop.
                </div>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  )
}
