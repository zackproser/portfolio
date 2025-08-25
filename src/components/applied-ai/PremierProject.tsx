"use client"

import Image from 'next/image'
import Link from 'next/link'

export default function PremierProject() {
  return (
    <section className="py-24 bg-gradient-to-b from-yellow-50 to-white dark:from-gray-900 dark:to-gray-950 border-y border-yellow-200/40 dark:border-yellow-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-400 text-gray-900 mb-4">
              Premier Project
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
              Gabbee.io — AI Phone Call Assistant
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6">
              I conceived, researched, designed, built, deployed, and maintain Gabbee.io — an AI phone call app that
              places calls on your behalf, then delivers transcripts and summaries. This is an end-to-end solo build,
              from market research and positioning to full-stack development, telemetry, growth, and production ops.
            </p>
            <ul className="space-y-3 text-gray-800 dark:text-gray-200 mb-8">
              <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-yellow-500" /> Market research, ICP definition, and messaging</li>
              <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-yellow-500" /> Product design, UX flows, and iteration for conversion</li>
              <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-yellow-500" /> Full-stack implementation with telephony and voice AI</li>
              <li className="flex gap-3"><span className="mt-1 h-2 w-2 rounded-full bg-yellow-500" /> Deployment, analytics, monitoring, and on-call maintenance</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Link href="https://gabbee.io" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 font-medium">
                Visit Gabbee.io
              </Link>
              <Link href="/blog/gabbee-ai-phone-call-app" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium">
                Read the build write-up
              </Link>
            </div>
          </div>
          <div className="relative h-[360px] lg:h-[440px] rounded-2xl overflow-hidden border border-yellow-200/60 dark:border-yellow-900/40">
            <Image
              src={"https://zackproser.b-cdn.net/images/gabbee-hero.webp"}
              alt="Gabbee.io Hero"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

