import { Metadata } from 'next'
import { auth } from '../../../../auth'
import { 
  generateContentStaticParams, 
  generateContentMetadata, 
  hasUserPurchased,
  loadContent,
  renderPaywalledContent
} from '@/lib/content-handlers'
import { notFound } from 'next/navigation'
import { ArticleLayout } from '@/components/ArticleLayout'
import React from 'react'
import { CheckCircle } from 'lucide-react'

// Content type for this handler
const CONTENT_TYPE = 'blog'

// Define the PageProps interface to match the expected type
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return generateContentStaticParams(CONTENT_TYPE)
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  return generateContentMetadata(CONTENT_TYPE, slug)
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const CONTENT_TYPE = 'blog';

  // Only log in development and when debug is enabled
  const isDebugMode = process.env.NODE_ENV === 'development' && process.env.DEBUG_METADATA === 'true';
  const debugLog = (message: string, data?: any) => {
    if (isDebugMode) {
      if (data) {
        console.log(`[blog/[slug]/page.tsx] ${message}`, data);
      } else {
        console.log(`[blog/[slug]/page.tsx] ${message}`);
      }
    }
  };
  
  debugLog(`Loading content for slug: ${slug}`);
  const result = await loadContent(CONTENT_TYPE, slug);
  debugLog(`Content load result: ${result ? 'Success' : 'Failed'}`);
  
  if (!result) {
    debugLog(`Content not found, returning 404`);
    return notFound();
  }
  
  const { MdxContent, metadata } = result;
  
  // Only log metadata in debug mode
  if (isDebugMode) {
    debugLog(`Loaded metadata:`, JSON.stringify(metadata, null, 2));
  }

  metadata.slug = slug;

  // Get the user session
  const session = await auth();
  debugLog(`User session: ${session ? 'Authenticated' : 'Not authenticated'}`);
  
  // First check if user has purchased the content by user ID
  let hasPurchased = false;
  if (metadata?.commerce?.isPaid) {
    // First try with user ID
    hasPurchased = await hasUserPurchased(session?.user?.id, slug);
    
    // If not found by user ID, try with email as a fallback
    if (!hasPurchased && session?.user?.email) {
      debugLog(`Not found by user ID, trying email: ${session.user.email}`);
      hasPurchased = await hasUserPurchased(session.user.email, slug);
    }
  }
  
  debugLog(`Is paid content: ${metadata?.commerce?.isPaid}, Has purchased: ${hasPurchased}`);

  // Always use ArticleLayout for consistency, even for purchased content
  return (
    <>
    <ArticleLayout metadata={metadata} serverHasPurchased={hasPurchased}>
      {hasPurchased ? (
        <div className="purchased-content">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="h-5 w-5 text-green-500" strokeWidth={2} />
            <span className="text-sm font-medium text-green-800">You Own This Premium Content</span>
          </div>
          {React.createElement(MdxContent)}
        </div>
      ) : (
        renderPaywalledContent(MdxContent, metadata, hasPurchased)
      )}
    </ArticleLayout>
    </>
  );
} 