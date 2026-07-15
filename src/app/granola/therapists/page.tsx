import type { Metadata } from 'next'
import Link from 'next/link'
import {
  AffiliateLink,
  InlineAffiliateCTA,
} from '@/components/StickyAffiliateCTA'
import { CaptureComparison, DocumentationCalculator } from './TherapistTools'

const pageUrl = 'https://zackproser.com/granola/therapists'
const pageImage =
  'https://zackproser.b-cdn.net/images/og-images/granola-therapists.png'
const campaign = 'granola-therapists'

const faq = [
  {
    question: 'Does Granola join a therapy session as a recording bot?',
    answer:
      'No. Granola captures meeting audio locally on the therapist’s device, so no extra bot participant appears in the call. Therapists still need to disclose capture, obtain appropriate consent, and verify their own professional and regulatory obligations.',
  },
  {
    question: 'Can Granola replace a therapist’s clinical judgment?',
    answer:
      'No. Captured notes are a record to review. The therapist remains responsible for accuracy, relevance, professional judgment, and the final documentation entered into any official system.',
  },
  {
    question: 'Is Granola appropriate for every client session?',
    answer:
      'That depends on the therapist’s jurisdiction, licensing rules, employer or practice policy, client consent, and the sensitivity of the session. Those requirements should be verified before any AI tool is used with client conversations.',
  },
] as const

