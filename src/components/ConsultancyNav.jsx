'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { Menu, X, ChevronDown } from 'lucide-react'
import { NavigationEvents } from './NavigationEvents'
import { ThemeToggleWrapper } from './ThemeToggleWrapper'
import { AuthStatus } from './AuthStatus'

// Export navigation items to be used in components
export const navItems = [
  { name: 'Services', href: '/services' },
  { name: 'Work', dropdown: [
    { name: 'Products', href: '/products' },
    { name: 'Case Studies', href: '/projects' },
    { name: 'Demos', href: '/demos' },
    { name: 'Collections', href: '/collections' }
  ]},
  { name: 'Insights', dropdown: [
    { name: 'Blog', href: '/blog' },
    { name: 'Research', href: '/publications' },
    { name: 'Tutorials', href: '/tutorials' },
    { name: 'Vector Databases', href: '/vectordatabases' },
    { name: 'Comparisons', href: '/comparisons' }
  ]},
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' }
];

function DropdownMenu({ label, items }) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Toggle dropdown visibility
  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };
  
  // Close dropdown when clicking outside
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);
  
  // Add document click listener when dropdown is open
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('click', closeDropdown);
    }
    return () => {
      document.removeEventListener('click', closeDropdown);
    };
  }, [isOpen, closeDropdown]);
  
  return (
    <div className="relative">
      {/* Dropdown trigger button */}
      <button 
        className="flex items-center gap-1 text-sm font-medium text-gray-50 dark:text-blue-100 hover:text-blue-200 transition-colors"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
        />
      </button>
      
      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-blue-800 dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1" role="menu" aria-orientation="vertical">
            {items.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-50 dark:text-blue-100 hover:bg-blue-700 dark:hover:bg-gray-700 hover:text-blue-200 transition-colors"
                role="menuitem"
                onClick={closeDropdown}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ConsultancyNav() {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleRouteChange = useCallback(() => {
    setMenuOpen(false)
  }, [])

  return (
    <header className="w-full h-16 sm:h-18 flex bg-gradient-to-r from-blue-600 to-blue-700 dark:from-gray-800 dark:to-blue-900 sticky top-0 shadow-md relative z-50">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link className="flex items-center justify-center shrink-0" href="/">
          <svg 
            className="h-7 w-7 text-gray-50 dark:text-blue-100" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12" />
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h4M12 2v4M22 12h-4M12 22v-4" />
          </svg>
          <span className="ml-2 text-xl font-bold text-gray-50 dark:text-blue-100 hidden sm:inline whitespace-nowrap">Modern Coding</span>
          <span className="ml-2 text-xl font-bold text-gray-50 dark:text-blue-100 sm:hidden">MC</span>
        </Link>
        <div className="lg:hidden">
          <button
            type="button"
            aria-label="Toggle menu"
            className="text-gray-50 dark:text-blue-100 p-2 rounded-md hover:bg-blue-500 dark:hover:bg-blue-800 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        <nav 
          className={`absolute top-16 sm:top-18 left-0 w-full bg-blue-600 dark:bg-gray-800 lg:static lg:w-auto lg:bg-transparent 
                      flex-col lg:flex-row lg:flex gap-4 items-center border-t lg:border-t-0 border-blue-500 dark:border-gray-700
                      ${menuOpen ? 'flex py-4 shadow-lg' : 'hidden'} lg:flex`}>
          <div className="flex flex-col lg:flex-row gap-2 items-center w-full lg:w-auto">
            {navItems.map((item) => (
              item.dropdown ? (
                <DropdownMenu 
                  key={item.name}
                  label={item.name} 
                  items={item.dropdown} 
                />
              ) : (
                <Link
                  key={item.name}
                  className="text-sm font-medium text-gray-50 dark:text-blue-100 hover:text-blue-200 transition-colors py-2 lg:py-0 w-full lg:w-auto text-center lg:text-left px-2"
                  href={item.href}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
          <div className="flex items-center gap-2 mt-4 lg:mt-0">
            <ThemeToggleWrapper />
            <AuthStatus />
          </div>
        </nav>
      </div>
      <NavigationEvents onRouteChange={handleRouteChange} />
    </header>
  )
} 