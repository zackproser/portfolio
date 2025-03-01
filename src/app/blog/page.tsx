import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { ContentCard } from '@/components/ContentCard'
import { createMetadata } from '@/utils/createMetadata'
import { Suspense } from 'react'
import { getAllContent } from '@/lib/content-handlers'
import { ExtendedMetadata } from '@/types'
import ArticleSearch from '@/components/ArticleSearch'

export const metadata: Metadata = createMetadata({
  title: 'Modern Coding - Research',
  description: 'Staff AI engineer - technical writing and development blog',
})

function ArticleGrid({ articles }: { articles: ExtendedMetadata[] }) {
  return (
    <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
      {articles.map((article, index) => {
        // Simply use the index as the key
        return (
          <ContentCard 
            key={index} 
            article={article} 
          />
        );
      })}
    </div>
  )
}

export default async function ArticlesIndex() {
  // Use our helper function to get all blog post metadata
  const articles = await getAllContent('blog');
  
  // Add debugging to log the articles being loaded
  console.log(`Loaded ${articles.length} blog articles`);
  
  // Log the first few articles for debugging
  articles.slice(0, 3).forEach((article, index) => {
    console.log(`Article ${index + 1}:`, {
      title: article.title,
      slug: article.slug,
      type: article.type
    });
  });
  
  return (
    <SimpleLayout
      title="I write to learn, and publish to share"
      intro="All of my technical tutorials, musings and developer rants"
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <Suspense fallback={<div>Loading articles...</div>}>
          <ArticleGrid articles={articles} />
        </Suspense>
      </div>
    </SimpleLayout>
  )
}

