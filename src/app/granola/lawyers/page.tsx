import type { Metadata } from 'next'
import Link from 'next/link'
import { AffiliateLink, InlineAffiliateCTA } from '@/components/StickyAffiliateCTA'
import BillableTimeCalculator from './BillableTimeCalculator'
import IntakeNotesDemo from './IntakeNotesDemo'

const PAGE_URL = 'https://zackproser.com/granola/lawyers'
const PAGE_IMAGE = 'https://zackproser.b-cdn.net/images/granola-hero.webp'
const CAMPAIGN = 'granola-lawyers'

export const metadata: Metadata = {
  title: 'Granola for Lawyers: AI Meeting Notes for Client Intake',
  description:
    'See how Granola fits attorney client intake: no meeting bot, live transcript re-checks, structured intake notes, and an editable billable-time calculator.',
  authors: [{ name: 'Zachary Proser', url: 'https://zackproser.com' }],
  keywords: [
    'Granola for lawyers',
    'AI meeting notes for attorneys',
    'client intake notes software',
    'legal client meeting notes',
    'AI notetaker for lawyers',
    'attorney intake documentation',
  ],
  alternates: { canonical: PAGE_URL },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: PAGE_URL,
    title: 'Granola for Lawyers: Client Intake Notes Without a Meeting Bot',
    description:
      'A practical look at Granola for client intake, including live transcript re-checks, structured notes, handoff, and editable cost math.',
    siteName: 'Zachary Proser',
    images: [
      {
        url: PAGE_IMAGE,
        width: 1200,
        height: 630,
        alt: 'Granola AI meeting notes interface',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Granola for Lawyers: AI Meeting Notes for Client Intake',
    description: 'No meeting bot, live re-checks, structured intake notes, and honest billable-time math.',
    images: [PAGE_IMAGE],
    creator: '@zackproser',
  },
}

const faq = [
  {
    question: 'Does Granola join a client call as a meeting bot?',
    answer:
      'No. Granola captures the meeting without adding a bot participant to the call. Attorneys still need to follow firm policy, client agreements, and applicable consent rules.',
  },
  {
    question: 'Can I check a detail while the meeting is still happening?',
    answer:
      'Yes. You can query the live transcript during the meeting to re-check a date, amount, name, or other detail, then confirm it against the transcript.',
  },
  {
    question: 'Can Granola produce client intake notes?',
    answer:
      'Granola can turn a captured meeting into structured notes. A legal intake template can organize the matter, dates, amounts, client ask, and action items, subject to attorney review.',
  },
  {
    question: 'Does Granola replace legal practice management software?',
    answer:
      'Granola handles meeting capture, transcripts, notes, and sharing. Treat the reviewed output as an input to the systems and processes your practice already uses.',
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: 'Granola for Lawyers: AI Meeting Notes for Client Intake',
      description:
        'A practical guide to Granola for attorney client intake, live transcript re-checking, structured notes, and practice handoff.',
      inLanguage: 'en-US',
      datePublished: '2026-07-13',
      dateModified: '2026-07-13',
      author: {
        '@type': 'Person',
        name: 'Zachary Proser',
        url: 'https://zackproser.com',
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
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Granola',
          item: 'https://zackproser.com/granola',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Granola for lawyers',
          item: PAGE_URL,
        },
      ],
    },
  ],
}

const workflow = [
  {
    number: '01',
    title: 'Start the meeting',
    body: 'Open Granola at the beginning of the consult. No meeting bot appears in the participant list or announces itself into the conversation.',
  },
  {
    number: '02',
    title: 'Stay with the client',
    body: 'Listen for the story instead of trying to preserve every date and figure by hand. Query the transcript mid-meeting when a detail needs a quiet re-check.',
  },
  {
    number: '03',
    title: 'Review the intake record',
    body: 'Check the structured notes against the transcript, correct legal facts, and share the reviewed record with the paralegal, colleague, or practice workspace.',
  },
]

