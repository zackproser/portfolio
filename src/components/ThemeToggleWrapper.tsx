'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { SunIcon, MoonIcon } from './icons'

export function ThemeToggleWrapper() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-6 h-6" /> // Placeholder with same dimensions
  }

  return (
    <button
      type="button"
      aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
      className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      {resolvedTheme === 'dark' ? (
        <SunIcon className="h-5 w-5 fill-zinc-700 stroke-white" />
      ) : (
        <MoonIcon className="h-5 w-5 fill-zinc-100 stroke-white" />
      )}
    </button>
  )
} 