import { Noto_Sans } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SessionProvider } from "next-auth/react"
import { Providers } from '@/app/providers'
import { SimpleNav } from '@/components/SimpleNav'
import '@/styles/tailwind.css'
import '@/styles/global.css'
import Script from 'next/script'

// Initialize the Noto Sans font
const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full antialiased ${notoSans.variable}`} suppressHydrationWarning>
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
        <GoogleAnalytics gaId="G-DFX9S1FRMB" />
        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-1009082087');
          `}
        </Script>
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