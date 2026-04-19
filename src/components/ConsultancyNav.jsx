'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { NavigationEvents } from './NavigationEvents'
import { ThemeToggleWrapper } from './ThemeToggleWrapper'
import { AuthStatus } from './AuthStatus'

// Flat editorial navigation — a single line, sans title-case
export const navItems = [
  { name: 'Writing', href: '/blog' },
  { name: 'Projects', href: '/projects' },
  { name: 'Videos', href: '/videos' },
  { name: 'Playground', href: '/demos' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];
export const navCta = { name: 'Newsletter', href: '/newsletter' };

function isActive(pathname, href) {
  if (!pathname) return false
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function ConsultancyNav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleRouteChange = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <header className="w-full flex bg-parchment-100 dark:bg-slate-900 border-b border-parchment-300 dark:border-slate-700 sticky top-0 shadow-sm relative z-50 transition-colors duration-300">
      <div className="container mx-auto px-4 h-16 sm:h-18 flex items-center justify-between gap-6">
        {/* Wordmark */}
        <Link className="flex items-baseline gap-3 shrink-0" href="/">
          <span className="text-xl font-bold font-serif text-charcoal-50 dark:text-white whitespace-nowrap">
            Zachary <span className="text-burnt-400 dark:text-amber-400">Proser</span>
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
                      flex-col lg:flex-row lg:flex gap-4 lg:gap-8 items-center border-t lg:border-t-0 border-parchment-300 dark:border-slate-700
                      ${menuOpen ? 'flex py-4 shadow-lg' : 'hidden'} lg:flex`}
        >
          <div className="flex flex-col lg:flex-row gap-3 lg:gap-8 items-center w-full lg:w-auto">
            {navItems.map((item) => {
              const active = isActive(pathname, item.href)
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`text-[15px] font-medium transition-colors py-2 lg:py-0 w-full lg:w-auto text-center lg:text-left ${
                    active
                      ? 'text-burnt-400 dark:text-amber-400'
                      : 'text-charcoal-50 dark:text-slate-200 hover:text-burnt-400 dark:hover:text-amber-400'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </div>
          <div className="flex items-center gap-2 mt-4 lg:mt-0 lg:pl-2">
            <ThemeToggleWrapper />
            <Link
              href={navCta.href}
              aria-current={isActive(pathname, navCta.href) ? 'page' : undefined}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-[15px] font-semibold text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors whitespace-nowrap"
            >
              {navCta.name}
              <span aria-hidden="true">→</span>
            </Link>
            <AuthStatus />
          </div>
        </nav>
      </div>
      <NavigationEvents onRouteChange={handleRouteChange} />
    </header>
  )
}