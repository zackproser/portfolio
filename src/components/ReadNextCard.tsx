import Link from 'next/link'
import type { Route } from 'next'
import { ArrowRight } from 'lucide-react'

interface ReadNextCardProps {
  /** Image URL (hosted on the CDN) */
  image: string
  imageAlt: string
  /** Small eyebrow label */
  eyebrow?: string
  title: string
  description: string
  /** Internal article href */
  href: string
}

// Inline styles override the blog's `.post-body img { border; margin; height }`
// and `.post-body a { text-decoration }` rules (higher specificity than utilities).
const imgReset: React.CSSProperties = {
  margin: 0,
  border: 'none',
  borderRadius: 0,
  display: 'block',
  height: '100%',
  width: '100%',
  objectFit: 'cover',
}

export default function ReadNextCard({
  image,
  imageAlt,
  eyebrow = 'Read this next',
  title,
  description,
  href,
}: ReadNextCardProps) {
  return (
    <aside className="not-prose my-10">
      <Link
        href={href as Route}
        style={{ textDecoration: 'none' }}
        className="group flex flex-col overflow-clip rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg sm:flex-row sm:items-stretch dark:border-zinc-700/70 dark:bg-zinc-900 dark:hover:border-amber-500/60"
      >
        <div className="aspect-[16/10] w-full overflow-clip bg-zinc-100 sm:aspect-auto sm:w-[44%] dark:bg-zinc-950">
          <img src={image} alt={imageAlt} loading="lazy" style={imgReset} />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-2 p-5 sm:p-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
            {eyebrow}
          </span>
          <h3 className="text-lg font-bold leading-snug text-zinc-900 dark:text-zinc-50 sm:text-xl">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {description}
          </p>
          <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-burnt-500 dark:text-amber-400">
            Read the article
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </aside>
  )
}
