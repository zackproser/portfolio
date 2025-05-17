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
    <div className="my-8 p-8 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 rounded-xl shadow-xl border border-zinc-300 dark:border-zinc-700">
      <NewsletterWrapper
        title={header || 'Sign in & subscribe to read for free'}
        body={body || 'Sign in to zackproser.com and subscribe to unlock this article.'}
        successMessage="Thanks for subscribing! Refresh to view the full article."
        position="paywall"
      />
    </div>
  )
}
