import { Metadata } from 'next'
import { auth } from '../../../../auth'
import Paywall from '@/components/Paywall'
import { 
  generateContentStaticParams, 
  generateContentMetadata, 
  hasUserPurchased,
  loadContent,
  getDefaultPaywallText
} from '@/lib/content-handlers'

// Content type for this handler
const CONTENT_TYPE = 'videos'

// Generate static params for all video posts
export async function generateStaticParams() {
  return generateContentStaticParams(CONTENT_TYPE)
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return generateContentMetadata(CONTENT_TYPE, params.slug)
}

export default async function VideoSlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  
  // Load the content
  const result = await loadContent(CONTENT_TYPE, slug)
  
  // Handle notFound case
  if (!result) return null
  
  const { MdxContent, metadata } = result
  
  // Check if content is paid and handle paywall logic
  if (metadata?.commerce?.isPaid) {
    // Get the user session using the auth() function
    const session = await auth()
    
    // If no user is logged in or hasn't purchased, show a preview with paywall
    if (!session?.user || !(await hasUserPurchased(session.user.id, slug))) {
      const defaultText = getDefaultPaywallText(CONTENT_TYPE)
      
      // Show a limited preview with a paywall
      return (
        <>
          <MdxContent />
          <Paywall 
            price={metadata.commerce.price} 
            slug={slug} 
            title={metadata.title}
            paywallHeader={metadata.commerce.paywallHeader || defaultText.header}
            paywallBody={metadata.commerce.paywallBody || defaultText.body}
            buttonText={metadata.commerce.buttonText || defaultText.buttonText}
            image={metadata.image}
          />
        </>
      )
    }
  }
  
  // For free content or if the user has purchased, render the full content
  return <MdxContent />
} 