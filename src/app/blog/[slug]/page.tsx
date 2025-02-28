import { Metadata } from 'next'
import { auth } from '../../../../auth'
import { 
  generateContentStaticParams, 
  generateContentMetadata, 
  hasUserPurchased,
  loadContent,
  renderContent
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
  const resolvedParams = await params;
  const { slug } = resolvedParams;

  console.log(`[blog/[slug]/page.tsx] Loading content for slug: ${slug}`);
  
  // Load the content
  const result = await loadContent(CONTENT_TYPE, slug);
  console.log(`[blog/[slug]/page.tsx] Content load result: ${result ? 'Success' : 'Failed'}`);
  
  if (!result) {
    console.log(`[blog/[slug]/page.tsx] Content not found, returning 404`);
    return notFound();
  }
  
  const { MdxContent, metadata } = result;
  console.log(`[blog/[slug]/page.tsx] Loaded metadata:`, JSON.stringify(metadata, null, 2));

  metadata.slug = slug;

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
    <>
    <ArticleLayout metadata={metadata}>
      {hasPurchased ? (
        <div className="purchased-content">
          <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
            <CheckCircle className="h-5 w-5 text-green-500" strokeWidth={2} />
            <span className="text-sm font-medium text-green-800">You Own This Premium Content</span>
          </div>
          {React.createElement(MdxContent)}
        </div>
      ) : (
        renderContent(MdxContent, metadata, session, hasPurchased)
      )}
    </ArticleLayout>
    </>
  );
} 