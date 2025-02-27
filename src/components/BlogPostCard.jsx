import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
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

const PriceBadge = ({ price }) => {
  if (!price) return null;
  
  return (
    <span className={cn(
      "absolute top-4 right-4 inline-flex items-center gap-x-2 rounded-full px-3 py-1 text-sm font-semibold",
      "bg-green-600 text-white shadow-lg transition duration-300 ease-in-out hover:bg-green-700",
      "ring-2 ring-green-500 ring-offset-2 ring-offset-gray-800"
    )}>
      ${price}
    </span>
  )
}

export function BlogPostCard({ article }) {
  if (!article) {
    console.warn('BlogPostCard received null or undefined article')
    return null;
  }

  // Ensure we extract and handle the slug properly
  const { 
    title = 'Untitled', 
    date = '', 
    description = '', 
    image = wakka, 
    status, 
    commerce, 
    slug,
    type
  } = article;
  
  // Log the full article object for debugging
  console.log(`BlogPostCard: Article data for "${title}":`, {
    slug,
    type
  });
  
  // Log warning if slug is missing
  if (!slug) {
    console.warn(`BlogPostCard: Missing slug for article "${title}"`)
  }
  
  const price = commerce?.price;
  
  // Check if the article has an external URL (starts with http)
  const isExternalLink = slug?.startsWith('http://') || slug?.startsWith('https://');
  
  // Determine the href - prioritize slug and handle external links
  let href;
  if (isExternalLink) {
    href = slug;
  } else if (slug) {
    // Simple content type based routing
    const typePath = type === 'video' ? 'videos' : 
                    type === 'comparison' ? 'comparisons' : 
                    type === 'course' ? 'learn/courses' : 
                    type || 'blog';
    
    href = `/${typePath}/${slug}`;
    console.log(`BlogPostCard: Generated href for "${title}": ${href}`);
  } else {
    // If no slug is available, log a warning but provide a fallback
    console.warn(`BlogPostCard: No slug available for article "${title}"`);
    href = "#";
  }

  // Use a different approach for articles without proper links
  const hasValidLink = href !== "#";
  
  // Only use Link for valid internal links
  const LinkComponent = isExternalLink || !hasValidLink ? 'a' : Link;
  
  // For Link components, ensure we're using the correct href format
  const linkProps = isExternalLink ? 
    { href, target: "_blank", rel: "noopener noreferrer" } : 
    (!hasValidLink ? 
      { href: "#", className: "cursor-default" } : 
      { href }
    );

  // Format the date
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '';

  // Handle image object or string
  const imageSource = typeof image === 'string' ? image : image?.src || wakka;

  return (
    <article className="flex flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl bg-white dark:bg-zinc-800 relative w-full">
      <LinkComponent {...linkProps} className="group w-full">
        <div className="relative w-full">
          <Image
            src={imageSource}
            alt={title}
            className="aspect-[16/9] w-full rounded-t-lg object-cover"
            width={500}
            height={281}
          />
          <div className="absolute inset-0 rounded-t-lg ring-1 ring-inset ring-gray-900/10" />
          {price && <PriceBadge price={price} />}
        </div>
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-x-4 text-xs text-gray-500 dark:text-gray-400">
              {formattedDate && <time dateTime={date}>{formattedDate}</time>}
            </div>
            <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-gray-600 transition duration-300 ease-in-out mt-3">
              {title}
            </h3>
            <p className="mt-3 text-sm leading-6 text-zinc-800 dark:text-zinc-400 line-clamp-3">
              {description}
            </p>
          </div>
          {article.type === 'course' && <StatusBadge status={status} />}
        </div>
      </LinkComponent>
    </article>
  )
}
