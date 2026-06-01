'use client'

import { track } from '@vercel/analytics'
import {
  Camera,
  Video,
  Bell,
  Wifi,
  Tv,
  Speaker,
  Plug,
  Lightbulb,
  Radar,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react'

type GearIcon =
  | 'camera'
  | 'video'
  | 'doorbell'
  | 'wifi'
  | 'tv'
  | 'speaker'
  | 'plug'
  | 'light'
  | 'sensor'

const ICONS: Record<GearIcon, LucideIcon> = {
  camera: Camera,
  video: Video,
  doorbell: Bell,
  wifi: Wifi,
  tv: Tv,
  speaker: Speaker,
  plug: Plug,
  light: Lightbulb,
  sensor: Radar,
}

interface GearSpotlightProps {
  /** Product name */
  name: string
  /** One or two sentences on why it earns its place */
  why: string
  /** Amazon affiliate URL */
  href: string
  /** Icon keyword for the category */
  icon: GearIcon
  /** Small eyebrow label above the name */
  eyebrow?: string
  /** Short spec chips, e.g. ["HomeKit Secure Video", "Matter", "Wi-Fi 7"] */
  specs?: string[]
  /** Whether Zack runs this today */
  owned?: boolean
  /** Page slug for click tracking */
  campaign?: string
}

export default function GearSpotlight({
  name,
  why,
  href,
  icon,
  eyebrow = 'The gear',
  specs = [],
  owned = true,
  campaign = 'unknown',
}: GearSpotlightProps) {
  const Icon = ICONS[icon]

  return (
    <aside className="not-prose my-10">
      {/* gradient ring */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-400/60 via-zinc-300/30 to-cyan-400/50 p-px shadow-lg dark:from-amber-500/40 dark:via-zinc-700/40 dark:to-cyan-500/30">
        <div className="relative overflow-clip rounded-2xl bg-white dark:bg-zinc-950">
          {/* soft glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-amber-400/20 blur-3xl dark:bg-amber-500/10"
          />
          <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-7">
            {/* icon tile */}
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-900 to-zinc-700 text-amber-300 shadow-inner ring-1 ring-black/10 dark:from-zinc-800 dark:to-zinc-900 dark:ring-white/10">
              <Icon className="h-7 w-7" strokeWidth={1.75} />
            </div>

            {/* content */}
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-400">
                  {eyebrow}
                </span>
                {owned && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    In the house
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold leading-snug text-zinc-900 dark:text-zinc-50 sm:text-xl">
                {name}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {why}
              </p>

              {specs.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {specs.map((s) => (
                    <span
                      key={s}
                      className="rounded-md bg-zinc-100 px-2 py-1 text-[11px] font-medium text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-300"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex-shrink-0 sm:self-center">
              <a
                href={href}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => track('gear_spotlight_click', { product: name, campaign })}
                className="group inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-3 text-sm font-semibold !text-white no-underline shadow-md transition-all duration-200 hover:from-amber-400 hover:to-orange-500 hover:shadow-lg sm:w-auto"
              >
                <span className="!text-white">View on Amazon</span>
                <ArrowUpRight className="h-4 w-4 !text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
