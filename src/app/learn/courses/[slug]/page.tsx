import React from 'react'
import { Metadata } from 'next'
import { auth } from '../../../../../auth'
import Paywall from '@/components/Paywall'
import { 
  generateContentStaticParams, 
  generateContentMetadata, 
  hasUserPurchased,
  getContentWithComponentByDirectorySlug,
  getContentSlugs,
  renderPaywalledContent,
  getDefaultPaywallText
} from '@/lib/content-handlers'
import { isEmailSubscribed } from '@/lib/newsletter'

// Content type for this handler
const CONTENT_TYPE = 'learn/courses'

// Generate static params for all courses
export async function generateStaticParams() {
  return generateContentStaticParams(CONTENT_TYPE)
}

// Define the PageProps interface to match the expected type
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return generateContentMetadata(CONTENT_TYPE, resolvedParams.slug)
}

export default async function CourseSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // Fetch content for the course
  const result = await getContentWithComponentByDirectorySlug('learn/courses', slug)
  
  // Handle notFound case
  if (!result) return null
  
  const { content, MdxContent } = result
  
  // Get user ID from session
  const session = await auth()
  const userId = session?.user.id

  // Check if user has purchased access
  const userHasPurchased = await hasUserPurchased(userId, CONTENT_TYPE, slug)

  let isSubscribed = false
  if (content?.commerce?.requiresEmail) {
    isSubscribed = await isEmailSubscribed(session?.user?.email || null)
  }
  
  // Check if content requires payment
  if (content?.commerce?.isPaid) {
    // If no user is logged in or hasn't purchased, show paywall
    if (!session?.user || !userHasPurchased) {
      const defaultText = getDefaultPaywallText(CONTENT_TYPE)
      
      // Render the paywall component
      return (
        <>
          {/* Note: We pass MdxContent to renderPaywalledContent below, 
              so no need to render it separately here unless you want a specific preview structure */}
          {/* <MdxContent /> */} 
          {renderPaywalledContent(MdxContent, content, userHasPurchased, isSubscribed)}
          {/* Pass the entire content object to Paywall */}
          <Paywall 
            content={content}
            paywallHeader={content.commerce.paywallHeader || defaultText.header}
            paywallBody={content.commerce.paywallBody || defaultText.body}
            buttonText={content.commerce.buttonText || defaultText.buttonText}
          />
        </>
      )
    }
  }

  // If content is not paid, or user has purchased, render the full content
  return (
    <>
      {/* Render potentially paywalled content (will render full if purchased or not paid) */}
      {renderPaywalledContent(MdxContent, content, userHasPurchased, isSubscribed)}
    </>
  )
} 