import { Button } from '@/components/Button'
import { GridPattern } from '@/components/GridPattern'
import { StarRating } from '@/components/StarRating'
import { Testimonial as TestimonialType } from '@/data/testimonials'
import Image from 'next/image'
import { BookCover } from './BookCover'

function Testimonial({ author, content }: { 
  author: { name: string; role: string; imageUrl?: any };
  content: string;
}) {
  return (
    <figure className="relative mx-auto max-w-md text-center lg:mx-0 lg:text-left">
      <blockquote>
        <p className="font-display text-xl font-medium text-slate-900 dark:text-white">
          &ldquo;{content}&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-2 flex items-center justify-center lg:justify-start">
        {author.imageUrl && (
          <Image 
            className="h-10 w-10 rounded-full mr-3 object-cover"
            src={author.imageUrl}
            alt={author.name}
            width={40}
            height={40}
          />
        )}
        <div>
          <strong className="font-semibold text-blue-600 block">
            {author.name}
          </strong>
          <span className="block text-sm text-slate-500 dark:text-slate-400">
            {author.role}
          </span>
        </div>
      </figcaption>
    </figure>
  )
}

interface HeroProps {
  title: string;
  heroTitle?: string;
  description: string;
  benefitStatement?: string; // Clear statement of user benefit
  problemSolved?: string; // What problem this solves
  testimonial?: {
    content: string;
    author: {
      name: string;
      role: string;
      imageUrl?: any;
    };
  };
  image?: string | any;
}

export function Hero({ 
  title, 
  heroTitle, 
  description, 
  benefitStatement,
  problemSolved,
  testimonial,
  image
}: HeroProps) {
  return (
    <header className="overflow-hidden bg-slate-100 lg:bg-transparent lg:px-5 dark:bg-slate-900 lg:dark:bg-transparent">
      <div className="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-10 pt-6 md:pt-8 lg:grid-cols-12 lg:gap-y-6 lg:px-3 lg:pt-3 lg:pb-12 xl:py-8">
        {/* Mobile/tablet: Text content first, ebook cover second (order matters in grid layout) */}
        {/* Desktop: Side by side with grid-cols-12 */}
        
        {/* Text content - appears first on mobile/tablet, second (right side) on desktop */}
        <div className="order-1 lg:order-2 bg-white pt-8 lg:col-span-7 lg:bg-transparent lg:pt-0 lg:pl-16 xl:pl-20 dark:bg-slate-800 lg:dark:bg-transparent">
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            {/* Problem statement - what problem this solves */}
            {problemSolved && (
              <div className="mb-3">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-200 dark:ring-blue-500/40">
                  Problem solved
                </span>
                <h2 className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {problemSolved}
                </h2>
              </div>
            )}
            
            <h1 className="font-display text-5xl font-extrabold text-slate-900 sm:text-6xl dark:text-white">
              {heroTitle || title}
            </h1>
            
            {/* Clear benefit statement */}
            {benefitStatement && (
              <p className="mt-4 text-xl font-semibold text-blue-600 dark:text-blue-400">
                {benefitStatement}
              </p>
            )}
            
            <p className="mt-3 text-xl text-slate-600 dark:text-slate-300">
              {description}
            </p>
            
            <div className="mt-6 flex flex-col sm:flex-row gap-6 mb-16">
              <Button href="#free-chapters" color="blue" className="text-lg py-4 px-8 font-bold">
                Get sample chapter
              </Button>
              <Button href="#pricing" variant="solid" color="slate" className="text-lg py-4 px-8 font-bold">
                Buy now
              </Button>
            </div>
          </div>
        </div>
        
        {/* Background styling for desktop only */}
        <div className="relative px-4 sm:px-6 lg:col-span-7 lg:pr-0 lg:pb-6 lg:pl-16 xl:pl-20 order-3 lg:order-3">
          <div className="hidden lg:absolute lg:-top-20 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block lg:bg-slate-100 lg:dark:bg-slate-900" />
          {/* Testimonial removed to keep CTA buttons above the fold */}
        </div>
        
        {/* Ebook cover - appears second on mobile/tablet, first (left side) on desktop */}
        <div className="relative flex items-center justify-center mt-6 mb-8 order-2 lg:order-1 lg:col-span-5 lg:row-span-2 lg:mb-0 lg:items-start lg:pt-14">
          <div className="absolute -top-20 -bottom-12 left-0 right-1/2 z-10 rounded-br-6xl bg-blue-600 text-white/10 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40">
            <GridPattern
              x="100%"
              y="100%"
              patternTransform="translate(112 64)"
            />
          </div>
          <div className="relative z-10 mx-auto flex w-full max-w-xs rounded-xl shadow-xl md:max-w-sm lg:w-auto">
            <BookCover title={title} description={description} coverImage={image} />
          </div>
        </div>
      </div>
    </header>
  )
}