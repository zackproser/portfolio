'use client'

import Head from 'next/head'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import { Newsletter } from '@/components/Newsletter'
import FollowButtons from '@/components/FollowButtons'

function ArrowLeftIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.25 11.25 3.75 8m0 0 3.5-3.25M3.75 8h8.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function ArticleLayout({
  children,
  meta,
}: {
  children: React.ReactNode
  meta: {
    title: string
    description: string
    date: string
    image?: {
      src: string
    },
    type?: string
    slug?: string
  }
}) {
  const router = useRouter()

  const sanitizedTitle = encodeURIComponent(meta.title.replace(/'/g, ''))

  let ogURL = `${process.env.NEXT_PUBLIC_SITE_URL}/api/og?title=${sanitizedTitle}`

  if (meta.image && meta.image.src) {
    ogURL = `${ogURL}&image=${meta.image.src}`
  }

  if (meta.description) {
    const sanitizedDescription = encodeURIComponent(
      meta.description.replace(/'/g, '')
    )
    ogURL = `${ogURL}&description=${sanitizedDescription}`
  }

  let root = '/blog/'
  if (meta?.type == 'video') {
    root = '/videos/'
  }

  const builtURL = `${process.env.NEXT_PUBLIC_SITE_URL}${root}${meta.slug ?? ''}`
  const postURL = new URL(builtURL)

  return (
    <>
      <Head>
        <title>{`${meta.title} - Zachary Proser`}</title>
        <meta name="description" content={meta.description} />
        <meta name="og:image" content={ogURL} />
        <title>{meta.title}</title>
        <meta property="og:title" content={meta.title} />
        <meta name="description" content={meta.description} />
        <meta name="og:image" content={ogURL} />
        <meta name="og:url" content={postURL.toString()} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="zackproser.com" />
        <meta property="twitter:url" content={postURL.toString()} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={ogURL} />
      </Head>
      <Container className="mt-16 lg:mt-32">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Go back to articles"
              className="group mb-8 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 transition dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0 dark:ring-white/10 dark:hover:border-zinc-700 dark:hover:ring-white/20 lg:absolute lg:-left-5 lg:-mt-2 lg:mb-0 xl:-top-1.5 xl:left-0 xl:mt-0"
            >
              <ArrowLeftIcon className="h-4 w-4 stroke-zinc-500 transition group-hover:stroke-zinc-700 dark:stroke-zinc-500 dark:group-hover:stroke-zinc-400" />
            </button>
            <article>
              <header className="flex flex-col">
                <h1 className="mt-6 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                  {meta.title}
                </h1>
                <time
                  dateTime={meta.date}
                  className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
                >
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                  <span className="ml-3">{meta.date}</span>
                </time>
              </header>
              <Prose className="mt-8">{children}</Prose>
            </article>
            <Newsletter />
            <FollowButtons />
          </div>
        </div>
      </Container>
    </>
  )
}
