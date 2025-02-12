import React from 'react';
import { Container } from './Container';
import { ProductContent } from '@/lib/types/product';
import Image from 'next/image';
import Link from 'next/link';

function ChevronRightIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path d="M6.75 5.75 9.25 8l-2.5 2.25" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProductLanding({ product }: { product: ProductContent }) {
  return (
    <div className="relative isolate overflow-hidden bg-white dark:bg-zinc-900">
      <Container className="pb-16 pt-20 text-center lg:pt-32">
        {/* Hero section */}
        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-7xl">
          {product.title}
        </h1>
        {product.subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {product.subtitle}
          </p>
        )}
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href={product.callToAction.href}
            className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {product.callToAction.text}
          </Link>
        </div>

        {/* Feature section */}
        {product.features.length > 0 && (
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                What&apos;s included
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {product.features.map((feature) => (
                  <div key={feature.title} className="flex flex-col">
                    <dt className="text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
                      {feature.title}
                    </dt>
                    <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-zinc-600 dark:text-zinc-400">
                      <p className="flex-auto">{feature.description}</p>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        )}

        {/* Chapters section */}
        {product.chapters && (
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Course content</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                What you&apos;ll learn
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              {product.chapters.map((chapter, chapterIdx) => (
                <div key={chapter.title} className="mt-10 first:mt-0">
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">{chapter.title}</h3>
                  <dl className="mt-4 space-y-4">
                    {chapter.items.map((item, itemIdx) => (
                      <div key={itemIdx} className="relative pl-9">
                        <dt className="inline font-semibold text-zinc-900 dark:text-zinc-100">
                          <ChevronRightIcon className="absolute left-1 top-1 h-5 w-5 text-blue-600" aria-hidden="true" />
                          {item.title}
                        </dt>
                        <dd className="inline text-zinc-600 dark:text-zinc-400"> — {item.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing section */}
        <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
              Simple, transparent pricing
            </h2>
          </div>
          <div className="mx-auto mt-16 max-w-2xl rounded-3xl ring-1 ring-zinc-200 dark:ring-zinc-700 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
            <div className="p-8 sm:p-10 lg:flex-auto">
              <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Course access
              </h3>
              <div className="mt-10 flex items-center gap-x-4">
                <h4 className="flex-none text-sm font-semibold leading-6 text-blue-600">What&apos;s included</h4>
                <div className="h-px flex-auto bg-zinc-100 dark:bg-zinc-700" />
              </div>
              <ul role="list" className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:grid-cols-2 sm:gap-6">
                {product.pricing.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg className="h-6 w-5 flex-none text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="-mt-2 p-2 lg:mt-0 lg:w-full lg:max-w-md lg:flex-shrink-0">
              <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 py-10 text-center ring-1 ring-inset ring-zinc-900/5 dark:ring-zinc-700 lg:flex lg:flex-col lg:justify-center lg:py-16">
                <div className="mx-auto max-w-xs px-8">
                  <p className="text-base font-semibold text-zinc-600 dark:text-zinc-400">Pay once, own it forever</p>
                  <p className="mt-6 flex items-baseline justify-center gap-x-2">
                    <span className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{product.pricing.currency}{product.pricing.price}</span>
                    {product.pricing.interval && (
                      <span className="text-sm font-semibold leading-6 tracking-wide text-zinc-600 dark:text-zinc-400">
                        {product.pricing.interval}
                      </span>
                    )}
                  </p>
                  <Link
                    href={product.callToAction.href}
                    className="mt-10 block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                  >
                    {product.callToAction.text}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials section */}
        {product.testimonials && product.testimonials.length > 0 && (
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Testimonials</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                What others are saying
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-sm leading-6 text-zinc-600 dark:text-zinc-400 sm:mt-20 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {product.testimonials.map((testimonial, testimonialIdx) => (
                <figure key={testimonialIdx} className="rounded-2xl bg-white dark:bg-zinc-800/50 p-6 shadow-lg ring-1 ring-zinc-900/5 dark:ring-zinc-700">
                  <blockquote className="text-zinc-900 dark:text-zinc-100">
                    <p>{`"${testimonial.content}"`}</p>
                  </blockquote>
                  <figcaption className="mt-6 flex items-center gap-x-4">
                    {testimonial.author.avatar && (
                      <Image
                        className="h-10 w-10 rounded-full bg-zinc-50"
                        src={testimonial.author.avatar}
                        alt=""
                        width={40}
                        height={40}
                      />
                    )}
                    <div>
                      <div className="font-semibold text-zinc-900 dark:text-zinc-100">{testimonial.author.name}</div>
                      {testimonial.author.role && (
                        <div className="text-zinc-600 dark:text-zinc-400">{testimonial.author.role}</div>
                      )}
                    </div>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* FAQ section */}
        {product.faqs && product.faqs.length > 0 && (
          <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">FAQ</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl">
                Frequently asked questions
              </p>
            </div>
            <dl className="mx-auto mt-16 max-w-2xl space-y-8 sm:mt-20">
              {product.faqs.map((faq, faqIdx) => (
                <div key={faqIdx}>
                  <dt className="text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-100">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </Container>
    </div>
  );
} 