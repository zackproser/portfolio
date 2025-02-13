import React from 'react';
import { Container } from './Container';
import Image from 'next/image';
import Link from 'next/link';
import { Blog } from '@/lib/shared-types';
import clsx from 'clsx';
import { GridPattern } from './GridPattern';

function DynamicCover({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="aspect-[800/1000] w-full relative">
      {/* 3D Book Cover */}
      <svg className="w-full h-full" viewBox="0 0 400 500" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Book spine shadow */}
        <path
          d="M50 50 L350 25 L350 475 L50 450 Z"
          fill="#1E40AF"
          className="drop-shadow-xl"
        />
        {/* Book cover */}
        <path
          d="M50 50 L350 25 L350 475 L50 450 Z"
          fill="url(#gradient-blue)"
          className="filter drop-shadow-lg"
        />
        {/* Book spine */}
        <path
          d="M25 75 L50 50 L50 450 L25 425 Z"
          fill="#1E3A8A"
        />
        {/* Book top */}
        <path
          d="M25 75 L50 50 L350 25 L325 50 Z"
          fill="#2563EB"
        />
        
        {/* Gradients */}
        <defs>
          <linearGradient id="gradient-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeOpacity="0.1" />
          </pattern>
        </defs>

        {/* Content overlay */}
        <foreignObject x="75" y="75" width="250" height="350">
          <div className="h-full flex flex-col p-6 text-white">
            <h2 className="text-2xl font-bold mb-4 line-clamp-3">
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg opacity-80 line-clamp-2">
                {subtitle}
              </p>
            )}
            <div className="mt-auto flex justify-between items-end">
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-white/40" />
                ))}
              </div>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

function StarRating() {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-5 w-5 fill-current text-blue-600" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Testimonial({ quote, author, role }: { quote: string; author: string; role?: string }) {
  return (
    <figure className="relative mx-auto max-w-md text-center lg:mx-0 lg:text-left">
      <div className="flex justify-center text-blue-600 lg:justify-start">
        <StarRating />
      </div>
      <blockquote className="mt-2">
        <p className="font-display text-xl font-medium text-slate-900">
          "{quote}"
        </p>
      </blockquote>
      <figcaption className="mt-2 text-sm text-slate-500">
        <strong className="font-semibold text-blue-600 before:content-['—_']">
          {author}
        </strong>
        {role && `, ${role}`}
      </figcaption>
    </figure>
  );
}

