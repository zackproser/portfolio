'use client'

import NewsletterWrapper from './NewsletterWrapper'

interface EmailSignupGateProps {
  header?: string
  body?: string
}

export default function EmailSignupGate({
  header,
  body
}: EmailSignupGateProps) {
  return (
    <div className="my-8 p-10 max-w-xl mx-auto text-center bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-xl border border-zinc-300 dark:border-zinc-700">
      <NewsletterWrapper
        title={header || 'Unlock This Free Article'}
        body={body || 'Join my mailing list to access the rest of this article for free.'}
        successMessage="Thanks for subscribing! Refresh to view the full article."
        position="paywall"
        disableSticky
      />
    </div>
  )
}
