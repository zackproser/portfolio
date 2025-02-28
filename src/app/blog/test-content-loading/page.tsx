import { Metadata } from 'next'
import { auth } from '../../../../auth'
import { 
  generateContentStaticParams, 
  generateContentMetadata, 
  hasUserPurchased,
  loadContent,
  contentExists,
  renderContent,
  getContentSlugs
} from '@/lib/content-handlers'
import { notFound } from 'next/navigation'
import { ArticleLayout } from '@/components/ArticleLayout'

// Content type for this handler
const CONTENT_TYPE = 'blog'

export const metadata: Metadata = {
  title: 'Test Content Loading',
  description: 'A test page to verify content loading mechanism'
}

export default async function TestContentLoadingPage() {
  // Get all blog slugs
  const slugs = getContentSlugs(CONTENT_TYPE)
  
  // Test content existence for the first few slugs
  const existenceTests = slugs.slice(0, 5).map(slug => {
    const exists = contentExists(CONTENT_TYPE, slug)
    return { slug, exists }
  })
  
  // Attempt to load the first slug that exists
  let loadedContent = null
  let loadedSlug = ''
  
  for (const { slug, exists } of existenceTests) {
    if (exists) {
      loadedSlug = slug
      loadedContent = await loadContent(CONTENT_TYPE, slug)
      if (loadedContent) break
    }
  }
  
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Content Loading Test</h1>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Available Slugs</h2>
        <ul className="list-disc pl-6">
          {slugs.slice(0, 10).map(slug => (
            <li key={slug} className="mb-2">
              {slug}
            </li>
          ))}
          {slugs.length > 10 && <li>...and {slugs.length - 10} more</li>}
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Existence Tests</h2>
        <ul className="list-disc pl-6">
          {existenceTests.map(({ slug, exists }) => (
            <li key={slug} className="mb-2">
              {slug}: {exists ? '✅ Exists' : '❌ Not found'}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Content Loading Test</h2>
        {loadedContent ? (
          <div>
            <p className="mb-4">✅ Successfully loaded content for: <strong>{loadedSlug}</strong></p>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">Metadata:</h3>
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(loadedContent.metadata, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <p>❌ Failed to load any content</p>
        )}
      </div>
    </div>
  )
} 