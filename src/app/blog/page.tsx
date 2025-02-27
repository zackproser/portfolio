import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Article } from '@/lib/content/types/blog'
import { BlogPostCard } from '@/components/BlogPostCard'
import { createMetadata } from '@/utils/createMetadata'
import { Suspense } from 'react'

export const metadata: Metadata = createMetadata({
  title: 'Articles',
  description: 'All of my long-form thoughts on programming, leadership, product design, and more, collected in chronological order.',
})

function ArticleGrid({ articles }: { articles: Article[] }) {
  return (
    <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
      {articles.map((article) => (
        <BlogPostCard key={article.slug} article={article} />
      ))}
    </div>
  )
}

export default async function ArticlesIndex() {
  const articles = await Article.getAllArticles()

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

