import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils' // Assuming you have a utility function for combining classes

import wakka from '@/images/wakka.webp'

const StatusBadge = ({ status }) => {
  const isActive = !!status;
  return (
    <span className={cn(
      "inline-flex items-center gap-x-2 rounded-lg mt-4 px-3 py-2 text-sm font-semibold text-white",
      "ring-2 ring-offset-2 ring-offset-gray-800 shadow-md transition duration-300 ease-in-out",
      isActive ? "bg-green-700 hover:bg-gray-800 ring-green-500" : "bg-orange-500 hover:bg-gray-800 ring-yellow-500"
    )}>
      <svg className={cn("h-2 w-2", isActive ? "fill-green-500" : "fill-yellow-500")} viewBox="0 0 6 6" aria-hidden="true">
        <circle cx={3} cy={3} r={3} />
      </svg>
      {isActive ? status : "Coming soon!"}
    </span>
  )
}

const rootPaths = {
  collection: '/collections/',
  video: '/videos/',
  course: '/learn/courses/',
  newsletter: '/newsletter/',
  demo: '/demos/',
  comparison: '/comparisons/', // Add this line
  default: '/blog/'
}

export function BlogPostCard({ article }) {
  const root = rootPaths[article?.type] || rootPaths.default;
  const href = article.type === 'comparison' ? `${root}${article.slug}` : `${root}${article.slug}`;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-800">
      <Link href={href} className="relative w-full">
        <Image
          src={article.image ?? wakka}
          alt={article.title}
          className="aspect-[16/9] w-full rounded-t-lg object-cover"
          width={500}
          height={281}
        />
        <div className="absolute inset-0 rounded-t-lg ring-1 ring-inset ring-gray-900/10" />
      </Link>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-x-4 text-xs text-gray-500 dark:text-gray-400">
            <time dateTime={article.date}>{article.date}</time>
          </div>
          <Link href={href} className="block mt-3 group">
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-gray-600 transition duration-300 ease-in-out">
              {article.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-800 dark:text-zinc-400 line-clamp-3">
              {article.description}
            </p>
          </Link>
        </div>
        {article.type === 'course' && <StatusBadge status={article.status} />}
      </div>
    </article>
  )
}
