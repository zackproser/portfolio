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
// export async function generateStaticParams() {
//   return generateContentStaticParams(CONTENT_TYPE)
// }

export const revalidate = 3600;

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  logger.debug(`Generating metadata for slug: ${slug}`);
  return generateContentMetadata(CONTENT_TYPE, slug)
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  logger.debug(`Loading content for slug: ${slug}`);

  // Try blog first, then fall back to reviews
  let result = await getContentWithComponentByDirectorySlug('blog', slug);

  if (!result) {
    logger.debug(`Content not found in blog, trying reviews directory`);
    result = await getContentWithComponentByDirectorySlug('reviews', slug);
  }

  logger.debug(`Content load result: ${result ? 'Success' : 'Failed'}`);

  if (!result) {
    logger.warn(`Content not found for slug ${slug}, returning 404`);
    return notFound();
  }
  
  const { MdxContent, content } = result;
  
  logger.debug(`Loaded content data for slug ${slug}:`, JSON.stringify(content, null, 2));

  // Ensure slug is set on the content object if needed elsewhere (seems redundant as it's already in content.slug)
  // content.slug = slug;

  // Get the user session
  const session = await auth();
  logger.debug(`User session status: ${session ? 'Authenticated' : 'Not authenticated'}`);
  
  // First check if user has purchased the content by user ID
  let hasPurchased = false;
  if (content?.commerce?.isPaid) {
    logger.debug(`Checking purchase status for paid content (${slug})`);
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
    logger.debug(`Content (${slug}) is not marked as paid.`);
  }

  // For Tier 2 (requiresAuth), we only check if session exists
  const requiresAuth = content?.commerce?.requiresAuth ?? content?.commerce?.requiresEmail ?? false;

  logger.info(`Rendering page for slug: ${slug}, Paid: ${!!content?.commerce?.isPaid}, Purchased: ${hasPurchased}, RequiresAuth: ${requiresAuth}, HasSession: ${!!session}`);

  // Always use ArticleLayout for consistency, even for purchased content
  // Don't hide newsletter based on auth requirements - user can still access content if signed in
  const hideNewsletter = false

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
        renderPaywalledContent(MdxContent, content, hasPurchased, !!session)
      )}
    </ArticleLayout>
    </>
  );
} 