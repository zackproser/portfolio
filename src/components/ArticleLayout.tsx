'use client'

import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import GiscusWrapper from '@/components/GiscusWrapper'
import NewsletterWrapper from '@/components/NewsletterWrapper'
import FollowButtons from '@/components/FollowButtons'
import { Suspense } from 'react'
import { ExtendedMetadata } from '@/types'
import MiniPaywall from './MiniPaywall'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'

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
  const { data: session } = useSession()
  const [hasPurchased, setHasPurchased] = useState(false)

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

  // Check if the user has purchased the content
  useEffect(() => {
    const checkPurchaseStatus = async () => {
      if (!metadata.commerce?.isPaid || !safeSlug) return;
      
      try {
        // If user is signed in, use their email
        const email = session?.user?.email;
        
        // Always include the email parameter if available
        const url = email 
          ? `/api/check-purchase?slug=${safeSlug}&email=${encodeURIComponent(email)}`
          : `/api/check-purchase?slug=${safeSlug}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setHasPurchased(data.purchased);
      } catch (error) {
        console.error('Error checking purchase status:', error);
        setHasPurchased(false);
      }
    };

    checkPurchaseStatus();
  }, [session, safeSlug, metadata.commerce?.isPaid]);

  // Determine if we should show the mini paywall
  const shouldShowMiniPaywall = 
    metadata.commerce?.isPaid && 
    !metadata.hideMiniPaywall && 
    !hasPurchased && 
    (metadata.miniPaywallTitle || metadata.commerce.miniPaywallTitle) &&
    (metadata.miniPaywallDescription || metadata.commerce?.miniPaywallDescription);

  return (
    <>
      <Container className="mt-16 lg:mt-32">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            {shouldShowMiniPaywall && (
              <MiniPaywall
                price={metadata.commerce?.price || 0}
                slug={safeSlug}
                title={safeTitle}
                type={safeType}
                miniTitle={metadata.miniPaywallTitle || metadata.commerce?.miniPaywallTitle || null}
                miniDescription={metadata.miniPaywallDescription || metadata.commerce?.miniPaywallDescription || null}
                image={typeof metadata.image === 'object' && 'src' in metadata.image ? metadata.image.src : metadata.image}
              />
            )}
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
              
              <Prose className="mt-8">
                {children}
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
