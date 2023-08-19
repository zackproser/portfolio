import Head from 'next/head'

import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllArticles } from '@/lib/getAllArticles'

import Image from 'next/image'
import Link from 'next/link'

import wakka from '@/images/wakka.png'

function BlogPostCard({ article }) {
  return (
    <article key={article.slug} className="flex flex-col items-start justify-between">
      <div className="relative w-full">
        <Link href={`/blog/${article.slug}`}>
          <Image
            src={article.image ?? wakka}
            alt={article.slug}
            className="aspect-[16/9] w-full rounded-2xl bg-gray-50 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
          />
        </Link>
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div className="max-w-xl">
        <div className="flex items-center gap-x-4 text-xs">
          <time className="text-gray-50">
            {article.date}
          </time>
        </div>
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-zinc-800 dark:text-zinc-100 group-hover:text-gray-600">
            <Link href={`/blog/${article.slug}`} >
              <span className="absolute inset-0 " />
              {article.title}
            </Link>
          </h3>
          <Link href={`/blog/${article.slug}`}><p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-800 dark:text-zinc-400 ">{article.description}</p></Link>
        </div>
      </div>
    </article >
  )
}

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
        title="I write to learn and discover, and I publish to share knowledge."
        intro="All of my technical tutorials, deep-dives, developer rants and video walkthroughs"
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
