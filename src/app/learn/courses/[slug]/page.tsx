import { Metadata } from 'next'
import { auth } from '../../../../../auth'
import Paywall from '@/components/Paywall'
import { 
  generateContentStaticParams, 
  generateContentMetadata, 
  hasUserPurchased,
  loadContent,
  getDefaultPaywallText
} from '@/lib/content-handlers'

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
  
  // Load the content
  const result = await loadContent(CONTENT_TYPE, slug)
  
  // Handle notFound case
  if (!result) return null
  
  const { MdxContent, metadata } = result
  
  // Courses are typically paid content
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