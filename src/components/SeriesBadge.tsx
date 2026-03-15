'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'

interface SeriesBadgeProps {
  series: {
    name: string
    slug: string
    order?: number
  }
  /** compact = small inline pill (for ContentCard); full = banner (for ArticleLayout) */
  variant?: 'compact' | 'full'
  /** Whether to render as a link (default: true) */
  asLink?: boolean
}

export function SeriesBadge({ series, variant = 'compact', asLink = true }: SeriesBadgeProps) {
  const href = `/series/${series.slug}` as const

  if (variant === 'compact') {
    const content = (
      <>
        <BookOpen className="w-3 h-3 flex-shrink-0" />
        <span>{series.name}</span>
        {series.order != null && (
          <span className="rounded-full bg-violet-200 dark:bg-violet-700 px-1.5 py-0.5 text-[10px] font-bold leading-none">
            #{series.order}
          </span>
        )}
      </>
    )

    const className = "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200 border border-violet-200 dark:border-violet-700/50 hover:bg-violet-200 dark:hover:bg-violet-800/70 transition-colors"

    if (!asLink) {
      return (
        <span className={className}>
          {content}
        </span>
      )
    }

    return (
      <Link
        href={href}
        onClick={(e) => e.stopPropagation()}
        className={className}
      >
        {content}
      </Link>
    )
  }

  // Full banner — used inside ArticleLayout above the title
  return (
    <div className="mb-4">
      <Link
        href={href}
        className="group inline-flex items-center gap-2 rounded-xl px-4 py-2.5
          bg-violet-50 dark:bg-violet-950/50
          border border-violet-200 dark:border-violet-800
          hover:border-violet-400 dark:hover:border-violet-600
          transition-all"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 dark:bg-violet-500 text-white flex-shrink-0">
          <BookOpen className="w-3.5 h-3.5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-500 dark:text-violet-400 leading-none mb-0.5">
            Part of a series
          </p>
          <p className="text-sm font-semibold text-violet-900 dark:text-violet-100 truncate group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
            {series.name}
            {series.order != null && <span className="ml-1.5 text-violet-500 dark:text-violet-400 font-normal">· #{series.order}</span>}
          </p>
        </div>
        <span className="ml-auto text-xs text-violet-500 dark:text-violet-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">
          View all →
        </span>
      </Link>
    </div>
  )
}
