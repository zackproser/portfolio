import Image from 'next/image'
import Link from 'next/link'

import wakka from '@/images/wakka.png'

export function BlogPostCard({ article }) {

  const StatusBadge = ({ status }) => {
    console.log(`StatusBadge: ${status}`)
    return status ? (
      <span className="inline-flex items-center gap-x-2 rounded-lg mt-4 px-3 py-2 text-sm font-semibold text-white bg-green-700 hover:bg-gray-800 ring-2 ring-offset-2 ring-offset-gray-800 ring-green-500 shadow-md transition duration-300 ease-in-out">
        <svg className="h-2 w-2 fill-green-500" viewBox="0 0 6 6" aria-hidden="true">
          <circle cx={3} cy={3} r={3} />
        </svg>
        {status}
      </span>
    ) : (
      <span className="inline-flex items-center gap-x-2 rounded-lg mt-4 px-3 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-gray-800 ring-2 ring-offset-2 ring-offset-gray-800 ring-yellow-500 shadow-md transition duration-300 ease-in-out">
        <svg className="h-2 w-2 fill-yellow-500" viewBox="0 0 6 6" aria-hidden="true" >
          <circle cx={3} cy={3} r={3} />
        </svg>
        Coming soon!
      </span>
    )
  }

  let root = '/blog/'

  if (article?.type == 'video') {
    root = '/videos/'
  }

  if (article?.type == 'course') {
    root = '/learn/courses/'
  }

  return (
    <article key={article.slug} className="flex flex-col items-start justify-between">
      <div className="relative w-full">
        <Link href={`${root}${article.slug}`}>
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
            <Link href={`${root}${article.slug}`} >
              <span className="absolute inset-0 " />
              {article.title}
            </Link>
            {}
          </h3>
          <Link href={`${root}${article.slug}`}><p className="mt-5 line-clamp-3 text-sm leading-6 text-zinc-800 dark:text-zinc-400 ">{article.description}</p></Link>
          {(article.type && article.type == 'course') ? <StatusBadge status={article.status} /> : null}
        </div>
      </div >
    </article >
  )
}
