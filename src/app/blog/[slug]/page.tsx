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
import React from 'react'

// Content type for this handler
const CONTENT_TYPE = 'blog'

// Define the PageProps interface to match the expected type
interface PageProps {
  params: {
    slug: string;
  };
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  return generateContentStaticParams(CONTENT_TYPE)
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return generateContentMetadata(CONTENT_TYPE, params.slug)
}

export default async function Page({ params }: PageProps) {
  const { slug } = params;
  
  console.log(`[blog/[slug]/page.tsx] Attempting to load content for slug: ${slug}`);
  
  // Check if content exists first
  const exists = contentExists(CONTENT_TYPE, slug);
  console.log(`[blog/[slug]/page.tsx] Content exists check: ${exists}`);
  
  if (!exists) {
    console.log(`[blog/[slug]/page.tsx] Content does not exist, returning 404`);
    return notFound();
  }
  
  // Load the content
  const result = await loadContent(CONTENT_TYPE, slug);
  console.log(`[blog/[slug]/page.tsx] Content load result: ${result ? 'Success' : 'Failed'}`);
  
  if (!result) {
    console.log(`[blog/[slug]/page.tsx] Content not found, returning 404`);
    return notFound();
  }
  
  const { MdxContent, metadata } = result;
  console.log(`[blog/[slug]/page.tsx] Loaded metadata:`, JSON.stringify(metadata, null, 2));
  
  // Get the user session
  const session = await auth();
  console.log(`[blog/[slug]/page.tsx] User session:`, session ? 'Authenticated' : 'Not authenticated');
  
  // Check if user has purchased the content (if it's paid)
  const hasPurchased = metadata?.commerce?.isPaid 
    ? await hasUserPurchased(session?.user?.id, slug)
    : false;
  
  console.log(`[blog/[slug]/page.tsx] Is paid content: ${metadata?.commerce?.isPaid}, Has purchased: ${hasPurchased}`);

  // Always use ArticleLayout for consistency, even for purchased content
  return (
    <ArticleLayout metadata={metadata}>
      {hasPurchased ? (
        <div className="purchased-content">
          <h2 className="text-2xl font-bold mb-4">Premium Content Unlocked</h2>
          <p className="mb-6">Thank you for your purchase! Enjoy the full content below.</p>
          {React.createElement(MdxContent)}
        </div>
      ) : (
        renderContent(MdxContent, metadata, session, hasPurchased)
      )}
    </ArticleLayout>
  );
} 