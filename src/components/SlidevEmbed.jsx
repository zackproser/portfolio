'use client'

import { useRef } from 'react'
import { ExternalLink } from 'lucide-react'

export function SlidevEmbed({ src, title }) {
  const iframeRef = useRef(null)

  return (
    <div>
      <div className="relative rounded-md border border-parchment-300 dark:border-slate-700 shadow-md overflow-hidden bg-parchment-50 dark:bg-slate-800">
        <iframe
          ref={iframeRef}
          src={src}
          title={title}
          className="w-full border-0 block"
          style={{ aspectRatio: '16/9' }}
          allow="fullscreen"
          loading="lazy"
        ></iframe>
      </div>
      <div className="flex items-start justify-between gap-4 mt-3">
        <p className="text-sm leading-relaxed text-parchment-600 dark:text-slate-400 max-w-[62ch]">
          Click the deck, then use{' '}
          <kbd className="px-1.5 py-0.5 text-xs font-mono rounded border border-parchment-400 dark:border-slate-600 bg-parchment-50 dark:bg-slate-800 text-charcoal-50 dark:text-parchment-100">←</kbd>{' '}
          and{' '}
          <kbd className="px-1.5 py-0.5 text-xs font-mono rounded border border-parchment-400 dark:border-slate-600 bg-parchment-50 dark:bg-slate-800 text-charcoal-50 dark:text-parchment-100">→</kbd>{' '}
          to navigate. On tablet or mobile, open full screen and use the nav controls that appear at the bottom-left on tap.
        </p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] font-semibold text-burnt-400 dark:text-amber-400 hover:text-burnt-500 dark:hover:text-amber-300 transition-colors shrink-0 border-b border-burnt-400/40 dark:border-amber-400/40 pb-0.5"
        >
          Full screen
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  )
}
