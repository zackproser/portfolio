'use client'

import { useRef } from 'react'
import { ExternalLink } from 'lucide-react'

export function SlidevEmbed({ src, title }) {
  const iframeRef = useRef(null)

  return (
    <div>
      <div className="relative rounded-lg border border-zinc-200 dark:border-zinc-700">
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className="w-full border-0 rounded-lg"
          style={{ aspectRatio: '16/9' }}
          allow="fullscreen"
          loading="lazy"
        ></iframe>
      </div>
      <div className="flex items-start justify-between gap-4 mt-2">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Click the deck, then use <kbd className="px-1.5 py-0.5 text-xs rounded border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800">←</kbd> and <kbd className="px-1.5 py-0.5 text-xs rounded border border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-800">→</kbd> to navigate. On tablet or mobile, open full screen and use the nav controls that appear at the bottom-left on tap.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-burnt-400 dark:text-amber-400 hover:text-burnt-500 dark:hover:text-amber-300 transition-colors shrink-0"
        >
          Full screen
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
