import { Container } from '@/components/Container'
import { GridPattern } from '@/components/GridPattern'
import { StarRating } from '@/components/StarRating'
import Image from 'next/image'
import { getConversionTestimonials, Testimonial } from '@/data/testimonials'

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="relative flex flex-col rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 dark:bg-slate-800">
      <blockquote className="text-lg font-medium leading-relaxed text-slate-900 dark:text-white">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-x-4 border-t border-slate-100 pt-4 dark:border-slate-700/50">
        {testimonial.author.imageUrl && (
          <Image 
            className="h-14 w-14 rounded-full object-cover"
            src={testimonial.author.imageUrl}
            alt={testimonial.author.name}
            width={56}
            height={56}
          />
        )}
        <div>
          <div className="font-semibold text-slate-900 dark:text-white">{testimonial.author.name}</div>
          <div className="text-sm text-slate-600 dark:text-slate-400">{testimonial.author.role}</div>
        </div>
      </figcaption>
    </figure>
  )
}

export function RealTestimonials({ 
  testimonials,
  count = 3,
  title = "What developers say about my work",
  subtitle = "Read what others have experienced working with me",
}: { 
  testimonials?: Testimonial[]
  count?: number
  title?: string
  subtitle?: string
}) {
  // If testimonials aren't provided, get recommended conversion testimonials
  const displayTestimonials = testimonials || getConversionTestimonials(count);
  
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50 dark:bg-slate-900/50 relative">
      <div className="absolute inset-0 -z-10">
        <GridPattern 
          x="50%" 
          y="50%"
          className="absolute inset-0 h-full w-full fill-slate-100 stroke-slate-200/20 dark:fill-slate-800/20 dark:stroke-slate-700/20"
          patternTransform="translate(0 48)"
        />
      </div>
      
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl tracking-tight text-slate-900 sm:text-4xl dark:text-white">
            {title}
          </h2>
          <p className="mt-4 text-lg tracking-tight text-slate-700 dark:text-slate-300">
            {subtitle}
          </p>
        </div>
        
        <div className="mx-auto mt-12 grid max-w-7xl gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {displayTestimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </Container>
    </section>
  )
}