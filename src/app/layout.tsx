import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next';
import AuthProvider from '../lib/auth/AuthProvider';

import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'
import '@/styles/global.css'

import Script from 'next/script'

export const metadata: Metadata = {
  title: {
    template: '%s - Zachary Proser',
    default:
      'Zachary Proser - Open-source hacker, writer, and life-long learner',
  },
  description:
    'I’m Zachary, a staff developer advocate at Pinecone.io where we build a high-scale vector database which is critcal infrastructure for the AI-boom',
  alternates: {
    types: {
      'application/rss+xml': `${process.env.NEXT_PUBLIC_SITE_URL}/feed.xml`,
    },
  },
}

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
      <AuthProvider>
        <body className="flex h-full bg-zinc-50 dark:bg-black">
          <Providers>
            <div className="flex w-full">
              <Layout>{children}</Layout>
              <Analytics />
              <SpeedInsights />
            </div>
          </Providers>
        </body>
        <GoogleAnalytics gaId="G-DFX9S1FRMB" />
      </AuthProvider>
    </html>
  )
}