const relatedLinks = [
  {
    href: '/blog/granola-for-bankruptcy-attorneys',
    title: 'Granola for bankruptcy attorneys',
    description: 'Client finances, creditor meetings, and debt-relief intake.',
  },
  {
    href: '/blog/granola-for-patent-attorneys',
    title: 'Granola for patent attorneys',
    description: 'Inventor interviews, technical details, and prosecution meetings.',
  },
  {
    href: '/blog/ai-dictation-for-legal-documents',
    title: 'AI dictation for legal documents',
    description: 'A separate voice workflow for drafting briefs, motions, and memos.',
  },
] as const

export default function GranolaForLawyersPage() {
  return (
    <main className="bg-white text-zinc-950 dark:bg-zinc-950 dark:text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_12%,rgba(13,148,136,0.14),transparent_34%),radial-gradient(circle_at_12%_88%,rgba(15,23,42,0.08),transparent_30%)] dark:bg-[radial-gradient(circle_at_80%_12%,rgba(20,184,166,0.14),transparent_34%),radial-gradient(circle_at_12%_88%,rgba(255,255,255,0.05),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-28">
          <div>
            <div className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-teal-800 dark:border-teal-900 dark:bg-teal-950/30 dark:text-teal-300">
              Granola for lawyers
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold tracking-[-0.035em] text-zinc-950 dark:text-white sm:text-5xl lg:text-6xl lg:leading-[1.04]">
              Leave each client call with the intake record in front of you.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
              I use Granola in every work meeting and consulting call. One click covers the details, agreements, and owners, and I can re-check the transcript while the meeting is still happening.
            </p>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-600 dark:text-zinc-400">
              <span className="flex items-center gap-2"><span className="text-teal-600" aria-hidden="true">●</span> No bot joins the call</span>
              <span className="flex items-center gap-2"><span className="text-teal-600" aria-hidden="true">●</span> Live transcript re-checks</span>
              <span className="flex items-center gap-2"><span className="text-teal-600" aria-hidden="true">●</span> One-click note sharing</span>
            </div>
          </div>

          <aside className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl shadow-zinc-950/10 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Start with one client meeting</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
              Capture the intake. Review the record. Send the handoff.
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              New users get their first 3 months free through my Granola link.
            </p>
            <span className="mt-6 block [&>a]:inline-flex [&>a]:items-center [&>a]:gap-2 [&>a]:rounded-xl [&>a]:bg-teal-700 [&>a]:px-5 [&>a]:py-3 [&>a]:text-sm [&>a]:font-semibold [&>a]:text-white [&>a]:no-underline [&>a]:transition-colors hover:[&>a]:bg-teal-600">
              <AffiliateLink product="granola" campaign={CAMPAIGN} placement="hero-card">
                Try Granola for your next meeting <span aria-hidden="true">→</span>
              </AffiliateLink>
            </span>
            <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              Affiliate disclosure: I may earn a commission if you sign up through this link, at no added cost to you.
            </p>
          </aside>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">The practical value</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The meeting stops competing with your memory.</h2>
          </div>
          <div className="space-y-5 text-base leading-7 text-zinc-600 dark:text-zinc-300">
            <p>
              I’m partly hard of hearing. Even when I’m paying full attention, I sometimes need to confirm a word, date, or number. Granola lets me quietly query the live transcript instead of stopping the conversation and asking someone to repeat it.
            </p>
            <p>
              For attorneys comparing client intake notes software, the useful test is narrow: can you preserve the exact client ask, re-check details during the consult, and give a reviewed record to the next person? Granola covers that workflow. You can keep eye contact, hear the client’s account, and send the notes or transcript to the teammate responsible for the next step.
            </p>
            <p>
              Legal consultations can begin with sensitive facts. Granola adds no meeting participant, so there is no bot introduction taking up space when the client needs to speak candidly.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-zinc-200 ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-800 md:grid-cols-3">
          {[
            ['No participant bot', 'Granola captures the meeting without sending a named bot into the call. The client conversation stays between the people you invited.'],
            ['A live second look', 'Re-check what was said while the meeting is running, then verify the answer against the underlying transcript.'],
            ['A clean handoff', 'Share reviewed notes or the transcript in one click so the paralegal, attorney, or client team can pick up the next action.'],
          ].map(([title, body]) => (
            <div key={title} className="bg-white p-6 dark:bg-zinc-950 sm:p-8">
              <h3 className="font-bold text-zinc-950 dark:text-white">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{body}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
          No-bot capture still requires good judgment. Follow your firm’s confidentiality policies, client agreements, and the recording-consent law that applies to the conversation.
        </p>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Billable-time calculator</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Put a number on after-call note reconstruction.</h2>
            <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
              The default assumes 10 minutes spent rebuilding notes after a client call. That is an editable example, not a benchmark. Enter your own rate, meeting volume, reconstruction time, and review time.
            </p>
          </div>

          <div className="mt-10">
            <BillableTimeCalculator />
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl border border-teal-200 bg-teal-50 p-5 dark:border-teal-900 dark:bg-teal-950/20 sm:flex-row sm:items-center sm:p-6">
            <div>
              <p className="font-semibold text-teal-950 dark:text-teal-100">Try the workflow on a real meeting.</p>
              <p className="mt-1 text-sm text-teal-800 dark:text-teal-300">New Granola users get their first 3 months free.</p>
            </div>
            <InlineAffiliateCTA product="granola" campaign={CAMPAIGN} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Intake notes demo</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">From consult language to a reviewable intake record.</h2>
          </div>
          <p className="max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-300 lg:justify-self-end">
            This fictional example shows the shape of the workflow: capture the client’s words, organize the matter, and re-check an exact figure without breaking the conversation.
          </p>
        </div>

        <div className="mt-10">
          <IntakeNotesDemo />
        </div>
      </section>

      <section className="border-y border-zinc-200 bg-zinc-950 text-white dark:border-zinc-800">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-300">Call → notes → practice</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">The record is ready for the next person.</h2>
            <p className="mt-4 text-base leading-7 text-zinc-300">
              At WorkOS, Granola is one of the first connectors I wire into new AI systems. I can leave a call and ask an agent to turn the notes into the next set of materials without copying the transcript by hand. A legal practice can apply the same basic handoff carefully: meeting record first, attorney review second, approved destination third.
            </p>
          </div>

          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {workflow.map((step) => (
              <li key={step.number} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <span className="font-mono text-xs text-teal-300">{step.number}</span>
                <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Questions attorneys ask</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Granola and legal intake</h2>
            <p className="mt-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Granola produces a working meeting record. Attorneys remain responsible for review, client communication, confidentiality, retention, and consent.
            </p>
          </div>
          <div className="divide-y divide-zinc-200 border-y border-zinc-200 dark:divide-zinc-800 dark:border-zinc-800">
            {faq.map((item) => (
              <details key={item.question} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-zinc-950 marker:content-none dark:text-white">
                  {item.question}
                  <span className="text-xl font-normal text-teal-700 transition-transform group-open:rotate-45 dark:text-teal-300" aria-hidden="true">+</span>
                </summary>
                <p className="max-w-2xl pt-3 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">Related legal workflows</p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight">Keep evaluating the fit for your practice.</h2>
            </div>
            <Link href="/demos/voice-ai-lawyers" className="text-sm font-semibold text-teal-700 hover:underline dark:text-teal-300">
              Open the interactive voice AI demo for lawyers →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {relatedLinks.map(({ href, title, description }) => (
              <Link
                key={href}
                href={href}
                className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-colors hover:border-teal-400 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-teal-700"
              >
                <h3 className="font-semibold text-zinc-950 group-hover:text-teal-700 dark:text-white dark:group-hover:text-teal-300">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{description}</p>
              </Link>
            ))}
          </div>

          <p className="mt-10 border-t border-zinc-200 pt-6 text-xs leading-5 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            Affiliate disclosure: if you start Granola through <AffiliateLink product="granola" campaign={CAMPAIGN} placement="text-link">my referral link</AffiliateLink>, new users get their first 3 months free and I may earn a commission at no added cost to you.
          </p>
        </div>
      </section>
    </main>
  )
}
