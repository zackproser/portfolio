'use client'

import React from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Brain, Sun, Moon } from 'lucide-react'

const navItems = [
  { label: 'Research', href: '#' },
  { label: 'Projects', href: '/projects' },
  { label: 'AI Dev', href: '#' },
  { label: 'About', href: '/about' },
]

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const otherTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      aria-label={`Switch to ${otherTheme} theme`}
      className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      onClick={() => setTheme(otherTheme)}
    >
      {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}

export function SimpleNav() {
  return (
    <header className="w-full x-4 lg:px-6 h-14 flex bg-blue-900">
      <div className="container p-4 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <Brain className="h-6 w-6 text-white" />
          <span className="ml-2 text-2xl font-bold text-white">Modern Coding</span>
        </Link>
        <nav className="flex gap-4 sm:gap-6 items-center">
          {navItems.map((item) => (
            <Link
              key={item.label}
              className="text-sm font-medium text-white hover:text-yellow-300 transition-colors"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}