export const metadata: Metadata = {
  title: 'Granola for Therapists: AI Notes Without a Bot Joining',
  description:
    'A practical look at Granola for therapists and counselors who want session documentation without a recording bot joining the call.',
  authors: [{ name: 'Zachary Proser', url: 'https://zackproser.com' }],
  keywords: [
    'Granola for therapists',
    'AI notes without a bot joining',
    'meeting notes app no recording bot',
    'AI session notes for counselors',
    'therapist session documentation',
    'no bot meeting notes',
  ],
  alternates: { canonical: pageUrl },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: pageUrl,
    title: 'Granola for Therapists: Stay Present Without a Bot in the Call',
    description:
      'Local meeting capture, no bot participant, and a practical workflow for reviewing session notes after the client leaves.',
    siteName: 'Zachary Proser',
    images: [
      {
        url: pageImage,
        width: 1200,
        height: 630,
        alt: 'Granola for therapists and counselors who want to stay present during sessions',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Granola for Therapists: AI Notes Without a Bot Joining',
    description:
      'A one-button session capture workflow that keeps an extra recording bot out of the call.',
    images: [pageImage],
    creator: '@zackproser',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${pageUrl}#webpage`,
      url: pageUrl,
      name: 'Granola for Therapists: AI Notes Without a Bot Joining',
      description:
        'A practical look at Granola for therapists and counselors who want session documentation without a recording bot joining the call.',
      datePublished: '2026-07-13',
      dateModified: '2026-07-13',
      author: {
        '@type': 'Person',
        name: 'Zachary Proser',
        url: 'https://zackproser.com',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: pageImage,
      },
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ],
}

const workflow = [
  {
    number: '01',
    title: 'Start once',
    text: 'Open Granola and start the session capture. The documentation load collapses to one button.',
  },
  {
    number: '02',
    title: 'Stay in the room',
    text: 'Keep your eyes and attention on the client instead of splitting the conversation with constant writing.',
  },
  {
    number: '03',
    title: 'Review the record',
    text: 'Afterward, check what was agreed, the homework discussed, and the follow-ups that need an owner.',
  },
]

export default function GranolaForTherapistsPage() {
  return (
    <main className="bg-[#faf9f6] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
        >
          <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl dark:bg-teal-900/20" />
          <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-amber-100/70 blur-3xl dark:bg-amber-900/10" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
              Granola for therapists and counselors
            </p>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-6xl sm:leading-[1.05]">
              Stay with the client. Let one button carry the documentation load.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              Granola captures the conversation locally on your device, without
              sending a recording bot into the call. You keep your eyes up, then
              review the details, commitments, homework, and follow-ups
              afterward.
            </p>
            <p className="mt-5 text-sm font-medium text-zinc-700 dark:text-zinc-300">
              New users get their first 3 months free through my referral link.
            </p>
            <span className="mt-7 block [&>a]:inline-flex [&>a]:rounded-lg [&>a]:bg-teal-700 [&>a]:px-5 [&>a]:py-3 [&>a]:text-sm [&>a]:font-semibold [&>a]:text-white [&>a]:no-underline [&>a]:shadow-sm [&>a]:transition-colors hover:[&>a]:bg-teal-600">
              <AffiliateLink
                product="granola"
                campaign={campaign}
                placement="hero-card"
              >
                Try Granola on an approved call →
              </AffiliateLink>
            </span>
            <p className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              Affiliate link. I may earn a commission if you sign up.
            </p>
          </div>

          <aside className="rounded-3xl border border-zinc-200 bg-white/90 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
              The session state
            </p>
            <div className="mt-6 flex items-center gap-3 rounded-2xl bg-teal-50 p-4 dark:bg-teal-950/50">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-40" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-teal-600" />
              </span>
              <div>
                <p className="font-semibold text-zinc-950 dark:text-white">
                  Capture running
                </p>
                <p className="mt-0.5 text-sm text-zinc-600 dark:text-zinc-300">
                  No bot participant in the call
                </p>
              </div>
            </div>
            <ul className="mt-6 space-y-4 text-sm leading-6 text-zinc-700 dark:text-zinc-300">
              <li className="flex gap-3">
                <span className="font-mono text-teal-700 dark:text-teal-300">
                  ✓
                </span>
                Key details and agreements are captured
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-teal-700 dark:text-teal-300">
                  ✓
                </span>
                Notes stay available for review after the session
              </li>
              <li className="flex gap-3">
                <span className="font-mono text-teal-700 dark:text-teal-300">
                  ✓
                </span>
                Sharing with a supervisee or colleague takes one click
              </li>
            </ul>
            <p className="mt-6 border-t border-zinc-200 pt-5 text-xs leading-5 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
              Use only with appropriate disclosure and consent.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            Why I use it
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            My entire meeting routine is one action
          </h2>
          <div className="mt-6 space-y-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
            <p>
              I am not a therapist. I am an applied AI engineer who uses Granola
              every day: personal calls, every work meeting, and consulting
              sessions. I click start, and I know the details, decisions, and
              owners will be there when the call ends.
            </p>
            <p>
              I am partly hard of hearing, so live transcript search matters to
              me. If I miss a phrase or lose the thread for a moment, I can
              quietly check what was said without stopping the speaker. That
              lowers my meeting anxiety even when I am paying full attention.
            </p>
            <p>
              For a therapist, the same workflow means less attention spent on
              the mechanics of remembering. The client gets your presence. You
              still get a record to check and edit after the room is quiet.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {workflow.map((step) => (
            <article
              key={step.number}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="font-mono text-xs font-semibold text-teal-700 dark:text-teal-300">
                {step.number}
              </p>
              <h3 className="mt-4 text-lg font-semibold text-zinc-950 dark:text-white">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="session-comparison"
        className="border-y border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900/40"
      >
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              The room changes when another participant appears
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              AI notes without a bot joining the session
            </h2>
            <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              A visible recording bot can change the opening tone before the
              real conversation begins. Granola captures on your device, so the
              participant list stays between the people who came to talk.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <CaptureComparison />
            <DocumentationCalculator />
          </div>

          <div className="mt-10 rounded-2xl border border-teal-200 bg-teal-50 p-6 dark:border-teal-900 dark:bg-teal-950/40 sm:flex sm:items-center sm:justify-between sm:gap-8">
            <div>
              <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
                Test the one-button workflow on your own calendar
              </h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-300">
                New users get their first 3 months free. Start with supervision,
                consultation, or another session type your policies allow.
              </p>
            </div>
            <div className="mt-5 shrink-0 sm:mt-0">
              <InlineAffiliateCTA product="granola" campaign={campaign} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
            After the session
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
            The record exists when you need it
          </h2>
        </div>
        <div className="space-y-8">
          <div className="border-l-2 border-teal-600 pl-5">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
              Review before you write
            </h3>
            <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-300">
              Check the notes and transcript for what was agreed, who owns a
              follow-up, and any homework discussed. Treat the output as source
              material that needs your review.
            </p>
          </div>
          <div className="border-l-2 border-teal-600 pl-5">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
              Re-check a missed phrase
            </h3>
            <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-300">
              Live transcript search lets you recover a phrase during the
              conversation. I use this because I am partly hard of hearing; the
              speaker can keep talking while I catch up.
            </p>
          </div>
          <div className="border-l-2 border-teal-600 pl-5">
            <h3 className="text-lg font-semibold text-zinc-950 dark:text-white">
              Share deliberately
            </h3>
            <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-300">
              Notes and transcripts can be shared in one click with an
              authorized supervisee, colleague, or client. Decide who should
              receive them before you send anything.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-amber-50/70 dark:border-zinc-800 dark:bg-amber-950/10">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-800 dark:text-amber-300">
            Privacy and professional obligations
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-zinc-950 dark:text-white">
            Verify the rules that apply to your practice
          </h2>
          <p className="mt-5 text-base leading-7 text-zinc-700 dark:text-zinc-300">
            Local capture and the absence of a meeting bot make Granola a
            privacy-conscious option to evaluate. Before using any AI tool with
            a client session, verify your jurisdiction&apos;s rules, licensing
            requirements, employer or practice policies, insurance requirements,
            data-handling standards, and consent process. A quieter participant
            list does not change those obligations.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              Questions therapists ask
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white sm:text-4xl">
              Granola and session documentation
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Granola provides a meeting record to review. The therapist remains
              responsible for consent, accuracy, judgment, retention, and the
              final documentation.
            </p>
          </div>
          <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {faq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-950 marker:content-none dark:text-white">
                  {item.question}
                  <span
                    className="text-xl font-normal text-teal-700 transition-transform group-open:rotate-45 dark:text-teal-300"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                Keep reading
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
                Put this in context
              </h2>
              <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">
                These guides cover session notes, adjacent care work, coaching
                conversations, and my full Granola workflow.
              </p>
            </div>
            <nav
              className="grid gap-3"
              aria-label="Related Granola and voice AI guides"
            >
              <Link
                href="/blog/granola-for-therapists-2026"
                className="rounded-xl border border-zinc-200 bg-white p-5 font-semibold text-zinc-900 no-underline transition hover:border-teal-600 hover:text-teal-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-teal-400 dark:hover:text-teal-200"
              >
                Granola for therapists: the session-note guide →
              </Link>
              <Link
                href="/blog/ai-voice-tools-for-social-workers"
                className="rounded-xl border border-zinc-200 bg-white p-5 font-semibold text-zinc-900 no-underline transition hover:border-teal-600 hover:text-teal-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-teal-400 dark:hover:text-teal-200"
              >
                AI voice tools for social workers →
              </Link>
              <Link
                href="/blog/granola-for-life-coaches"
                className="rounded-xl border border-zinc-200 bg-white p-5 font-semibold text-zinc-900 no-underline transition hover:border-teal-600 hover:text-teal-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-teal-400 dark:hover:text-teal-200"
              >
                Granola for life coaches →
              </Link>
              <Link
                href="/granola"
                className="rounded-xl border border-zinc-200 bg-white p-5 font-semibold text-zinc-900 no-underline transition hover:border-teal-600 hover:text-teal-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white dark:hover:border-teal-400 dark:hover:text-teal-200"
              >
                My full Granola review and daily workflow →
              </Link>
            </nav>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-10 text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:px-8">
          <p>
            Affiliate disclosure: If you sign up through my{' '}
            <AffiliateLink product="granola" campaign={campaign}>
              Granola referral link
            </AffiliateLink>
            , I may earn a commission. New users get their first 3 months free.
            I use Granola every day for personal calls, work meetings, and
            consulting calls.
          </p>
        </div>
      </footer>
    </main>
  )
}
