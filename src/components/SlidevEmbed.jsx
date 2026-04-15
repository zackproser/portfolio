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
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Tap the slide then use arrow keys to navigate, or open full screen for touch.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-burnt-400 dark:text-amber-400 hover:text-burnt-500 dark:hover:text-amber-300 transition-colors shrink-0 ml-4"
        >
          Full screen
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
