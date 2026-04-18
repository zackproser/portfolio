'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { NavigationEvents } from './NavigationEvents'
import { ThemeToggleWrapper } from './ThemeToggleWrapper'
import { AuthStatus } from './AuthStatus'

// Flat editorial navigation — a single line, mono/uppercase
export const navItems = [
  { name: 'Writing', href: '/blog' },
  { name: 'Builds', href: '/projects' },
  { name: 'Videos', href: '/videos' },
  { name: 'Workshops', href: '/workshops/claude-cowork' },
  { name: 'About', href: '/about' },
];
export const navCta = { name: 'Hire →', href: '/contact' };

export function ConsultancyNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleRouteChange = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <header className="w-full flex bg-parchment-100 dark:bg-slate-900 border-b border-parchment-300 dark:border-slate-700 sticky top-0 shadow-sm relative z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 sm:h-18 flex items-center justify-between gap-6">
        {/* Wordmark + meta */}
        <Link className="flex items-baseline gap-3 shrink-0" href="/">
          <span className="text-xl font-bold font-serif text-charcoal-50 dark:text-white whitespace-nowrap">
            Zachary <span className="text-burnt-400 dark:text-amber-400">Proser</span>
          </span>
          <span className="hidden md:inline font-mono text-[10px] tracking-[0.14em] uppercase text-parchment-600 dark:text-slate-400 whitespace-nowrap">
            № MMXXVI · Applied AI
          </span>
        </Link>

        {/* Mobile toggle */}
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Toggle menu"
            className="text-charcoal-50 dark:text-white p-2 rounded-md hover:bg-parchment-200 dark:hover:bg-slate-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <nav
          className={`absolute top-16 sm:top-18 left-0 w-full bg-parchment-100 dark:bg-slate-900 lg:static lg:w-auto lg:bg-transparent dark:lg:bg-transparent
                      flex-col lg:flex-row lg:flex gap-4 lg:gap-7 items-center border-t lg:border-t-0 border-parchment-300 dark:border-slate-700
                      ${menuOpen ? 'flex py-4 shadow-lg' : 'hidden'} lg:flex`}
        >
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-7 items-center w-full lg:w-auto">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-mono text-[11px] tracking-[0.14em] uppercase font-semibold text-charcoal-50 dark:text-slate-200 hover:text-burnt-400 dark:hover:text-amber-400 transition-colors py-2 lg:py-0 w-full lg:w-auto text-center lg:text-left"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href={navCta.href}
              className="font-mono text-[11px] tracking-[0.14em] uppercase font-semibold text-burnt-400 dark:text-amber-400 hover:opacity-80 transition-opacity py-2 lg:py-0 w-full lg:w-auto text-center lg:text-left"
            >
              {navCta.name}
            </Link>
          </div>
          <div className="flex items-center gap-2 mt-4 lg:mt-0 lg:pl-4 lg:border-l lg:border-parchment-300 dark:lg:border-slate-700">
            <ThemeToggleWrapper />
            <AuthStatus />
          </div>
        </nav>
      </div>
      <NavigationEvents onRouteChange={handleRouteChange} />
    </header>
  )
}