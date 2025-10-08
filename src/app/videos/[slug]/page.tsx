import { Metadata } from 'next'
import { auth } from '../../../../auth'
import { 
  generateContentStaticParams, 
  generateContentMetadata, 
  hasUserPurchased,
  getContentWithComponentByDirectorySlug,
  renderPaywalledContent
} from '@/lib/content-handlers'
import { notFound } from 'next/navigation'
import { ArticleLayout } from '@/components/ArticleLayout'
import React from 'react'
import { CheckCircle } from 'lucide-react'
import { metadataLogger as logger } from '@/utils/logger'
import { isEmailSubscribed } from '@/lib/newsletter'

// Content type for this handler
const CONTENT_TYPE = 'videos'

// Define the PageProps interface to match the expected type
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate static params for all video posts
// export async function generateStaticParams() {
//   return generateContentStaticParams(CONTENT_TYPE)
// }

export const revalidate = 3600;

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  return generateContentMetadata(CONTENT_TYPE, resolvedParams.slug)
}

export default async function VideoSlugPage({ params }: PageProps) {
  const { slug } = await params;
  const CONTENT_TYPE = 'videos';

  logger.debug(`Loading video content for slug: ${slug}`);
  const result = await getContentWithComponentByDirectorySlug(CONTENT_TYPE, slug);
  logger.debug(`Video content load result: ${result ? 'Success' : 'Failed'}`);
  
  if (!result) {
    logger.warn(`Video content not found for slug ${slug}, returning 404`);
    return notFound();
  }
  
  const { MdxContent, content } = result;
  
  logger.debug(`Loaded video content data for slug ${slug}:`, JSON.stringify(content, null, 2));

  // Get the user session
  const session = await auth();
  logger.debug(`User session status: ${session ? 'Authenticated' : 'Not authenticated'}`);
  
  // First check if user has purchased the content by user ID
  let hasPurchased = false;
  if (content?.commerce?.isPaid) {
    logger.debug(`Checking purchase status for paid video content (${slug})`);
    // Use the directorySlug from the content object
    const directorySlug = content.directorySlug || slug;
    // First try with user ID
    hasPurchased = await hasUserPurchased(session?.user?.id, directorySlug);
    logger.debug(`Purchase check by user ID (${session?.user?.id || 'N/A'}): ${hasPurchased}`);
    // If not found by user ID, try with email as a fallback
    if (!hasPurchased && session?.user?.email) {
      logger.debug(`Not found by user ID, trying email: ${session.user.email}`);
      hasPurchased = await hasUserPurchased(session.user.email, directorySlug);
      logger.debug(`Purchase check by email (${session.user.email}): ${hasPurchased}`);
    }
  } else {
    logger.debug(`Video content (${slug}) is not marked as paid.`);
  }

  let isSubscribed = false;
  if (content?.commerce?.requiresEmail) {
    isSubscribed = await isEmailSubscribed(session?.user?.email || null);
  }
  
  logger.info(`Rendering video page for slug: ${slug}, Paid: ${!!content?.commerce?.isPaid}, Purchased: ${hasPurchased}`);

  // Always use ArticleLayout for consistency, even for purchased content
  const hideNewsletter = !!(content?.commerce?.requiresEmail && !isSubscribed)
  const isAuthenticated = !!session?.user?.email

  return (
    <>
    <ArticleLayout metadata={content} serverHasPurchased={hasPurchased} hideNewsletter={hideNewsletter}>
      {hasPurchased ? (
        <div className="purchased-content">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="h-5 w-5 text-green-500" strokeWidth={2} />
            <span className="text-sm font-medium text-green-800">You Own This Premium Content</span>
          </div>
          {React.createElement(MdxContent)}
        </div>
      ) : (
        renderPaywalledContent(MdxContent, content, hasPurchased, isSubscribed, isAuthenticated)
      )}
    </ArticleLayout>
    </>
  );
} 