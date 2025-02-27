import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { BlogPostCard } from '@/components/BlogPostCard'
import { createMetadata } from '@/utils/createMetadata'
import { Suspense } from 'react'
import { getAllContentMetadata } from '@/lib/getAllContentMetadata'
import { ExtendedMetadata } from '@/lib/shared-types'

export const metadata: Metadata = createMetadata({
  title: 'Articles',
  description: 'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
})

function ArticleGrid({ articles }: { articles: ExtendedMetadata[] }) {
  // Add debugging to check for duplicate slugs
  const slugCounts: Record<string, number> = {};
  articles.forEach(article => {
    const key = article.slug || 'unknown';
    slugCounts[key] = (slugCounts[key] || 0) + 1;
  });
  
  // Log any duplicate slugs
  Object.entries(slugCounts)
    .filter(([_, count]) => count > 1)
    .forEach(([slug, count]) => {
      console.warn(`Duplicate slug found: "${slug}" appears ${count} times`);
    });
  
  return (
    <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
      {articles.map((article, index) => {
        // Use _id if available, otherwise create a unique key
        const uniqueKey = article._id || (article.slug ? `${article.slug}-${index}` : `article-${index}`);
        return (
          <BlogPostCard 
            key={uniqueKey} 
            article={article} 
          />
        );
      })}
    </div>
  )
}

export default async function ArticlesIndex() {
  // Use our helper function to get all blog post metadata
  const articles = await getAllContentMetadata('blog');
  
  // Add debugging to log the articles being loaded
  console.log(`Loaded ${articles.length} blog articles`);
  
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

