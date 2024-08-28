'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { Brain, Sun, Moon, Menu, X } from 'lucide-react'
import { NavigationEvents } from './NavigationEvents'

const navItems = [
  { label: 'Research', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'Publications', href: '/publications' },
  { label: 'Demos', href: '/demos' },
  { label: 'Videos', href: '/videos' },
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
  const [menuOpen, setMenuOpen] = useState(false)

  const handleRouteChange = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <header className="w-full px-4 lg:px-6 h-14 flex bg-blue-900 relative z-50">
      <div className="container p-4 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <Brain className="h-6 w-6 text-white" />
          <span className="ml-2 text-2xl font-bold text-white">Modern Coding</span>
        </Link>
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Toggle menu"
            className="text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <nav className={`absolute top-14 left-0 w-full bg-blue-900 lg:static lg:w-auto lg:bg-transparent flex-col lg:flex-row lg:flex gap-4 sm:gap-6 items-center ${menuOpen ? 'flex' : 'hidden'} lg:flex`}>
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
      <NavigationEvents onRouteChange={handleRouteChange} />
    </header>
  )
}