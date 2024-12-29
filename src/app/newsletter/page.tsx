import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Container } from '@/components/Container'
import SubscribeWidget from '@/components/SubscribeWidget'
import { type ArticleWithSlug } from '@/lib/shared-types'
import { getAllNewsletters } from '@/lib/newsletters'
import { BlogPostCard } from '@/components/BlogPostCard'
import { BaseArticleWithSlug } from '@/lib/shared-types'

import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: "Zachary Proser - Newsletter",
  description: "Staff Developer Advocate AI and Developer Tooling newsletter",
});

export default async function ArticlesIndex() {
  let articles = await getAllNewsletters()

  return (
    <Container>
      <SubscribeWidget />
      <SimpleLayout
        title="What is going on in AI, open-source and developer tooling?"
        intro="Subscribe to my newsletter to find out!"
      >
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {articles.map((article: BaseArticleWithSlug) => (
              <BlogPostCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </SimpleLayout>
    </Container >
  )
}
