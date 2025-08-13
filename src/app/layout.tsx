import { Noto_Sans, Press_Start_2P } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { GoogleTagManager } from '@next/third-parties/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SessionProvider } from "next-auth/react";
import { Providers } from '@/app/providers';
import { ConsultancyNav } from '@/components/ConsultancyNav';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/tailwind.css';
import '@/styles/global.css';
import PlausibleProvider from 'next-plausible';

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans',
});

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
      <GoogleTagManager gtmId="GTM-K9XTVH6V" />
      <head>
        <PlausibleProvider domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ?? 'zackproser.com'} />
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
      <body className="flex h-full bg-neutral-50 dark:bg-gray-900 font-sans">
        <SessionProvider>
          <Providers>
            <div className="flex w-full flex-col">
              <ConsultancyNav />
              <main className="flex-grow">{children}</main>
              <Toaster />
              <Analytics />
              <SpeedInsights />
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}