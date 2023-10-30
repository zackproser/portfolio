import { type Metadata } from 'next'

import { SimpleLayout } from '@/components/SimpleLayout'
import { type ArticleWithSlug } from '@/lib/shared-types'
import { getAllArticles } from '@/lib/articles'
import { BlogPostCard } from '@/components/BlogPostCard'

import { generateOgUrl } from '@/utils/ogUrl'

const data = {
  title: 'Articles',
  description:
    'All of my technical tutorials, deep-dives, and developer rants'

};

const ogUrl = generateOgUrl(data);

export const metadata: Metadata = {
  openGraph: {
    title: data.title,
    description: data.description,
    url: ogUrl,
    siteName: 'Zack Proser&apos;s portfolio',
    images: [
      {
        url: ogUrl,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
};

export default async function ArticlesIndex() {
  let articles = await getAllArticles()

  return (
    <SimpleLayout
      title="I write to learn, and publish to share."
      intro="All of my technical tutorials, musings and developer rants"
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {articles.map((article: ArticleWithSlug) => (
            <BlogPostCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
