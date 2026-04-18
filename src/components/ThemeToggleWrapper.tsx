'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

export function ThemeToggleWrapper() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-10 h-10" aria-hidden="true" />
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center justify-center w-10 h-10 rounded-md border border-parchment-400 dark:border-slate-600 text-charcoal-50 dark:text-slate-200 hover:border-burnt-400 hover:text-burnt-400 dark:hover:border-amber-400 dark:hover:text-amber-400 transition-colors"
    >
      {isDark ? <Sun className="w-4 h-4" strokeWidth={1.75} /> : <Moon className="w-4 h-4" strokeWidth={1.75} />}
    </button>
  )
}
