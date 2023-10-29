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
    // Check if the user has previously selected light mode
    const userSelectedLight = window.localStorage.getItem('theme') === 'light';

    if (userSelectedLight) {
      setTheme('light');  // If so, set theme to light
    } else {
      setTheme('dark');  // Otherwise, default to dark
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
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <ThemeWatcher />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  )
}
