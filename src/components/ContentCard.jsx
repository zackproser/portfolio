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

export function ContentCard({ article }) {
  if (!article) {
    console.warn('ContentCard received null or undefined article')
    return null;
  }

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
  
  // Simple check for external links
  const isExternalLink = slug?.startsWith('http://') || slug?.startsWith('https://');
  
  // For external links, use the slug directly
  // For internal links, use the slug as is - the parent component should provide the full path
  const href = isExternalLink ? slug : slug || '#';
  
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
      {isExternalLink ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="group w-full">
          <CardContent 
            imageSource={imageSource} 
            title={title} 
            formattedDate={formattedDate} 
            date={date}
            description={description}
            type={type}
            status={status}
            commerce={commerce}
          />
        </a>
      ) : (
        <Link href={href} className="group w-full">
          <CardContent 
            imageSource={imageSource} 
            title={title} 
            formattedDate={formattedDate} 
            date={date}
            description={description}
            type={type}
            status={status}
            commerce={commerce}
          />
        </Link>
      )}
    </article>
  )
}

function CardContent({ imageSource, title, formattedDate, date, description, type, status, commerce }) {
  return (
    <>
      <div className="relative w-full">
        <Image
          src={imageSource}
          alt={title}
          className="aspect-[16/9] w-full rounded-t-lg object-cover"
          width={500}
          height={281}
        />
        <div className="absolute inset-0 rounded-t-lg ring-1 ring-inset ring-gray-900/10" />
        {commerce?.price && <PriceBadge price={commerce.price} />}
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
        {type === 'course' && <StatusBadge status={status} />}
      </div>
    </>
  )
} 