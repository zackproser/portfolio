import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import GiscusWrapper from '@/components/GiscusWrapper'
import NewsletterWrapper from '@/components/NewsletterWrapper'
import FollowButtons from '@/components/FollowButtons'
import { Suspense } from 'react'
import ArticleContent from './ArticleContent'
import MiniPaywall from './MiniPaywall'
import { ExtendedMetadata } from '@/lib/shared-types'

interface ArticleLayoutProps {
  children: React.ReactNode
  metadata: ExtendedMetadata & {
    hideMiniPaywall?: boolean
    miniPaywallTitle?: string | null
    miniPaywallDescription?: string | null
  }
}

export function ArticleLayout({
  children,
  metadata,
}: ArticleLayoutProps) {
  // Add a debug log to help identify which articles are missing slugs
  if (!metadata.slug || metadata.slug === '') {
    // Instead of just logging an error, log more details to help debug
    console.warn('ArticleLayout: metadata missing slug', { 
      title: metadata.title, 
      type: metadata.type,
      date: metadata.date
    });
  }

  // Ensure we have string values for required fields
  const safeSlug = metadata.slug || '';
  const safeTitle = metadata.title as string || 'Untitled';
  const safeType = metadata.type || 'blog';

  return (
    <>
      <Container className="mt-16 lg:mt-32">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            <article>
              <header className="flex flex-col">
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
                  {safeTitle}
                </h1>
                <time
                  dateTime={metadata.date}
                  className="order-first flex items-center text-base text-zinc-400 dark:text-zinc-500"
                >
                  <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500" />
                  <span className="ml-3">{metadata.date}</span>
                </time>
              </header>
              
              {metadata.commerce?.isPaid && !metadata.hideMiniPaywall && (
                <MiniPaywall
                  price={metadata.commerce.price}
                  slug={safeSlug}
                  title={safeTitle}
                  type={safeType}
                  image={metadata.commerce.paywallImage}
                  imageAlt={metadata.commerce.paywallImageAlt}
                  miniTitle={metadata.miniPaywallTitle ?? metadata.commerce?.paywallHeader ?? null}
                  miniDescription={metadata.miniPaywallDescription ?? null}
                />
              )}

              <Prose className="mt-8">
                <ArticleContent
                  isPaid={metadata.commerce?.isPaid}
                  price={metadata.commerce?.price}
                  slug={safeSlug}
                  title={safeTitle}
                  previewLength={metadata.commerce?.previewLength}
                  previewElements={metadata.commerce?.previewElements}
                  paywallHeader={metadata.commerce?.paywallHeader}
                  paywallBody={metadata.commerce?.paywallBody}
                  buttonText={metadata.commerce?.buttonText}
                  paywallImage={metadata.commerce?.paywallImage}
                  paywallImageAlt={metadata.commerce?.paywallImageAlt}
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
