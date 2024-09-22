import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Space_Grotesk } from 'next/font/google'
import { SessionProvider } from "next-auth/react"
import { Providers } from '@/app/providers'
import { SimpleNav } from '@/components/SimpleNav'
import '@/styles/tailwind.css'
import '@/styles/global.css'

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.xml`}
        />
        <link
          rel="alternate"
          type="application/feed+json"
          href={`${process.env.NEXT_PUBLIC_SITE_URL}/rss/feed.json`}
        />
      </head>
      <body
        suppressHydrationWarning={true}
        className="flex h-full bg-gray-100 dark:bg-black"
      >
        <SessionProvider>
          <Providers>
            <div className="flex w-full flex-col">
              <SimpleNav />
              <main className={`flex-grow ${spaceGrotesk.className}`}>{children}</main>
              <Analytics />
              <SpeedInsights />
            </div>
          </Providers>
        </SessionProvider>
      </body>
      <GoogleAnalytics gaId="G-DFX9S1FRMB" />
    </html>
  )
}