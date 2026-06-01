'use client'

import { track } from '@vercel/analytics'
import { ArrowUpRight } from 'lucide-react'

interface GearSpotlightProps {
  /** Product name */
  name: string
  /** One punchy sentence on why it earns its place */
  why: string
  /** Amazon affiliate URL */
  href: string
  /** Product image URL (hosted on the CDN) */
  image: string
  /** Alt text for the product image */
  imageAlt: string
  /** Small eyebrow label above the name */
  eyebrow?: string
  /** Short spec chips, e.g. ["Wi-Fi 7", "Whole-home mesh"] */
  specs?: string[]
  /** Whether Zack runs this today */
  owned?: boolean
  /** Page slug for click tracking */
  campaign?: string
}

// Inline styles override the blog's `.post-body img { border; margin; height; ... }`
// and `.post-body a { text-decoration }` rules, which have higher selector
// specificity than utility classes.
const imgReset: React.CSSProperties = {
  margin: 0,
  border: 'none',
  borderRadius: 0,
  display: 'block',
  height: '100%',
  width: '100%',
  objectFit: 'contain',
}

export default function GearSpotlight({
  name,
  why,
  href,
  image,
  imageAlt,
  eyebrow = 'The gear',
  specs = [],
  owned = true,
  campaign = 'unknown',
}: GearSpotlightProps) {
  return (
    <aside className="not-prose my-7">
      <a
        href={href}
        target="_blank"
        rel="sponsored nofollow noopener noreferrer"
        onClick={() => track('gear_spotlight_click', { product: name, campaign })}
        style={{ textDecoration: 'none' }}
        className="group block rounded-2xl bg-gradient-to-br from-amber-400/50 via-zinc-300/25 to-cyan-400/40 p-px no-underline shadow-sm transition-all duration-300 hover:shadow-lg dark:from-amber-500/40 dark:via-zinc-700/40 dark:to-cyan-500/30"
      >
        <div className="flex items-stretch gap-4 rounded-2xl bg-white p-3 dark:bg-zinc-950 sm:gap-5 sm:p-4">
          {/* product image on a clean tile */}
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center self-center overflow-clip rounded-xl bg-white p-2 ring-1 ring-zinc-200/80 sm:h-28 sm:w-28 dark:bg-zinc-100 dark:ring-zinc-300/20">
            <img src={image} alt={imageAlt} loading="lazy" style={imgReset} />
          </div>

          {/* copy */}
          <div className="flex min-w-0 flex-1 flex-col justify-center py-1">
            <div className="mb-1 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-400">
                {eyebrow}
              </span>
              {owned && (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  In the house
                </span>
              )}
            </div>

            <h3 className="text-base font-bold leading-snug text-zinc-900 dark:text-zinc-50">
              {name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-zinc-600 dark:text-zinc-400">
              {why}
            </p>

            {specs.length > 0 && (
              <div className="mt-2 hidden flex-wrap gap-1.5 sm:flex">
                {specs.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            <span className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-1.5 text-xs font-semibold !text-white shadow-sm transition-all duration-200 group-hover:from-amber-400 group-hover:to-orange-500 group-hover:shadow-md">
              <span className="!text-white">View on Amazon</span>
              <ArrowUpRight className="h-3.5 w-3.5 !text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </a>
    </aside>
  )
}
