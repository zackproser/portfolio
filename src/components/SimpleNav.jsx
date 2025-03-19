'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { Brain, Menu, X, ChevronDown } from 'lucide-react'
import { NavigationEvents } from './NavigationEvents'
import { ThemeToggleWrapper } from './ThemeToggleWrapper'
import { AuthStatus } from './AuthStatus'

const mainNavItems = [
  { label: 'Research', href: '/blog' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
]

const resourceItems = [
  { label: 'Publications', href: '/publications' },
  { label: 'Videos', href: '/videos' },
]

const interactiveItems = [
  { label: 'Devtools', href: '/devtools' },
  { label: 'Vector Databases', href: '/vectordatabases' },
  { label: 'Demos', href: '/demos' },
]

function DropdownMenu({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Toggle on mobile, desktop uses hover
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when clicking outside
  const handleClickOutside = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  // Use effect to add global click handler for mobile
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);
  
  return (
    <div className="relative group">
      {/* Mobile and desktop button */}
      <button 
        className="flex items-center gap-1 text-sm font-medium text-white group-hover:text-yellow-300 transition-colors"
        onClick={(e) => {
          e.stopPropagation(); // Prevent immediate close on mobile
          handleToggle();
        }}
      >
        {label}
        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
      </button>
      
      {/* Mobile visible when toggled, desktop visible on hover */}
      <div 
        className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-blue-800 ring-1 ring-black ring-opacity-5 
                    lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible 
                    transition-all duration-150 z-50
                    ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      >
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
  );
}

export function SimpleNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleRouteChange = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <header className="w-full h-16 sm:h-18 flex bg-gradient-to-r from-blue-900 to-blue-800 sticky top-0 shadow-md relative z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link className="flex items-center justify-center" href="/">
          <Brain className="h-6 w-6 text-white" />
          <span className="ml-2 text-2xl font-bold text-white">Modern Coding</span>
        </Link>
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Toggle menu"
            className="text-white p-2 rounded-md hover:bg-blue-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <nav 
          className={`absolute top-16 sm:top-18 left-0 w-full bg-blue-900 lg:static lg:w-auto lg:bg-transparent 
                      flex-col lg:flex-row lg:flex gap-6 sm:gap-8 items-center border-t lg:border-t-0 border-blue-800
                      ${menuOpen ? 'flex py-4 shadow-lg' : 'hidden'} lg:flex`}>
          {mainNavItems.map((item) => (
            <Link
              key={item.label}
              className="text-sm font-medium text-white hover:text-yellow-300 transition-colors"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <DropdownMenu label="Resources" items={resourceItems} />
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