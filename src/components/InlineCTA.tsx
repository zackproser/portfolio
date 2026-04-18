'use client'

import { CheckCircle } from 'lucide-react'
import { useEmailCapture } from '@/hooks/useEmailCapture'

type InlineCTAProps = {
  heading: string
  // Intentionally no blurb — the CTA has to stay one-line tall.
}

// Single-line body-interleaved email capture. One line of copy, inline
// email field, single submit button — ~56px tall total (grows by one line
// only when the submission errors). If you need more context for the CTA,
// put it in the surrounding paragraph, not here.
export function InlineCTA({ heading }: InlineCTAProps) {
  const { email, setEmail, status, submitEmail } = useEmailCapture()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitEmail(email)
  }

  return (
    <aside className="my-6 flex flex-col gap-1.5 rounded-lg border border-amber-400/30 bg-amber-50/60 px-4 py-2 text-sm dark:border-amber-400/20 dark:bg-amber-950/20">
      <div className="flex items-center gap-3">
        {/* Heading `min-w-0 flex-1 truncate` so long copy ellipsizes instead
            of pushing the form past the right edge. Keep headings short. */}
        <span className="min-w-0 flex-1 truncate font-semibold text-amber-900 dark:text-amber-100">
          {heading}
        </span>
        {status === 'success' ? (
          <span className="flex shrink-0 items-center gap-1.5 text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            subscribed.
          </span>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex shrink-0 items-center gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-44 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-md bg-amber-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-amber-700 disabled:opacity-60 dark:bg-amber-500/90 dark:hover:bg-amber-500"
            >
              {status === 'loading' ? '…' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
      {status === 'error' && (
        <p className="text-xs text-red-600 dark:text-red-400">
          Submission failed. Please try again.
        </p>
      )}
    </aside>
  )
}
