'use client'

import { NewsletterSignupInline } from './NewsletterSignupInline'

type InlineCTAProps = {
  heading: string
  blurb: string
}

// Body-interleaved email capture. Replaces the floating sticky-capture
// modal on posts that don't want it (set `hideNewsletter: true` in the
// post metadata, then drop a couple of these inline at natural reading
// breaks). Themed variant for this post (ND engineer content).
export function InlineCTA({ heading, blurb }: InlineCTAProps) {
  return (
    <div className="my-12 rounded-2xl border border-orange-400/30 bg-gradient-to-br from-orange-50 to-amber-50 p-6 md:p-7 dark:border-orange-400/30 dark:from-orange-950/30 dark:to-amber-950/20">
      <h3 className="mb-2 text-xl font-bold text-orange-900 dark:text-orange-200">
        {heading}
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-zinc-700 md:text-base dark:text-zinc-300">
        {blurb}
      </p>
      <NewsletterSignupInline variant="light" />
    </div>
  )
}
