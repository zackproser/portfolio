'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { Brain, Menu, X, ChevronDown } from 'lucide-react'
import { NavigationEvents } from './NavigationEvents'
import { ThemeToggleWrapper } from './ThemeToggleWrapper'
import { AuthStatus } from './AuthStatus'

const mainNavItems = [
  { label: 'Research', href: '/blog' },
  { label: 'Tutorials', href: '/tutorials' },
  { label: 'Projects', href: '/projects' },
  { label: 'Publications', href: '/publications' },
  { label: 'Videos', href: '/videos' },
  { label: 'About', href: '/about' },
]

const interactiveItems = [
  { label: 'Devtools', href: '/devtools' },
  { label: 'Vector Databases', href: '/vectordatabases' },
  { label: 'Demos', href: '/demos' },
]

function DropdownMenu({ label, items }) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-1 text-sm font-medium text-white group-hover:text-yellow-300 transition-colors">
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>
      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-blue-800 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
        <div className="py-1" role="menu" aria-orientation="vertical">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="block px-4 py-2 text-sm text-white hover:bg-blue-700 hover:text-yellow-300 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
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
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              className="text-sm font-medium text-white hover:text-yellow-300 transition-colors"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <DropdownMenu label="Interactive" items={interactiveItems} />
          <div className="flex items-center gap-4">
            <ThemeToggleWrapper />
            <AuthStatus />
          </div>
        </nav>
      </div>
      <NavigationEvents onRouteChange={handleRouteChange} />
    </header>
  )
}