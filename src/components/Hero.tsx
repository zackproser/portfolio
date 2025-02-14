import { Button } from '@/components/Button'
import { GridPattern } from '@/components/GridPattern'
import { StarRating } from '@/components/StarRating'

function Testimonial() {
  return (
    <figure className="relative mx-auto max-w-md text-center lg:mx-0 lg:text-left">
      <div className="flex justify-center text-blue-600 lg:justify-start">
        <StarRating />
        <span className="ml-2 text-sm text-slate-500">5.0 rating</span>
      </div>
      <blockquote className="mt-2">
        <p className="font-display text-xl font-medium text-slate-900">
          &ldquo;Thanks for publishing the tutorial, very helpful.&rdquo;
        </p>
      </blockquote>
      <figcaption className="mt-2 text-sm text-slate-500">
        <strong className="font-semibold text-blue-600 before:content-['—_']">
          Scott McCallum
        </strong>
        <span className="block text-sm text-slate-500">
          FULLSTACK Developer at Intermine Pty Ltd
        </span>
      </figcaption>
    </figure>
  )
}

function BookCover() {
  return (
    <div className="relative aspect-[3/4] w-full max-w-[500px] rounded-2xl bg-[#1e2943] p-8 shadow-2xl border-t-8 border-blue-500/20">
      {/* Book spine effect */}
      <div className="absolute inset-y-0 left-0 w-8 bg-blue-600/10 transform -translate-x-4 skew-y-12 hidden lg:block" />
      
      {/* Book title and subtitle */}
      <div className="mt-6">
        <h2 className="font-display text-3xl font-semibold text-white leading-tight">
          Build Production-Ready RAG Applications
        </h2>
        <p className="mt-6 text-lg text-slate-300 leading-relaxed">
          A complete guide to building production-ready Retrieval Augmented Generation (RAG) pipelines
        </p>
      </div>

      {/* Author signature */}
      <div className="absolute bottom-20 left-8 hidden lg:block">
        <p className="font-['Pacifico'] text-3xl text-slate-300 opacity-90">
          Zachary Proser
        </p>
      </div>
      {/* Mobile signature */}
      <div className="mt-8 block lg:hidden">
        <p className="font-['Pacifico'] text-2xl text-slate-300 opacity-90 text-center">
          Zachary Proser
        </p>
      </div>

      {/* Additional decorative elements */}
      <div className="absolute bottom-8 right-8 flex gap-4">
        <div className="h-12 w-12 rounded-full bg-blue-500/20" />
        <div className="h-12 w-24 rounded-lg bg-blue-500/10" />
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <header className="overflow-hidden bg-slate-100 lg:bg-transparent lg:px-5">
      <div className="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pt-20 lg:pb-36 xl:py-32">
        <div className="relative flex items-end lg:col-span-5 lg:row-span-2">
          <div className="absolute -top-20 -bottom-12 left-0 right-1/2 z-10 rounded-br-6xl bg-blue-600 text-white/10 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40">
            <GridPattern
              x="100%"
              y="100%"
              patternTransform="translate(112 64)"
            />
          </div>
          <div className="relative z-10 mx-auto flex w-64 rounded-xl shadow-xl md:w-80 lg:w-auto">
            <BookCover />
          </div>
        </div>
        <div className="relative px-4 sm:px-6 lg:col-span-7 lg:pr-0 lg:pb-14 lg:pl-16 xl:pl-20">
          <div className="hidden lg:absolute lg:-top-32 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block lg:bg-slate-100" />
          <Testimonial />
        </div>
        <div className="bg-white pt-16 lg:col-span-7 lg:bg-transparent lg:pt-0 lg:pl-16 xl:pl-20">
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            <h1 className="font-display text-5xl font-extrabold text-slate-900 sm:text-6xl">
              Build Production-Ready RAG Applications
            </h1>
            <p className="mt-4 text-xl text-slate-600">
              A complete guide to building production-ready Retrieval Augmented Generation (RAG) pipelines
            </p>
            <div className="mt-8 flex gap-4">
              <Button href="#free-chapters" color="blue">
                Get sample chapter
              </Button>
              <Button href="#pricing" variant="solid" color="slate">
                Buy now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 