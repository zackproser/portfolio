import { type Metadata } from 'next'

import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'

import '@/styles/tailwind.css'
import '@/styles/global.css'

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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
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
