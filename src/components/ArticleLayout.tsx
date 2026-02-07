'use client'

import { Container } from '@/components/Container'
import { Prose } from '@/components/Prose'
import GiscusWrapper from '@/components/GiscusWrapper'
import NewsletterWrapper from '@/components/NewsletterWrapper'
import FollowButtons from '@/components/FollowButtons'
import { Suspense } from 'react'
import { ExtendedMetadata, Content } from '@/types'
import MiniPaywall from './MiniPaywall'
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Head from 'next/head'
import { generateOgUrl } from '@/utils/ogUrl'
import { useRouter } from 'next/navigation'
import { metadataLogger as logger } from '@/utils/logger'
import StickyAffiliateCTA from '@/components/StickyAffiliateCTA'
import VoiceAffiliateHub from '@/components/VoiceAffiliateHub'

// Voice-related slugs that should show the affiliate CTA
const VOICE_AFFILIATE_SLUGS = [
  'wisprflow',
  'granola',
  'voice-to-text',
  'voice-tools',
  'voice-ai',
  'walking-and-talking',
  'small-business',
  'lawyers',
  'record-meetings',
  'ai-engineer-setup',
  'doctors',
  'real-estate',
]

function shouldShowVoiceAffiliateCTA(slug: string): boolean {
  const lowerSlug = slug.toLowerCase()
  return VOICE_AFFILIATE_SLUGS.some(keyword => lowerSlug.includes(keyword))
}

interface ArticleLayoutProps {
  children: React.ReactNode
  metadata: ExtendedMetadata & {
    hideMiniPaywall?: boolean
    miniPaywallTitle?: string | null
    miniPaywallDescription?: string | null
  }
  serverHasPurchased?: boolean
  hideNewsletter?: boolean
}

