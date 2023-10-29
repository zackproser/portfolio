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

  const defaultOpengraphImage = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og`

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <Script async={true} strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-DFX9S1FRMB"></Script>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
          <!-- Google tag (gtag.js) -->
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-DFX9S1FRMB');
          `}
        </Script>
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

        <title>{`Zachary Proser`}</title>
        <meta property="og:title" content="Zachary Proser's portfolio site" />
        <meta name="description" content={'Zachary Proser - Staff Developer Advocate'} />
        <meta name="og:description" content={'Zachary Proser - Articles, videos, and open-source projects'} />
        <meta name="og:image" content={defaultOpengraphImage} />
        <meta name="og:url" content="https://zackproser.com" />
        <meta property="og:type" content="website" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="zackproser.com" />
        <meta property="twitter:url" content="https://zackproser.com" />
        <meta name="twitter:title" content="Zachary Proser&apos;s portfolio site" />
        <meta name="twitter:description" content="Zachary Proser&apos;s writing, videos, and open-source projects" />
        <meta name="twitter:image" content={defaultOpengraphImage} />
      </head>
      <body className="flex h-full bg-zinc-50 dark:bg-black">
        <Providers>
          <div className="flex w-full">
            <Layout>{children}</Layout>
          </div>
        </Providers>
      </body>
    </html>
  )
}
