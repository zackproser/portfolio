import Head from 'next/head'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import { formatDate } from '@/lib/formatDate'
import { getAllArticles } from '@/lib/getAllArticles'
import wakkaImg from '@/images/wakka.png'

function BlogPostCard({ article }) {
  return (
    <article key={article.slug} className="flex flex-col items-start justify-between">
      <div className="relative w-full">
        <img
          src={article.image ?? wakkaImg}
          alt={article.slug}
          className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
        />
        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
      </div>
      <div className="max-w-xl">
        <div className="mt-8 flex items-center gap-x-4 text-xs">
          <time className="text-gray-500">
            {article.date}
          </time>
          <a
            href={article.href}
            className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
          >
            {article.title}
          </a>
        </div>
        <div className="group relative">
          <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
            <a href={article.href}>
              <span className="absolute inset-0" />
              {article.title}
            </a>
          </h3>
          <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">{article.description}</p>
        </div>
        <div className="relative mt-8 flex items-center gap-x-4">
          <img src={article.author.imageUrl} alt="" className="h-10 w-10 rounded-full bg-gray-100" />
          <div className="text-sm leading-6">
            <p className="font-semibold text-gray-900">
              <a href={article.author.href}>
                <span className="absolute inset-0" />
                {article.author}
              </a>
            </p>
            <p className="text-gray-600">Grand PooBah</p>
          </div>
        </div>
      </div>
    </article>
  )
}

function Article({ article }) {
  return (
    <article className="md:grid md:grid-cols-4 md:items-baseline">
      <Card className="md:col-span-3">
        <Card.Title href={`/blog/${article.slug}`}>
          {article.title}
        </Card.Title>
        <Card.Eyebrow
          as="time"
          dateTime={article.date}
          className="md:hidden"
          decorate
        >
          {formatDate(article.date)}
        </Card.Eyebrow>
        <Card.Description>{article.description}</Card.Description>
        <Card.Cta>Read article</Card.Cta>
      </Card>
      <Card.Eyebrow
        as="time"
        dateTime={article.date}
        className="mt-1 hidden md:block"
      >
        {formatDate(article.date)}
      </Card.Eyebrow>
    </article>
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
