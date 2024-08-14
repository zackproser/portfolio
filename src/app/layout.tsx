import { Analytics } from '@vercel/analytics/react';
import { GoogleAnalytics } from '@next/third-parties/google'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SessionProvider } from "next-auth/react"
import { Providers } from '@/app/providers'
import { Layout } from '@/components/Layout'
import '@/styles/tailwind.css'
import '@/styles/global.css'
import { Metadata, ResolvingMetadata } from 'next'
import { getTools } from '@/lib/getTools'

// Default metadata
const defaultMetadata: Metadata = {
  title: {
    template: '%s - Zachary Proser',
    default: 'Zachary Proser - Full-stack AI engineer'
  },
  description: 'I build and advise on generative AI applications and pipelines',
  openGraph: {
    title: 'Zachary Proser - Full-stack AI engineer',
    description: 'I build and advise on generative AI applications and pipelines',
    url: 'https://www.zacharyproser.com',
    siteName: 'Zachary Proser',
    images: [
      {
        url: 'https://zackproser.com/api/og',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export async function generateMetadata(
  { params, searchParams }: { params: any, searchParams: any },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Get the resolved parent metadata
  const resolvedParent = await parent

  // Determine the current route
  const currentRoute = params.slug ? `/${params.slug.join('/')}` : '/'
  console.log(`Generating metadata for route: ${currentRoute}`)

  // Attempt to get the current route's metadata
  let pageMetadata: Metadata | undefined
  try {
    if (currentRoute === '/') {
      // For the root route, use the default metadata
      pageMetadata = defaultMetadata
    } else {
      const currentModule = await import(`./${params.slug.join('/')}/page`)
      pageMetadata = currentModule.metadata || (currentModule.generateMetadata && await currentModule.generateMetadata({ params, searchParams }, resolvedParent))
    }
    
    if (pageMetadata) {
      console.log(`Found specific metadata for ${currentRoute}`)
    } else {
      console.log(`No specific metadata found for ${currentRoute}, using default`)
    }
  } catch (error) {
    console.log(`Error loading metadata for ${currentRoute}: ${(error as Error).message}`)
  }

  // Merge the default metadata with any page-specific metadata
  const mergedMetadata = {
    ...defaultMetadata,
    ...pageMetadata,
    openGraph: {
      ...defaultMetadata.openGraph,
      ...pageMetadata?.openGraph,
    },
  }

  console.log(`Final metadata for ${currentRoute}:`, JSON.stringify(mergedMetadata, null, 2))

  return mergedMetadata
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
      <body
        suppressHydrationWarning={true}
        className="flex h-full bg-gray-100 dark:bg-black">
        <SessionProvider>
          <Providers>
            <div className="flex w-full">
              <Layout>{children}</Layout>
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