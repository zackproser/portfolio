import Link from 'next/link'
import type { Route } from 'next'

interface SectionHeadProps {
  num: string
  title: string
  moreHref?: string
  moreLabel?: string
}

export function SectionHead({ num, title, moreHref, moreLabel = 'Archive →' }: SectionHeadProps) {
  return (
    <header className="editorial-section-head text-charcoal-50 dark:text-parchment-100">
      <div className="editorial-section-num">§ {num}</div>
      <h2 className="editorial-section-title">{title}</h2>
      {moreHref ? (
        <Link href={moreHref as Route} className="editorial-section-more text-burnt-400 dark:text-amber-400 hover:underline">
          {moreLabel}
        </Link>
      ) : <span />}
    </header>
  )
}
