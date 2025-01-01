'use client'

import { createContext, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider, useTheme } from 'next-themes'

function usePrevious<T>(value: T) {
  let ref = useRef<T>()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

function ThemeWatcher() {
  let { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Get system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check stored preference
    const storedTheme = window.localStorage.getItem('theme');
    
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      // If no stored preference, use system preference
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
  }, [setTheme]);

  return null;
}

export const AppContext = createContext<{ previousPathname?: string | null }>({});

export function Providers({ children }: { children: React.ReactNode }) {
  let pathname = usePathname()
  let previousPathname = usePrevious(pathname)

  return (
    <AppContext.Provider value={{ previousPathname }}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
      >
        <ThemeWatcher />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  )
}
