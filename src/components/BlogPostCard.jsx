import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils' // Assuming you have a utility function for combining classes
import { ClientSideIcon } from './ClientSideIcon'

import wakka from '@/images/wakka.webp'

const StatusBadge = ({ status }) => {
  const isActive = status !== undefined && status !== null;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-x-2 rounded-lg mt-4 px-3 py-2 text-sm font-semibold text-white",
      "ring-2 ring-offset-2 ring-offset-gray-800 shadow-md transition duration-300 ease-in-out",
      isActive ? "bg-green-700 hover:bg-gray-800 ring-green-500" : "bg-orange-500 hover:bg-gray-800 ring-yellow-500"
    )}>
      <ClientSideIcon>
        <svg 
          className="h-2 w-2" 
          viewBox="0 0 6 6" 
          aria-hidden="true"
        >
          <circle 
            cx={3} 
            cy={3} 
            r={3} 
            className={isActive ? "fill-green-500" : "fill-yellow-500"}
          />
        </svg>
      </ClientSideIcon>
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
  comparison: '/comparisons/',
  default: '/blog/'
}

export function BlogPostCard({ article }) {
  const isExternalLink = article.slug.startsWith('http://') || article.slug.startsWith('https://');
  const href = isExternalLink ? article.slug : `${rootPaths[article?.type] || rootPaths.default}${article.slug}`;

  const LinkComponent = isExternalLink ? 'a' : Link;
  const linkProps = isExternalLink ? { href, target: "_blank", rel: "noopener noreferrer" } : { href };

  return (
    <article className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-800">
      <LinkComponent {...linkProps} className="relative w-full">
        <Image
          src={article.image ?? wakka}
          alt={article.title}
          className="aspect-[16/9] w-full rounded-t-lg object-cover"
          width={500}
          height={281}
        />
        <div className="absolute inset-0 rounded-t-lg ring-1 ring-inset ring-gray-900/10" />
      </LinkComponent>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-x-4 text-xs text-gray-500 dark:text-gray-400">
            <time dateTime={article.date}>{article.date}</time>
          </div>
          <LinkComponent {...linkProps} className="block mt-3 group">
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-gray-600 transition duration-300 ease-in-out">
              {article.title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-800 dark:text-zinc-400 line-clamp-3">
              {article.description}
            </p>
          </LinkComponent>
        </div>
        {article.type === 'course' && <StatusBadge status={article.status} />}
      </div>
    </article>
  )
}
