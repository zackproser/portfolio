import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ClientSideIcon } from './ClientSideIcon'

const wakka = 'https://zackproser.b-cdn.net/images/wakka.webp'

const StatusBadge = ({ status }) => {
  const isActive = status !== undefined && status !== null;
  
  return (
    <span className={cn(
      "inline-flex items-center gap-x-2 rounded-lg mt-4 px-4 py-2 text-base font-bold text-white",
      "ring-2 ring-offset-2 ring-offset-gray-100 dark:ring-offset-gray-900 shadow-md transition duration-300 ease-in-out",
      isActive ? "bg-green-700 hover:bg-green-800 ring-green-500" : "bg-orange-600 hover:bg-orange-700 ring-orange-500"
    )}>
      <ClientSideIcon>
        <svg 
          className="h-3 w-3" 
          viewBox="0 0 6 6" 
          aria-hidden="true"
        >
          <circle 
            cx={3} 
            cy={3} 
            r={3} 
            className={isActive ? "fill-green-300" : "fill-yellow-300"}
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
      "absolute top-4 right-4 inline-flex items-center gap-x-2 rounded-full px-4 py-1.5 text-base font-bold",
      "bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-lg transition duration-300 ease-in-out hover:from-amber-600 hover:to-yellow-600",
      "ring-2 ring-amber-500/70 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
    )}>
      ${price}
    </span>
  )
}

const PremiumBadge = () => {
  return (
    <span className={cn(
      "absolute top-4 left-4 inline-flex items-center gap-x-1 rounded-full px-3 py-1 text-xs font-bold",
      "bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-white shadow-md backdrop-blur-sm",
      "border border-amber-400/50"
    )}>
      <span className="mr-0.5">💎</span> Premium
    </span>
  )
}

const ContentTypeBadge = ({ type }) => {
  const iconMap = {
    'article': '📝',
    'video': '🎥',
    'project': '⚙️',
    'course': '📚',
    'tutorial': '🧩',
    'demo': '🚀',
    'reference': '🏗️'
  }
  
  const icon = iconMap[type] || '📄'
  
  return (
    <span className={cn(
      "inline-flex items-center gap-x-1 rounded-full px-3 py-1 text-xs font-medium",
      "bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-200 backdrop-blur-sm",
      "border border-blue-200 dark:border-blue-700/50"
    )}>
      <span className="mr-0.5">{icon}</span> {type}
    </span>
  )
}

const WithCodeBadge = () => {
  return (
    <span className={cn(
      "inline-flex items-center gap-x-1 rounded-full px-3 py-1 text-xs font-medium",
      "bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200 backdrop-blur-sm",
      "border border-teal-200 dark:border-teal-700/50"
    )}>
      <span className="mr-0.5">💻</span> Includes Code
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
    image, 
    status, 
    commerce, 
    slug,
    type,
    includesCode
  } = article;
  
  // Simple check for external links
  const isExternalLink = slug?.startsWith('http://') || slug?.startsWith('https://');
  
  let calculatedHref = '#';
  if (isExternalLink) {
    calculatedHref = slug;
  } else if (slug) {
    if (type === 'comparison') {
      // Ensure no double slashes if slug might accidentally have one (it shouldn't from our generator)
      calculatedHref = `/comparisons/${slug.startsWith('/') ? slug.substring(1) : slug}`;
    } else {
      // For other internal links, assume slug is the intended href.
      // If it's not a full path (e.g. /blog/my-post) Link component will resolve it relatively.
      // If it is a full path (e.g. /blog/my-post), Link will use it as is.
      calculatedHref = slug;
    }
  }
  
  // Format the date using the proper utility to avoid timezone issues
  const formattedDate = date ? new Date(`${date}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }) : '';

  // Handle image object or string with improved fallback
  let imageSource; 
  try {
    if (typeof image === 'string') {
      // Handle string paths
      if (image.startsWith('/') || image.startsWith('http')) {
        // External URLs or absolute paths
        imageSource = image;
      } else if (image.includes('/')) {
        // If it has any slashes, keep as is
        imageSource = image;
      } else {
        // For simple filenames, assume they're in public/images
        // Next.js will look for them in the public directory
        imageSource = wakka; // Use fallback image
      }
    } else if (image?.src) {
      // Handle image objects (e.g. from next/image imports)
      imageSource = image.src;
    } else {
      // Use default fallback
      imageSource = wakka;
    }
  } catch (e) {
    console.error('Error processing image in ContentCard:', e);
    imageSource = wakka;
  }
  
  // Check if content is premium (has a price)
  const isPremium = commerce?.price && commerce.price > 0;

  return (
    <article className={cn(
      "flex flex-col overflow-hidden rounded-lg transition-all duration-300 bg-white dark:bg-gray-800 border relative w-full",
      isPremium 
        ? "shadow-xl hover:shadow-2xl border-amber-200 dark:border-amber-700/30" 
        : "shadow-lg hover:shadow-xl border-gray-200 dark:border-gray-700"
    )}>
      {isExternalLink ? (
        <a href={calculatedHref} target="_blank" rel="noopener noreferrer" className="group w-full">
          <CardContent 
            imageSource={imageSource} 
            title={title} 
            formattedDate={formattedDate} 
            date={date}
            description={description}
            type={type}
            status={status}
            commerce={commerce}
            isPremium={isPremium}
            includesCode={includesCode}
          />
        </a>
      ) : (
        <Link href={calculatedHref} className="group w-full">
          <CardContent 
            imageSource={imageSource} 
            title={title} 
            formattedDate={formattedDate} 
            date={date}
            description={description}
            type={type}
            status={status}
            commerce={commerce}
            isPremium={isPremium}
            includesCode={includesCode}
          />
        </Link>
      )}
    </article>
  )
}

function CardContent({ 
  imageSource, 
  title, 
  formattedDate, 
  date, 
  description, 
  type, 
  status, 
  commerce,
  isPremium,
  includesCode
}) {
  return (
    <>
      <div className="relative w-full">
        <Image
          src={imageSource}
          alt={title}
          className={cn(
            "aspect-[16/9] w-full rounded-t-lg object-cover h-60 sm:h-64",
            isPremium && "brightness-[0.97]" // Subtle effect for premium content
          )}
          width={600}
          height={350}
          priority={true}
        />
        <div className={cn(
          "absolute inset-0 rounded-t-lg ring-1 ring-inset",
          isPremium 
            ? "ring-amber-300/30 dark:ring-amber-500/20" 
            : "ring-gray-900/10 dark:ring-gray-700/50"
        )} />
        {commerce?.price && <PriceBadge price={commerce.price} />}
        {isPremium && <PremiumBadge />}
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300 mb-3">
            {/* Only show content type badges for pages that specifically request it */}
            {formattedDate && <time dateTime={date} className="text-xs text-gray-500 dark:text-gray-400 ml-1">{formattedDate}</time>}
          </div>
          <h3 className={cn(
            "text-xl md:text-2xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-300 ease-in-out tracking-tight",
            isPremium 
              ? "text-gray-900 dark:text-amber-50" 
              : "text-gray-900 dark:text-white"
          )}>
            {title}
          </h3>
          <p className="mt-3 text-sm leading-6 text-zinc-700 dark:text-zinc-200 line-clamp-3 font-medium">
            {description}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {isPremium && (
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2 flex items-center">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Master This Skill →
            </div>
          )}
        </div>
      </div>
    </>
  )
} 