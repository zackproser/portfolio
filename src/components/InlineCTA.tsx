'use client'

import { CheckCircle, Mail } from 'lucide-react'
import { useEmailCapture } from '@/hooks/useEmailCapture'

type InlineCTAProps = {
  heading: string
  blurb?: string
}

// Compact, horizontal body-interleaved email capture. Designed to be a
// narrow strip that reads like a pull-quote, not a 400px-tall form that
// breaks the reading flow. Self-contained form submission so it doesn't
// depend on the taller NewsletterSignupInline component.
export function InlineCTA({ heading, blurb }: InlineCTAProps) {
  const { email, setEmail, status, submitEmail } = useEmailCapture()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await submitEmail(email)
  }

  return (
    <aside className="my-8 rounded-xl border border-orange-400/40 bg-orange-50/60 px-5 py-4 md:px-6 md:py-5 dark:border-orange-400/30 dark:bg-orange-950/20">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-5">
        <div className="flex-1">
          <p className="text-sm font-semibold leading-snug text-orange-900 md:text-base dark:text-orange-200">
            {heading}
          </p>
          {blurb && (
            <p className="mt-1 text-xs leading-snug text-zinc-600 md:text-sm dark:text-zinc-400">
              {blurb}
            </p>
          )}
        </div>
        {status === 'success' ? (
          <div className="flex items-center gap-2 rounded-md bg-green-100 px-3 py-2 text-sm font-medium text-green-800 dark:bg-green-900/30 dark:text-green-200">
            <CheckCircle className="h-4 w-4" />
            Subscribed — check your inbox.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-stretch gap-2 md:w-auto md:min-w-[22rem]"
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-md border border-zinc-300 bg-white pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="rounded-md bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 disabled:opacity-60 dark:bg-orange-500 dark:hover:bg-orange-400"
            >
              {status === 'loading' ? '…' : 'Send me more'}
            </button>
          </form>
        )}
      </div>
    </aside>
  )
}
