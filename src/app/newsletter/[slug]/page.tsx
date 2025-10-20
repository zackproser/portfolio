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
const CONTENT_TYPE = 'newsletter'

// Define the PageProps interface to match the expected type
interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Generate static params for all newsletter posts
export async function generateStaticParams() {
  return generateContentStaticParams(CONTENT_TYPE)
}

export const revalidate = 3600;

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const { slug } = resolvedParams;
  logger.debug(`Generating metadata for newsletter slug: ${slug}`);
  return generateContentMetadata(CONTENT_TYPE, slug)
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  logger.debug(`Loading newsletter content for slug: ${slug}`);

  // Load newsletter content
  const result = await getContentWithComponentByDirectorySlug('newsletter', slug);

  logger.debug(`Newsletter content load result: ${result ? 'Success' : 'Failed'}`);

  if (!result) {
    logger.warn(`Newsletter content not found for slug ${slug}, returning 404`);
    return notFound();
  }

  const { MdxContent, content } = result;

  logger.debug(`Loaded newsletter content data for slug ${slug}:`, JSON.stringify(content, null, 2));

  // Get the user session
  const session = await auth();
  logger.debug(`User session status: ${session ? 'Authenticated' : 'Not authenticated'}`);

  // Check if user has purchased the content (newsletters typically free)
  let hasPurchased = false;
  if (content?.commerce?.isPaid) {
    logger.debug(`Checking purchase status for paid newsletter (${slug})`);
    const directorySlug = content.directorySlug || slug;
    hasPurchased = await hasUserPurchased(session?.user?.id, directorySlug);
    logger.debug(`Purchase check by user ID (${session?.user?.id || 'N/A'}): ${hasPurchased}`);
    if (!hasPurchased && session?.user?.email) {
      logger.debug(`Not found by user ID, trying email: ${session.user.email}`);
      hasPurchased = await hasUserPurchased(session.user.email, directorySlug);
      logger.debug(`Purchase check by email (${session.user.email}): ${hasPurchased}`);
    }
  }

  // Newsletters are free - no subscription check needed
  logger.info(`Rendering newsletter page for slug: ${slug}, Paid: ${!!content?.commerce?.isPaid}, Purchased: ${hasPurchased}`);

  const hideNewsletter = false

  return (
    <>
    <ArticleLayout metadata={content} serverHasPurchased={hasPurchased} hideNewsletter={hideNewsletter}>
      {content?.commerce?.isPaid ? (
        hasPurchased ? (
          <div className="purchased-content">
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
              <CheckCircle className="h-5 w-5 text-green-500" strokeWidth={2} />
              <span className="text-sm font-medium text-green-800">You Own This Premium Content</span>
            </div>
            {React.createElement(MdxContent)}
          </div>
        ) : (
          renderPaywalledContent(MdxContent, content, hasPurchased, false)
        )
      ) : (
        // Free content (newsletters) - render directly
        React.createElement(MdxContent)
      )}
    </ArticleLayout>
    </>
  );
}
