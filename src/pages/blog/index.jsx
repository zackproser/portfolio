import Head from 'next/head'

import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllArticles } from '@/lib/getAllArticles'

import { BlogPostCard } from '@/components/BlogPostCard'

export default function ArticlesIndex({ articles }) {
  return (
    <>
      <Head>
        <title>Articles - Zachary Proser</title>
        <meta
          name="description"
          content="All of my technical tutorials, deep-dives, developer rants and video walkthroughs"
        />
      </Head>
      <SimpleLayout
        title="I write to learn. I publish to share."
        intro="All of my technical tutorials, musings and developer rants"
      >
        <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {articles.map((article) => (
              <BlogPostCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </SimpleLayout >
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      articles: (await getAllArticles()).map(({ component, ...meta }) => meta),
    },
  }
}