export function ArticleLayout({
  children,
  metadata,
  serverHasPurchased = false,
  hideNewsletter = false,
}: ArticleLayoutProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [hasPurchased, setHasPurchased] = useState(serverHasPurchased)

  // Ensure we have string values for required fields with proper defaults
  const safeSlug = metadata?.slug || '';
  const safeTitle = metadata?.title as string || 'Untitled';
  const safeType = typeof metadata?.type === 'string' ? metadata.type : 'blog';
  const safeDescription = metadata?.description as string || '';
  
  // Add a debug log to help identify which articles are missing slugs
  if (!safeSlug) {
    // Instead of just logging an error, log more details to help debug
    logger.warn('ArticleLayout: metadata missing slug', { 
      title: safeTitle, 
      type: safeType,
      date: metadata?.date
    });
  }
  
  // Extract the base slug to help with matching - handle empty strings gracefully
  const baseSlug = safeSlug ? safeSlug.split('/').pop() || safeSlug : '';
  
  logger.debug(`Rendering for slug: ${safeSlug}, baseSlug: ${baseSlug}`);

  // Add more debug information about the image
  if (metadata?.image) {
    logger.debug(`Image type: ${typeof metadata.image}`);
    if (typeof metadata.image === 'object' && metadata.image !== null) {
      logger.debug(`Image keys: ${Object.keys(metadata.image).join(',')}`);
      if ('src' in metadata.image) {
        logger.debug(`Image src: ${(metadata.image as any).src}`);
      }
    } else if (typeof metadata.image === 'string') {
      logger.debug(`Image string: ${metadata.image}`);
    }
  } else {
    logger.debug(`No image provided for ${safeTitle}`);
  }

  // Generate the OG URL with proper slug parameter
  const ogUrl = generateOgUrl({
    title: safeTitle,
    description: safeDescription || undefined,
    image: metadata?.image,
    slug: baseSlug as any // Force type to match expected parameter type
  });
  
  logger.debug(`Generated OG URL: ${ogUrl}`);

  // Use the server purchase status instead of making a redundant API call
  // Only keep this useEffect for SSG pages or situations where serverHasPurchased might not be available
  useEffect(() => {
    // If we have received a definitive answer from the server (either true or false),
    // there's no need to check again - we trust the server's response
    if (serverHasPurchased !== undefined) {
      logger.debug(`Using server-provided purchase status: ${serverHasPurchased}`);
      return;
    }

    const checkPurchaseStatus = async () => {
      // Make sure both conditions are checked with null/undefined safety
      if (!metadata?.commerce?.isPaid || !safeSlug) return;
      
      try {
        // If user is signed in, use their email
        const email = session?.user?.email;
        
        // Always include the email parameter if available
        const url = email 
          ? `/api/check-purchase?slug=${safeSlug}&email=${encodeURIComponent(email)}`
          : `/api/check-purchase?slug=${safeSlug}`;
        
        logger.debug('No server purchase status available, performing client-side check');
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setHasPurchased(data.purchased);
      } catch (error) {
        logger.error('Error checking purchase status:', error);
        setHasPurchased(false);
      }
    };

    checkPurchaseStatus();
  }, [session, safeSlug, metadata?.commerce?.isPaid, serverHasPurchased]);

  // Determine if we should show the mini paywall - add null checks for all properties
  const shouldShowMiniPaywall = 
    metadata?.commerce?.isPaid && 
    !metadata?.hideMiniPaywall && 
    !hasPurchased && 
    (metadata?.miniPaywallTitle || metadata?.commerce?.miniPaywallTitle) &&
    (metadata?.miniPaywallDescription || metadata?.commerce?.miniPaywallDescription);

  // Build the full URL for og:url and twitter:url
  let rootPath = '/blog/';
  
  // Use a more flexible approach to determine the root path
  if (safeType === 'video') {
    rootPath = '/videos/';
  } else if (safeType === 'newsletter') {
    rootPath = '/newsletter/';
  } else if (safeType === 'course') {
    rootPath = '/learn/courses/';
  } else if (typeof safeType === 'string' && safeType.includes('comparison') || safeSlug.includes('comparisons/')) {
    rootPath = '/comparisons/';
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
  const fullUrl = safeSlug.startsWith('/')
    ? `${siteUrl}${safeSlug}`
    : `${siteUrl}${rootPath}${safeSlug}`;

  const publishedTime = metadata?.date ? new Date(metadata.date).toISOString() : undefined;
  const structuredArticle = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: safeTitle,
    description: safeDescription,
    datePublished: publishedTime,
    dateModified: publishedTime,
    author: {
      '@type': 'Person',
      name: metadata?.author || 'Zachary Proser',
    },
    mainEntityOfPage: fullUrl,
    image: metadata?.image ? [typeof metadata.image === 'string' ? metadata.image : (metadata.image as any)?.src] : undefined,
  };

  const structuredBreadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl || '/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: safeType === 'newsletter' ? 'Newsletter' : 'Blog',
        item: `${siteUrl}${rootPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: safeTitle,
        item: fullUrl,
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{`${safeTitle} - Zachary Proser`}</title>
        <meta name="description" content={safeDescription} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={safeTitle} />
        <meta property="og:description" content={safeDescription} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={ogUrl} />
        
        {/* Twitter card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={safeTitle} />
        <meta name="twitter:description" content={safeDescription} />
        <meta name="twitter:image" content={ogUrl} />
        <meta name="twitter:domain" content="zackproser.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredArticle) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredBreadcrumbs) }}
        />
      </Head>
      
      <Container className="mt-16 lg:mt-32">
        <div className="xl:relative">
          <div className="mx-auto max-w-2xl">
            {shouldShowMiniPaywall && metadata && (
              <MiniPaywall
                content={metadata as Content}
              />
            )}
            <article>
              <header className="flex flex-col">
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-burnt-400 dark:text-amber-400 sm:text-5xl">
                  {safeTitle}
                </h1>
                <time
                  dateTime={metadata?.date}
                  className="order-first flex items-center text-base text-gray-500 dark:text-gray-400"
                >
                  <span className="h-4 w-0.5 rounded-full bg-amber-200 dark:bg-amber-700" />
                  <span className="ml-3">{metadata?.date}</span>
                </time>
              </header>
              
              <Prose className="mt-8">
                {children}
              </Prose>
            </article>
            {shouldShowVoiceAffiliateCTA(safeSlug) && (
              <VoiceAffiliateHub campaign={baseSlug || safeSlug || 'unknown'} />
            )}
            {!hideNewsletter && (
              <NewsletterWrapper
                title={'If you made it this far, you can do anything!'}
                body={'I publish technical content for developers who want to skill up, and break down AI, vector databases and tools for investors'}
              />
            )}
            <Suspense fallback={<div>Loading...</div>}>
              <GiscusWrapper />
            </Suspense>
            <FollowButtons />
          </div>
        </div>
      </Container>
      {shouldShowVoiceAffiliateCTA(safeSlug) && (
        <StickyAffiliateCTA product="both" campaign={baseSlug || safeSlug || 'unknown'} />
      )}
    </>
  )
}
