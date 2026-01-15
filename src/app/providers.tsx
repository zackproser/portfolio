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
  let { setTheme } = useTheme();

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;

    // Check stored preference - only apply if user has explicitly chosen
    const storedTheme = window.localStorage.getItem('theme');

    if (storedTheme) {
      setTheme(storedTheme);
    }
    // If no stored preference, let defaultTheme="light" take effect
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
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <ThemeWatcher />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  )
}
