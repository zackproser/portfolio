import { Noto_Sans, Press_Start_2P } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { GoogleTagManager } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SessionProvider } from "next-auth/react"
import { Providers } from '@/app/providers'
import { SimpleNav } from '@/components/SimpleNav'
import '@/styles/tailwind.css'
import '@/styles/global.css'
import '@/styles/newsletter-editor.css'

// Initialize the Noto Sans font
const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans',
});

// Initialize the Press Start 2P font for pixel art
const pressStart2P = Press_Start_2P({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-press-start-2p',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full antialiased ${notoSans.variable} ${pressStart2P.variable}`} suppressHydrationWarning>
      <GoogleTagManager gtmId="GTM-5MLM6LJX" />
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
      <body className="flex h-full bg-gray-100 dark:bg-black font-sans">
        <SessionProvider>
          <Providers>
            <div className="flex w-full flex-col">
              <SimpleNav />
              <main className="flex-grow">{children}</main>
              <Analytics />
              <SpeedInsights />
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  )
}