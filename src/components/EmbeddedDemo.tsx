'use client'

import { useState } from 'react'
import { ArrowUpRight, Loader2 } from 'lucide-react'

/**
 * Inline-embeds one of the interactive demos inside a blog post via an iframe.
 * The demo pages honor `?embed=1` to drop their hero and outer chrome so they
 * sit cleanly in the body of an article. Extra query params (e.g. a preset
 * site) deep-link the embedded demo into a specific state.
 */
interface EmbeddedDemoProps {
  slug: string
  title: string
  params?: Record<string, string>
  height?: number
}

export default function EmbeddedDemo({ slug, title, params, height = 760 }: EmbeddedDemoProps) {
  const [loaded, setLoaded] = useState(false)
  const query = new URLSearchParams({ embed: '1', ...(params ?? {}) }).toString()
  const src = `/demos/${slug}?${query}`
  const full = `/demos/${slug}${params ? `?${new URLSearchParams(params).toString()}` : ''}`

  return (
    <figure className="not-prose my-8">
      <div className="overflow-hidden rounded-xl border border-zinc-200 shadow-sm dark:border-zinc-800">
        <div className="flex items-center justify-between gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2 dark:border-zinc-800 dark:bg-zinc-900">
          <span className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            Live demo — {title}
          </span>
          <a
            href={full}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Open full demo <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
        <div className="relative bg-white dark:bg-zinc-950" style={{ height }}>
          {!loaded && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-zinc-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading the interactive demo…
            </div>
          )}
          <iframe
            src={src}
            title={title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            className="h-full w-full"
            style={{ border: 0 }}
          />
        </div>
      </div>
    </figure>
  )
}
