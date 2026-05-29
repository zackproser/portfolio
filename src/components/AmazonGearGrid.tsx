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
  ShoppingCart,
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

export interface GearItem {
  /** Product name as it should display on the card */
  name: string
  /** One-line reason it's in the house */
  why: string
  /** Amazon affiliate URL */
  href: string
  /** Icon keyword for the category */
  icon: GearIcon
  /** Optional meta line, e.g. "4× indoor" or "Planned" */
  meta?: string
  /** Whether Zack already runs this (shows an "In the house" pill) */
  owned?: boolean
}

interface AmazonGearGridProps {
  items: GearItem[]
  /** Page slug for click tracking */
  campaign?: string
}

export default function AmazonGearGrid({ items, campaign = 'unknown' }: AmazonGearGridProps) {
  return (
    <div className="not-prose my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const Icon = ICONS[item.icon] ?? ShoppingCart
        return (
          <div
            key={item.name}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-300 hover:shadow-lg dark:border-zinc-700/70 dark:bg-zinc-900 dark:hover:border-amber-500/60"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-amber-100 group-hover:text-amber-700 dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-amber-500/15 dark:group-hover:text-amber-400">
                <Icon className="h-5 w-5" />
              </div>
              {item.meta && (
                <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
                  {item.meta}
                </span>
              )}
            </div>

            <h3 className="mb-1 text-base font-semibold leading-snug text-zinc-900 dark:text-zinc-100">
              {item.name}
            </h3>
            <p className="mb-4 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {item.why}
            </p>

            <div className="mt-auto flex items-center justify-between gap-2">
              {item.owned && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  In the house
                </span>
              )}
              <a
                href={item.href}
                target="_blank"
                rel="sponsored nofollow noopener noreferrer"
                onClick={() => track('amazon_gear_click', { product: item.name, campaign })}
                className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-2 text-sm font-semibold !text-white no-underline shadow-sm transition-all duration-200 hover:from-amber-400 hover:to-orange-500 hover:shadow-md"
              >
                <ShoppingCart className="h-3.5 w-3.5 !text-white" />
                <span className="!text-white">View on Amazon</span>
              </a>
            </div>
          </div>
        )
      })}
    </div>
  )
}
