'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

/**
 * Theme-aware Mermaid diagram. Renders client-side so it can react to the
 * light/dark toggle (next-themes, `attribute="class"`) and re-render with a
 * matching palette. Colors are mapped to the site's brand (amber accent
 * #e67e22 light / #f39c12 dark, slate text, gray edges) via `theme: 'base'`
 * + themeVariables, so diagrams look native in both modes instead of using
 * Mermaid's stock theme.
 *
 * Usage in MDX:
 *   <Mermaid chart={`
 *     flowchart LR
 *       A["request"] --> B["handler"]
 *   `} />
 *
 * Mermaid is a large library, so it's loaded with a dynamic import — it only
 * ships to pages that actually render a diagram.
 */

const LIGHT_VARS: Record<string, string> = {
  background: '#ffffff',
  primaryColor: '#fdf2e3', // light amber tint (node fill)
  primaryBorderColor: '#e67e22', // brand accent
  primaryTextColor: '#1f2937', // slate-800
  secondaryColor: '#eef2ff',
  secondaryBorderColor: '#3b82f6',
  secondaryTextColor: '#1f2937',
  tertiaryColor: '#f9fafb',
  tertiaryBorderColor: '#d1d5db',
  tertiaryTextColor: '#1f2937',
  lineColor: '#9ca3af', // gray-400 edges
  textColor: '#1f2937',
  noteBkgColor: '#fef3c7',
  noteTextColor: '#1f2937',
  noteBorderColor: '#e67e22',
  fontFamily: 'inherit',
  fontSize: '15px',
}

const DARK_VARS: Record<string, string> = {
  background: '#0b0f19',
  primaryColor: '#1f2937', // slate-800 (node fill)
  primaryBorderColor: '#f39c12', // glowing amber
  primaryTextColor: '#e5e7eb', // gray-200
  secondaryColor: '#111827',
  secondaryBorderColor: '#60a5fa',
  secondaryTextColor: '#e5e7eb',
  tertiaryColor: '#1f2937',
  tertiaryBorderColor: '#374151',
  tertiaryTextColor: '#e5e7eb',
  lineColor: '#6b7280', // gray-500 edges
  textColor: '#e5e7eb',
  noteBkgColor: '#422006',
  noteTextColor: '#fde68a',
  noteBorderColor: '#f39c12',
  fontFamily: 'inherit',
  fontSize: '15px',
}

type MermaidModule = typeof import('mermaid')['default']
let mermaidPromise: Promise<MermaidModule> | null = null
function loadMermaid(): Promise<MermaidModule> {
  if (!mermaidPromise) {
    mermaidPromise = import('mermaid')
      .then((m) => m.default)
      .catch((err) => {
        mermaidPromise = null
        throw err
      })
  }
  return mermaidPromise
}

let renderQueue = Promise.resolve()
function queueRender<T>(fn: () => Promise<T>): Promise<T> {
  const result = renderQueue.then(fn, fn)
  renderQueue = result.then(() => {}, () => {})
  return result
}

let counter = 0

export function Mermaid({ chart }: { chart: string }) {
  const { resolvedTheme } = useTheme()
  const [svg, setSvg] = useState('')
  const [error, setError] = useState('')
  const [mounted, setMounted] = useState(false)
  const idRef = useRef(`mermaid-${counter++}`)
  const source = chart.trim()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    setSvg('')
    setError('')
    let cancelled = false
    queueRender(async () => {
      if (cancelled) return
      const mermaid = await loadMermaid()
      if (cancelled) return
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        themeVariables: resolvedTheme === 'dark' ? DARK_VARS : LIGHT_VARS,
        fontFamily: 'inherit',
      })
      // Unique render id per theme so Mermaid never collides ids on re-render.
      const result = await mermaid.render(`${idRef.current}-${resolvedTheme ?? 'light'}`, source)
      if (!cancelled) {
        setSvg(result.svg)
        setError('')
      }
    }).catch((e: unknown) => {
      if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to render diagram')
    })
    return () => {
      cancelled = true
    }
  }, [source, resolvedTheme, mounted])

  if (error) {
    return (
      <pre className="my-6 overflow-x-auto rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300">
        Diagram failed to render: {error}
        {'\n\n'}
        {source}
      </pre>
    )
  }

  if (!svg) {
    // Lightweight placeholder while Mermaid loads/renders (avoids layout jump).
    return <div className="my-8 h-24 w-full animate-pulse rounded-lg bg-zinc-100 dark:bg-zinc-800" aria-hidden="true" />
  }

  return (
    <figure
      className="mermaid-diagram my-8 flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      role="img"
      aria-label="Diagram"
      // SVG is produced by Mermaid from author-authored chart text with
      // securityLevel: 'strict' (HTML sanitized, no script/click handlers).
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export default Mermaid
