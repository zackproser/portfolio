import { Metadata } from 'next'
import { auth } from '../../../../auth'
import { 
  generateContentStaticParams, 
  generateContentMetadata, 
  hasUserPurchased,
  loadContent,
  contentExists,
  renderContent
} from '@/lib/content-handlers'
import { notFound } from 'next/navigation'
import { ArticleLayout } from '@/components/ArticleLayout'

// Content type for this handler
const CONTENT_TYPE = 'blog'

// Define the PageProps interface to match the expected type
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return generateContentStaticParams(CONTENT_TYPE)
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return generateContentMetadata(CONTENT_TYPE, resolvedParams.slug)
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  
  // Load the content
  const result = await loadContent(CONTENT_TYPE, slug)
  
  if (!result) {
    return notFound()
  }
  
  const { MdxContent, metadata } = result
  
  // Get the user session
  const session = await auth()
  
  // Check if user has purchased the content (if it's paid)
  const hasPurchased = metadata?.commerce?.isPaid 
    ? await hasUserPurchased(session?.user?.id, slug)
    : false
  
  // For MDX files that don't use ArticleLayout directly
  return (
    <ArticleLayout metadata={metadata}>
      {renderContent(MdxContent, metadata, session, hasPurchased)}
    </ArticleLayout>
  )
} 