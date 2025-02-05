import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import GiscusWrapper from '@/components/GiscusWrapper'
import NewsletterWrapper from '@/components/NewsletterWrapper'
import FollowButtons from '@/components/FollowButtons'
import { Suspense } from 'react'
import ArticleContent from './ArticleContent'
import MiniPaywall from './MiniPaywall'
import { StaticImageData } from 'next/image'

interface ArticleLayoutProps {
  children: React.ReactNode
  metadata: {
    title: string
    description: string
    author: string
    date: string
    isPaid?: boolean
    price?: number
    slug?: string
    previewLength?: number
    previewElements?: number
    paywallHeader?: string
    paywallBody?: string
    buttonText?: string
    paywallImage?: string | StaticImageData
    paywallImageAlt?: string
    hideMiniPaywall?: boolean
    miniPaywallTitle?: string | null
    miniPaywallDescription?: string | null
  }
}

export function ArticleLayout({
  children,
  metadata,
}: ArticleLayoutProps) {
  return (
    <>
      <Container className="mt-16 lg:mt-32">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            <article>
              <header className="flex flex-col">
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                  {metadata.title}
                </h1>
                <time
                  dateTime={metadata.date}
                  className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
                >
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                  <span className="ml-3">{metadata.date}</span>
                </time>
              </header>
              
              {metadata.isPaid && !metadata.hideMiniPaywall && (
                <MiniPaywall
                  price={metadata.price!}
                  slug={metadata.slug!}
                  title={metadata.title}
                  image={metadata.paywallImage}
                  imageAlt={metadata.paywallImageAlt}
                  miniTitle={metadata.miniPaywallTitle ?? metadata.paywallHeader ?? null}
                  miniDescription={metadata.miniPaywallDescription ?? null}
                />
              )}

              <Prose className="mt-8">
                <ArticleContent
                  isPaid={metadata.isPaid}
                  price={metadata.price}
                  slug={metadata.slug}
                  title={metadata.title}
                  previewLength={metadata.previewLength}
                  previewElements={metadata.previewElements}
                  paywallHeader={metadata.paywallHeader}
                  paywallBody={metadata.paywallBody}
                  buttonText={metadata.buttonText}
                  paywallImage={metadata.paywallImage}
                  paywallImageAlt={metadata.paywallImageAlt}
                >
                  {children}
                </ArticleContent>
              </Prose>
            </article>
            <NewsletterWrapper 
              title={'If you made it this far, you can do anything!'} 
              body={'I publish technical content for developers who want to skill up, and break down AI, vector databases and tools for investors'} 
            />
            <Suspense fallback={<div>Loading...</div>}>
              <GiscusWrapper />
            </Suspense>
            <FollowButtons />
          </div>
        </div>
      </Container>
    </>
  )
}
