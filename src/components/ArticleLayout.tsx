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
  serverHasPurchased?: boolean
}

export function ArticleLayout({
  children,
  metadata,
  serverHasPurchased = false,
}: ArticleLayoutProps) {
  const { data: session } = useSession()
  const [hasPurchased, setHasPurchased] = useState(serverHasPurchased)

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
  
  // Extract the base slug to help with matching
  const baseSlug = safeSlug.split('/').pop() || safeSlug;
  console.log(`[ArticleLayout] Rendering for slug: ${safeSlug}, baseSlug: ${baseSlug}`);

  // Use the server purchase status instead of making a redundant API call
  // Only keep this useEffect for SSG pages or situations where serverHasPurchased might not be available
  useEffect(() => {
    // If we have received a definitive answer from the server (either true or false),
    // there's no need to check again - we trust the server's response
    if (serverHasPurchased !== undefined) {
      console.log(`Using server-provided purchase status: ${serverHasPurchased}`);
      return;
    }

    const checkPurchaseStatus = async () => {
      if (!metadata.commerce?.isPaid || !safeSlug) return;
      
      try {
        // If user is signed in, use their email
        const email = session?.user?.email;
        
        // Always include the email parameter if available
        const url = email 
          ? `/api/check-purchase?slug=${safeSlug}&email=${encodeURIComponent(email)}`
          : `/api/check-purchase?slug=${safeSlug}`;
        
        console.log('No server purchase status available, performing client-side check');
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
  }, [session, safeSlug, metadata.commerce?.isPaid, serverHasPurchased]);

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
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-blue-700 dark:text-blue-300 sm:text-5xl">
                  {safeTitle}
                </h1>
                <time
                  dateTime={metadata.date}
                  className="order-first flex items-center text-base text-gray-500 dark:text-gray-400"
                >
                  <span className="h-4 w-0.5 rounded-full bg-blue-200 dark:bg-blue-700" />
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
