import { useEffect, useRef } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Analytics } from '@vercel/analytics/react';

// Custom Google font 'Oxygen'
import { Oxygen } from 'next/font/google'

const oxygen = Oxygen({
  subsets: ['latin'],
  weight: '700',
})

import '@/styles/tailwind.css'
import 'focus-visible'

function usePrevious(value) {
  let ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export default function App({ Component, pageProps, router }) {
  let previousPathname = usePrevious(router.pathname)

  return (
    <>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative">
        <style jsx global>{`
        html {
          font-family: ${oxygen.style.fontFamily};
        }
      `}</style>
        <Header />
        <main>
          <Component previousPathname={previousPathname} {...pageProps} />
          <Analytics />
        </main>
        <Footer />
      </div>
    </>
  )
}
