'use client'

import { CheckCircle } from 'lucide-react'
import { useEmailCapture } from '@/hooks/useEmailCapture'

type InlineCTAProps = {
  heading: string
  // Intentionally no blurb — the CTA has to stay one-line tall.
}

// Single-line body-interleaved email capture. One line of copy, inline
// email field, single submit button — ~56px tall total. If you need more
// context, put it in the surrounding paragraph, not in the CTA.
export function InlineCTA({ heading }: InlineCTAProps) {
  const { email, setEmail, status, submitEmail } = useEmailCapture()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitEmail(email)
  }

  return (
    <aside className="my-6 flex flex-col gap-2 rounded-lg border border-orange-400/40 bg-orange-50/70 px-4 py-2 text-sm dark:border-orange-400/30 dark:bg-orange-950/25">
      <div className="flex items-center gap-3">
        <span className="shrink-0 font-semibold text-orange-900 dark:text-orange-200">
          {heading}
        </span>
        {status === 'success' ? (
          <span className="ml-auto flex items-center gap-1.5 text-green-700 dark:text-green-300">
            <CheckCircle className="h-4 w-4" />
            subscribed.
          </span>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="ml-auto flex items-center gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-48 rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-md bg-orange-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 disabled:opacity-60 dark:bg-orange-500 dark:hover:bg-orange-400"
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
