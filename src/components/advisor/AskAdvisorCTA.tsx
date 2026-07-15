'use client'

import Link from 'next/link'
import { track } from '@vercel/analytics'
import { ArrowRight, MessagesSquare } from 'lucide-react'

interface AskAdvisorCTAProps {
  from: string
  variant?: 'compact' | 'card'
  isDark?: boolean
  className?: string
}

export function AskAdvisorCTA({
  from,
  variant = 'card',
  isDark = false,
  className = '',
}: AskAdvisorCTAProps) {
  const copy = (
    <>
      <strong>Not sure which tool fits?</strong>{' '}
      <span>Ask the advisor — a question or two, then a straight answer.</span>
    </>
  )

  if (variant === 'compact') {
    return (
      <Link
        href="/advisor"
        onClick={() => track('advisor_entry_click', { from })}
        className={`group flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50/80 px-4 py-3 text-sm text-slate-700 no-underline transition hover:border-teal-400 hover:bg-teal-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500 dark:border-teal-800/70 dark:bg-teal-950/30 dark:text-slate-200 dark:hover:border-teal-600 ${className}`}
      >
        <MessagesSquare className="h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400" aria-hidden="true" />
        <span className="min-w-0 flex-1">{copy}</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-teal-600 transition-transform group-hover:translate-x-0.5 dark:text-teal-400" aria-hidden="true" />
      </Link>
    )
  }

  return (
    <Link
      href="/advisor"
      onClick={() => track('advisor_entry_click', { from })}
      className={`group flex items-center gap-4 rounded-2xl border p-5 no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
        isDark
          ? 'border-slate-700 bg-slate-800/70 text-slate-200 hover:border-amber-500/70 focus-visible:outline-amber-400'
          : 'border-parchment-200 bg-white text-charcoal-50 hover:border-burnt-400/60 focus-visible:outline-burnt-400 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-200 dark:hover:border-amber-500/70 dark:focus-visible:outline-amber-400'
      } ${className}`}
    >
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
        isDark
          ? 'bg-amber-500/15 text-amber-400'
          : 'bg-burnt-400/10 text-burnt-500 dark:bg-amber-500/15 dark:text-amber-400'
      }`}>
        <MessagesSquare className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 leading-relaxed">{copy}</span>
      <ArrowRight className={`h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1 ${
        isDark ? 'text-amber-400' : 'text-burnt-500 dark:text-amber-400'
      }`} aria-hidden="true" />
    </Link>
  )
}

export default AskAdvisorCTA
