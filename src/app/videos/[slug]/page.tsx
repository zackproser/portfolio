import { Metadata } from 'next'
import { auth } from '../../../../auth'
import Paywall from '@/components/Paywall'
import { 
  generateContentStaticParams, 
  generateContentMetadata, 
  hasUserPurchased,
  getContentWithComponentByDirectorySlug,
  getDefaultPaywallText
} from '@/lib/content-handlers'

// Content type for this handler
const CONTENT_TYPE = 'videos'

// Define the PageProps interface to match the expected type
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all video posts
export async function generateStaticParams() {
  return generateContentStaticParams(CONTENT_TYPE)
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return generateContentMetadata(CONTENT_TYPE, resolvedParams.slug)
}

export default async function VideoSlugPage({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // Load the content
  const result = await getContentWithComponentByDirectorySlug(CONTENT_TYPE, slug)
  
  // Handle notFound case
  if (!result) return null
  
  const { MdxContent, content } = result
  
  // Check if content is paid and handle paywall logic
  if (content?.commerce?.isPaid) {
    // Get the user session using the auth() function
    const session = await auth()
    
    // If no user is logged in or hasn't purchased, show a preview with paywall
    if (!session?.user || !(await hasUserPurchased(session.user.id, CONTENT_TYPE, slug))) {
      const defaultText = getDefaultPaywallText(CONTENT_TYPE)
      
      // Show a limited preview with a paywall
      return (
        <>
          <MdxContent />
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
  
  // For free content or if the user has purchased, render the full content
  return <MdxContent />
} 