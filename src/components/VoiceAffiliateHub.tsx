'use client'

import Link from 'next/link'
import { Mic, Calendar, ArrowRight } from 'lucide-react'
import { InlineAffiliateCTA } from '@/components/StickyAffiliateCTA'

interface VoiceAffiliateHubProps {
  campaign?: string
}

const RESOURCE_LINKS = [
  {
    title: 'WisprFlow Review: 179 WPM Voice-Driven Development',
    description: 'Setup, workflows, and the exact hotkeys that make dictation feel native.',
    href: '/blog/wisprflow-review',
  },
  {
    title: 'Granola AI Review: No More Note-Taking Anxiety',
    description: 'Why invisible meeting capture beats bot-based tools.',
    href: '/blog/granola-ai-review',
  },
  {
    title: 'Granola vs Otter: Which Meeting Notes App Wins?',
    description: 'Side-by-side breakdown on privacy, workflow, and accuracy.',
    href: '/blog/granola-vs-otter-which-is-better',
  },
  {
    title: 'WisprFlow vs Whisper: Dictation Accuracy Showdown',
    description: 'When to choose local transcription vs system-wide dictation.',
    href: '/blog/wisprflow-vs-whisper',
  },
]

export default function VoiceAffiliateHub({ campaign = 'unknown' }: VoiceAffiliateHubProps) {
  return (
    <section className="mt-12 rounded-3xl border border-amber-100 bg-amber-50/60 p-6 shadow-sm dark:border-amber-900/40 dark:bg-zinc-900/40">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700 dark:text-amber-300">
            Voice-first revenue lane
          </p>
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
            Turn the insight into action with the exact tools I use
          </h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            These posts already rank, but most readers never see the best next step. Give them a clear path:
            start dictation with WisprFlow, then capture meetings with Granola.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <InlineAffiliateCTA product="wisprflow" campaign={campaign} />
          <InlineAffiliateCTA product="granola" campaign={campaign} />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {RESOURCE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-2xl border border-amber-200/70 bg-white/80 p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-md dark:border-amber-900/40 dark:bg-zinc-900"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                  {link.href.includes('wisprflow') ? <Mic className="h-5 w-5" /> : <Calendar className="h-5 w-5" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {link.title}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {link.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                    Read guide
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