function CheckIcon() {
  return (
    <svg className="h-6 w-6 flex-none" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z" />
      <circle cx="12" cy="12" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-4 rounded-lg bg-blue-50 opacity-0 transition-all duration-300 group-hover:opacity-100" />
      <div className="relative flex items-center gap-6">
        <div className="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-white shadow-sm shadow-blue-800/5 ring-1 ring-blue-900/5 group-hover:bg-blue-50 group-hover:ring-blue-900/10">
          <CheckIcon />
        </div>
        <div>
          <h3 className="text-lg font-semibold leading-7 tracking-tight text-slate-900">
            {title}
          </h3>
          <p className="mt-2 text-base leading-7 text-slate-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

interface Props {
  content: Blog;
}

export function ProductLanding({ content }: Props) {
  if (!content) {
    return null;
  }

  // Get landing page content with defaults if needed
  const defaultFeatures = content.type === 'course' ? [
    {
      title: 'Step-by-Step Tutorial',
      description: 'Learn how to build a production-ready RAG pipeline from scratch'
    },
    {
      title: 'Jupyter Notebook Included',
      description: 'Get a ready-to-use notebook for data processing and pipeline setup'
    },
    {
      title: 'Complete Example Site',
      description: 'Access a full Next.js example site showing the pipeline in action'
    }
  ] : [
    {
      title: 'Complete Access',
      description: 'Get full access to this in-depth content with all code examples'
    },
    {
      title: 'Source Code Included',
      description: 'Access all accompanying source code and examples'
    },
    {
      title: 'Future Updates',
      description: 'Receive all future updates and improvements'
    }
  ];

  const landing = {
    subtitle: content.description,
    features: defaultFeatures,
    ...content.landing
  };

  return (
    <div className="relative min-h-screen">
      {/* Blue sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-[240px] bg-blue-600" />
      
      {/* Main content */}
      <div className="relative ml-[240px]">
        {/* Hero section */}
        <header className="relative overflow-hidden bg-slate-100 lg:bg-transparent lg:px-5">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-white via-slate-100/70 to-white" />
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pt-20 lg:pb-36 xl:py-32">
            <div className="relative flex items-end lg:col-span-5 lg:row-span-2">
              <div className="absolute -top-20 -bottom-12 left-0 right-1/2 z-10 rounded-br-6xl bg-blue-600 text-white/10 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40">
                <GridPattern
                  x="100%"
                  y="100%"
                  patternTransform="translate(112 64)"
                  className="fill-white/10 stroke-white/10"
                />
              </div>
              <div className="relative z-10 mx-auto flex w-64 rounded-xl bg-slate-600 shadow-xl md:w-80 lg:w-auto">
                {content.image ? (
                  <Image
                    src={content.image}
                    alt={content.title}
                    className="w-full"
                    width={800}
                    height={1000}
                    priority
                  />
                ) : (
                  <DynamicCover 
                    title={content.title}
                    subtitle={landing.subtitle}
                  />
                )}
              </div>
            </div>
            <div className="relative px-4 sm:px-6 lg:col-span-7 lg:pr-0 lg:pb-14 lg:pl-16 xl:pl-20">
              <div className="hidden lg:absolute lg:-top-32 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block lg:bg-slate-100" />
              {landing.testimonials?.[0] && (
                <Testimonial
                  quote={landing.testimonials[0].content}
                  author={landing.testimonials[0].author.name}
                  role={landing.testimonials[0].author.role}
                />
              )}
            </div>
            <div className="bg-white pt-16 lg:col-span-7 lg:bg-transparent lg:pt-0 lg:pl-16 xl:pl-20">
              <div className="relative mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
                <div className="absolute -top-20 -left-20 -right-20 h-[800px] rounded-[2rem] bg-gradient-to-tr from-blue-50 via-white to-blue-50/70 opacity-40 blur-3xl sm:opacity-20 lg:opacity-10" />
                <div className="relative">
                  <h1 className="font-display text-5xl font-extrabold tracking-tight text-slate-900 [text-wrap:balance] sm:text-6xl">
                    {content.title}
                  </h1>
                  <p className="mt-6 text-2xl text-slate-600">
                    {landing.subtitle}
                  </p>
                  <div className="mt-8 flex gap-4">
                    <Link
                      href={`/${content.type}/${content.slug}`}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-sm shadow-blue-900/5 ring-1 ring-blue-900/5 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-900/10 hover:ring-blue-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:bg-blue-700 active:text-white/80 active:shadow-sm active:ring-blue-900/5 transition-all duration-200"
                    >
                      Get sample chapter
                    </Link>
                    <Link
                      href={`/checkout?product=${content.slug}&type=${content.type}`}
                      className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-8 py-4 text-base font-semibold text-slate-900 shadow-sm shadow-slate-900/5 ring-1 ring-slate-900/5 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-900/5 hover:ring-blue-900/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600 active:bg-blue-100 active:text-slate-900/60 active:shadow-sm active:ring-slate-900/5 transition-all duration-200"
                    >
                      Buy now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Testimonials section */}
        {landing.testimonials && landing.testimonials.length > 1 && (
          <section className="bg-slate-50 py-8 sm:py-10 lg:py-16">
            <Container>
              <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-blue-600">Testimonials</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                  Some kind words from early customers...
                </p>
                <p className="mt-4 text-lg tracking-tight text-slate-600">
                  See what others are saying about {content.title}
                </p>
              </div>
              <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
                {landing.testimonials.slice(1).map((testimonial, index) => (
                  <figure 
                    key={index} 
                    className="relative rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-900/5 transition-all duration-300 hover:shadow-xl"
                  >
                    <div className="absolute inset-x-4 -top-px h-px bg-gradient-to-r from-blue-500/0 via-blue-500/40 to-blue-500/0" />
                    <blockquote className="relative">
                      <p className="text-lg tracking-tight text-slate-900">
                        {testimonial.content}
                      </p>
                    </blockquote>
                    <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                      <div>
                        <div className="font-display text-base text-slate-900">
                          {testimonial.author.name}
                        </div>
                        {testimonial.author.role && (
                          <div className="mt-1 text-sm text-slate-500">
                            {testimonial.author.role}
                          </div>
                        )}
                      </div>
                      {testimonial.author.avatar && (
                        <div className="overflow-hidden rounded-full bg-slate-50">
                          <Image
                            src={testimonial.author.avatar}
                            alt={testimonial.author.name}
                            className="h-14 w-14 object-cover"
                            width={56}
                            height={56}
                          />
                        </div>
                      )}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Features section */}
        {landing.features && landing.features.length > 0 && (
          <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32">
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Everything included</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to master {content.title}
              </p>
              <p className="mt-6 text-lg text-slate-600">
                Get access to comprehensive materials and resources designed to help you succeed.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                {landing.features.map((feature) => (
                  <Feature
                    key={feature.title}
                    title={feature.title}
                    description={feature.description}
                  />
                ))}
              </dl>
            </div>
          </section>
        )}

        {/* Table of Contents */}
        <section className="scroll-mt-14 py-16 sm:scroll-mt-32 sm:py-20 lg:py-32">
          <Container>
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Table of contents</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Get a look at all of the content covered
              </p>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                Everything you need to know is inside. No unnecessary filler.
              </p>
            </div>
            <ol role="list" className="mt-16 space-y-10 sm:space-y-16">
              <li>
                <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                  Phase 1: Getting Started
                </h3>
                <ol role="list" className="mt-8 divide-y divide-slate-300/30 rounded-2xl bg-slate-50 px-6 py-3 text-base tracking-tight sm:px-8 sm:py-7">
                  <li className="flex justify-between py-3">
                    <span className="font-medium text-slate-900">Introduction and setup</span>
                    <span className="font-mono text-slate-400">1</span>
                  </li>
                  <li className="flex justify-between py-3">
                    <span className="font-medium text-slate-900">Core concepts</span>
                    <span className="font-mono text-slate-400">2</span>
                  </li>
                  <li className="flex justify-between py-3">
                    <span className="font-medium text-slate-900">Basic implementation</span>
                    <span className="font-mono text-slate-400">3</span>
                  </li>
                </ol>
              </li>
              <li>
                <h3 className="font-display text-3xl font-bold tracking-tight text-slate-900">
                  Phase 2: Advanced Topics
                </h3>
                <ol role="list" className="mt-8 divide-y divide-slate-300/30 rounded-2xl bg-slate-50 px-6 py-3 text-base tracking-tight sm:px-8 sm:py-7">
                  <li className="flex justify-between py-3">
                    <span className="font-medium text-slate-900">Advanced features</span>
                    <span className="font-mono text-slate-400">4</span>
                  </li>
                  <li className="flex justify-between py-3">
                    <span className="font-medium text-slate-900">Best practices</span>
                    <span className="font-mono text-slate-400">5</span>
                  </li>
                  <li className="flex justify-between py-3">
                    <span className="font-medium text-slate-900">Production deployment</span>
                    <span className="font-mono text-slate-400">6</span>
                  </li>
                </ol>
              </li>
            </ol>
          </Container>
        </section>

        {/* Resources section */}
        <section className="scroll-mt-14 py-16 sm:scroll-mt-32 sm:py-20 lg:py-32">
          <Container>
            <div className="mx-auto max-w-2xl lg:text-center">
              <h2 className="text-base font-semibold leading-7 text-blue-600">Resources</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to succeed
              </p>
              <p className="mt-4 text-lg tracking-tight text-slate-700">
                Get access to all the resources you need, including code examples,
                documentation, and more.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(#2C313D_35%,#000)]">
                    <svg className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-8 text-lg font-medium tracking-tight text-slate-900">
                  Complete Documentation
                </h3>
                <p className="mt-2 text-base text-slate-600">
                  Step-by-step guide with detailed explanations
                </p>
              </div>
              <div className="flex flex-col">
                <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center bg-[#6366F1]">
                    <svg className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-8 text-lg font-medium tracking-tight text-slate-900">
                  Source Code
                </h3>
                <p className="mt-2 text-base text-slate-600">
                  Complete source code with examples
                </p>
              </div>
              <div className="flex flex-col">
                <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center bg-[#2563eb]">
                    <svg className="h-24 w-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </div>
                </div>
                <h3 className="mt-8 text-lg font-medium tracking-tight text-slate-900">
                  Updates
                </h3>
                <p className="mt-2 text-base text-slate-600">
                  Regular updates and improvements
                </p>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </div>
  );
} 