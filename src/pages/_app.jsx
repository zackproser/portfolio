import { useEffect, useRef } from 'react'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

// Head is used for setting meta tags
import Head from 'next/head'

import '@/styles/global.css'
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

  const defaultOpengraphImage = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`

  return (
    <>
      <Head>
        <title>{`Zachary Proser`}</title>
        <meta property="og:title" content="Zachary Proser's portfolio site" />
        <meta name="description" content={'Zachary Proser - Staff Developer Advocate'} />
        <meta name="og:image" content={defaultOpengraphImage} />
        <meta name="og:url" content="https://zackproser.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="zackproser.com" />
        <meta property="twitter:url" content="https://zackproser.com" />
        <meta name="twitter:title" content="Zachary Proser's portfolio site" />
        <meta name="twitter:description" content="Zachary Proser's writing, videos, and open-source projects" />
        <meta name="twitter:image" content={defaultOpengraphImage} />
      </Head>
      <div className="fixed inset-0 flex justify-center sm:px-8">
        <div className="flex w-full max-w-7xl lg:px-8">
          <div className="w-full bg-white ring-1 ring-zinc-100 dark:bg-zinc-900 dark:ring-zinc-300/20" />
        </div>
      </div>
      <div className="relative">
        <Header />
        <main>
          <Component previousPathname={previousPathname} {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  )
}
