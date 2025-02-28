import { Metadata } from 'next'
import { auth } from '../../../../auth'
import { 
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
const TEST_SLUG = 'test-content'

export const metadata: Metadata = {
  title: 'Test Content Directory',
  description: 'A test page to verify content loading from the content directory'
}

export default async function TestContentDirectoryPage() {
  console.log(`[test-content-directory/page.tsx] Attempting to load content for slug: ${TEST_SLUG}`);
  
  // Check if content exists first
  const exists = contentExists(CONTENT_TYPE, TEST_SLUG);
  console.log(`[test-content-directory/page.tsx] Content exists check: ${exists}`);
  
  if (!exists) {
    console.log(`[test-content-directory/page.tsx] Content does not exist, returning 404`);
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Test Content Not Found</h1>
        <p>The test content was not found. Make sure you have created the file at:</p>
        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded mt-4">
          src/content/blog/test-content/page.mdx
        </pre>
      </div>
    );
  }
  
  // Load the content
  const result = await loadContent(CONTENT_TYPE, TEST_SLUG);
  console.log(`[test-content-directory/page.tsx] Content load result: ${result ? 'Success' : 'Failed'}`);
  
  if (!result) {
    console.log(`[test-content-directory/page.tsx] Content not found, returning 404`);
    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Test Content Load Failed</h1>
        <p>The test content exists but could not be loaded. Check the console for errors.</p>
      </div>
    );
  }
  
  const { MdxContent, metadata } = result;
  console.log(`[test-content-directory/page.tsx] Loaded metadata:`, JSON.stringify(metadata, null, 2));
  
  // Get the user session
  const session = await auth();
  console.log(`[test-content-directory/page.tsx] User session:`, session ? 'Authenticated' : 'Not authenticated');
  
  // Check if user has purchased the content (if it's paid)
  const hasPurchased = metadata?.commerce?.isPaid 
    ? await hasUserPurchased(session?.user?.id, TEST_SLUG)
    : false;
  
  console.log(`[test-content-directory/page.tsx] Is paid content: ${metadata?.commerce?.isPaid}, Has purchased: ${hasPurchased}`);

  // Render the content
  return (
    <div>
      <div className="container mx-auto p-8 mb-8 bg-green-100 dark:bg-green-900 rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Test Content Directory</h1>
        <p className="mb-2">✅ Successfully loaded content from the content directory!</p>
        <p className="mb-2">Content slug: <strong>{TEST_SLUG}</strong></p>
        <p className="mb-2">Content title: <strong>{metadata.title}</strong></p>
        <p className="mb-2">Content author: <strong>{metadata.author}</strong></p>
        <p className="mb-2">Content date: <strong>{metadata.date}</strong></p>
      </div>
      
      <ArticleLayout metadata={metadata}>
        {renderContent(MdxContent, metadata, session, hasPurchased)}
      </ArticleLayout>
    </div>
  );
} 