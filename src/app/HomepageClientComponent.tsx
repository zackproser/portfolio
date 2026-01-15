'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useState, Suspense } from "react"
import { usePathname } from "next/navigation"
import { track } from "@vercel/analytics"
import { ContentCard } from "@/components/ContentCard"
import dynamic from 'next/dynamic'
import Image from 'next/image'
import ConsultationForm from "@/components/ConsultationForm"
import { sendGTMEvent } from '@next/third-parties/google'
import YoutubeEmbed from "@/components/YoutubeEmbed"
import AuthorityHero from "@/components/AuthorityHero"
import EngagementGrid from "@/components/EngagementGrid"

// Import demo hero images
const embeddingsDemoHero = 'https://zackproser.b-cdn.net/images/embeddings-demo-hero.webp'
const tokenizationDemoHero = 'https://zackproser.b-cdn.net/images/tokenization-demo-hero.webp'
const chatbotDemoHero = 'https://zackproser.b-cdn.net/images/chatbot-demo-hero.webp'

// Add type definitions for the props
interface Article {
  slug: string;
  // Add other properties of the article object as needed
}

interface HomepageClientComponentProps {
  deepMLTutorials: Article[]; 
  mlProjects: Article[];
  aiDev: Article[];
  refArchitectures: Article[];
  careerAdvice: Article[];
  videos: Article[];  
  isMobile: boolean;
}

export default function HomepageClientComponent({ 
  deepMLTutorials,
  mlProjects, 
  aiDev, 
  refArchitectures,
  careerAdvice,
  videos,
  isMobile: serverIsMobile
}: HomepageClientComponentProps) {
  const [email, setEmail] = useState("")
  const [formSuccess, setFormSuccess] = useState(false)
  const referrer = usePathname()
  const [isMobile] = useState(serverIsMobile)
  const [isConsultationOpen, setIsConsultationOpen] = useState(false)

  const sendFormSubmissionEvent = () => {
            sendGTMEvent({
          event: "newsletter-signup-conversion",
      method: "newsletter"
    });

    track("newsletter-signup", {
      method: "newsletter",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      email,
      referrer,
    }

    try {
      await fetch("/api/form", {
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      })
      sendFormSubmissionEvent()
      setFormSuccess(true)
      setEmail("")
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-parchment-100 dark:bg-charcoal-400 theme-transition">
      <main className="flex-1">
        {/* New Authority Hero */}
        <AuthorityHero onNewsletterSubmit={async (email) => {
          const data = { email, referrer }
          try {
            await fetch("/api/form", {
              body: JSON.stringify(data),
              headers: { "Content-Type": "application/json" },
              method: "POST",
            })
            sendFormSubmissionEvent()
          } catch (error) {
            console.error(error)
          }
        }} />

        {/* How I Engage Grid - replaces the blueprint */}
        <EngagementGrid />
        
        {/* DevSecCon 2025 Keynote Promotion */}
        <section className="w-full py-10 md:py-14 lg:py-20 bg-parchment-50 dark:bg-charcoal-300 border-t border-parchment-300 dark:border-charcoal-100/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-6">
                <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-burnt-400/10 dark:bg-amber-400/10 text-burnt-500 dark:text-amber-400 text-xs font-semibold border border-burnt-400/20 dark:border-amber-400/20 mb-3">
                  <span className="mr-2">&#127908;</span> Keynote &mdash; DevSecCon 2025
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-charcoal-50 dark:text-parchment-100">
                  Untethered Software Development
                </h2>
                <p className="mt-3 text-parchment-600 dark:text-parchment-400">
                  I was the keynote speaker at DevSecCon 2025. This 32-minute film shows how to orchestrate voice, background agents, and a hardened CI/CD lane so you can think where you think best&mdash;while agents safely ship production-grade code.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/blog/untethered-software-development-devseccon-2025"
                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium rounded-md text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors"
                    onClick={() => {
                      track("devseccon_keynote_cta_click", { destination: "blog_post" })
                    }}
                  >
                    Read the summary &rarr;
                  </Link>
                  <Link
                    href="https://www.youtube.com/watch?v=kwIzRkzO_Z4"
                    className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium rounded-md text-burnt-400 dark:text-amber-400 bg-burnt-400/10 dark:bg-amber-400/10 hover:bg-burnt-400/20 dark:hover:bg-amber-400/20 border border-burnt-400/30 dark:border-amber-400/30"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      track("devseccon_keynote_cta_click", { destination: "youtube" })
                    }}
                  >
                    Watch on YouTube &#8599;
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="rounded-xl overflow-hidden ring-1 ring-parchment-400 dark:ring-charcoal-100/20 shadow-lg">
                  <YoutubeEmbed urls="https://www.youtube.com/watch?v=kwIzRkzO_Z4" title="DevSecCon 2025 Keynote by Zachary Proser" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Featured Project Title Section */}
        <section className="py-8 bg-parchment-100 dark:bg-charcoal-400 border-t border-parchment-300 dark:border-charcoal-100/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <div className="inline-block bg-burnt-400 dark:bg-amber-400/90 px-6 py-2 border border-burnt-500/20 dark:border-amber-500/20 rounded-lg shadow-lg">
                <h2 className="font-serif text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl text-white dark:text-charcoal-500">
                  Featured Premium Project
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Product Content */}
        <section className="overflow-hidden bg-parchment-100 dark:bg-charcoal-400 border-t border-parchment-300 dark:border-charcoal-100/20 px-5 isolate">
          <div className="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pt-20 lg:pb-36 xl:py-32">
            <div className="relative flex items-end lg:col-span-6 lg:row-span-2">
              <div className="relative z-10 mx-auto flex w-[90%] max-w-xl rounded-xl shadow-xl md:w-auto lg:w-auto">
                <Link 
                  href="/chat"
                  className="block w-full group"
                  onClick={() => {
                    track("featured_product_click", {
                      location: "featured_banner",
                      product: "rag_tutorial",
                      action: "demo"
                    })
                  }}
                >
                <div className="relative aspect-[3.5/3] sm:aspect-[4/3] w-full max-w-[650px] rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 p-6 sm:p-8 shadow-2xl border-t-8 border-blue-500/20 transition-transform duration-200 group-hover:scale-[1.01]">
                  {/* Badge and price in separate container with flexbox */}
                  <div className="w-full flex flex-col gap-2 sm:block">
                    <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/20 text-blue-200 text-xs sm:text-sm font-medium">
                      <span className="mr-1">💎</span> Premium Project
                    </div>
                    
                    <div className="hidden sm:block sm:absolute sm:top-8 sm:right-8">
                      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full">
                        <span className="text-xl sm:text-2xl font-bold text-white">$149</span>
                      </div>
                    </div>
                    
                    <div className="sm:hidden absolute top-5 right-5">
                      <div className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-400 rounded-full">
                        <span className="text-xl font-bold text-white">$149</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Title and subtitle */}
                  <div className="mt-5 sm:mt-6">
                    <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
                      Build a Chatbot That <span className="italic">Actually Knows Your Shit</span>
                    </h2>
                    <p className="mt-3 sm:mt-6 text-base sm:text-lg text-zinc-100 leading-relaxed">
                     Learn to create a chatbot that answers questions about your content.
                    </p>
                  </div>

                  {/* Feature list */}
                  <div className="mt-4 sm:mt-8 grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base text-zinc-100"><strong>No hallucinations</strong> – Answers grounded in your docs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base text-zinc-100"><strong>State of the art tech</strong> – Vercel AI SDK, embeddings, vector retrieval</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base text-zinc-100"><strong>Battle-tested</strong> – I&apos;ve built production RAG pipelines for years</span>
                    </div>
                  </div>
                </div>
                </Link>
              </div>
            </div>
            <div className="relative px-4 sm:px-6 lg:col-span-6 lg:pr-0 lg:pb-14 lg:pl-16 xl:pl-20">
              <div className="hidden lg:absolute lg:-top-32 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block lg:bg-parchment-200 dark:bg-charcoal-300" />
              <div className="relative">
                <div className="flex justify-start">
                  <div className="flex items-center text-burnt-400 dark:text-amber-400">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  <span className="ml-2 text-sm text-parchment-600 dark:text-parchment-400">5.0 rating</span>
                  </div>
                </div>
                <blockquote className="mt-8">
                  <p className="font-serif text-xl font-medium text-charcoal-50 dark:text-parchment-100">
                    &ldquo;Thanks for publishing the tutorial, very helpful.&rdquo;
                  </p>
                </blockquote>
                <p className="mt-4 text-base text-parchment-600 dark:text-parchment-400">
                  <strong className="font-semibold text-burnt-400 dark:text-amber-400">Scott McCallum</strong> &bull; Full Stack Developer at Intermine
                </p>
              </div>
            </div>
            <div className="bg-parchment-50 dark:bg-charcoal-300 pt-16 lg:col-span-6 lg:pt-0 lg:pl-16 xl:pl-20 rounded-xl">
              <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/checkout?product=rag-pipeline-tutorial&type=blog"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => {
                      track("featured_product_click", {
                        location: "hero_section",
                        product: "rag_tutorial",
                        action: "buy"
                      })
                    }}
                  >
                    Get the $149 Tutorial →
                  </Link>
                  <Link 
                    href="/chat"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-500 hover:bg-blue-400 transition-colors"
                    onClick={() => {
                      track("featured_product_click", {
                        location: "hero_section",
                        product: "rag_tutorial",
                        action: "demo"
                      })
                    }}
                  >
                    Try the live demo →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Demos Section */}
        <section className="w-full py-12 md:py-16 lg:py-20 bg-parchment-200 dark:bg-charcoal-500">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-charcoal-50 dark:text-parchment-100 mb-4">
                Interactive AI Laboratory
              </h2>
              <p className="text-lg text-parchment-600 dark:text-parchment-400 max-w-3xl mx-auto">
                Learn by doing! Explore how AI systems work under the hood through hands-on interactive experiences.
              </p>
            </div>

            <div className="relative">
               <div className="mx-auto mt-8 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                 <ContentCard 
                   key="chatbot-demo"
                   article={{
                     slug: '/chat',
                     title: 'How do you give an AI system your specific knowledge?',
                     description: 'Try a live AI chatbot powered by RAG (Retrieval Augmented Generation) that knows my content. See how AI systems can be grounded with specific data to avoid hallucinations.',
                     author: 'Zachary Proser',
                     date: '2024-01-01',
                     type: 'demo',
                     image: chatbotDemoHero
                   }} 
                 />
                 <ContentCard 
                   key="embeddings-demo"
                   article={{
                     slug: '/demos/embeddings',
                     title: 'How do LLMs understand meaning in text?',
                     description: 'Visualize how text transforms into vectors that capture semantic meaning. See why similar concepts cluster together and understand the foundation of RAG systems.',
                     author: 'Zachary Proser',
                     date: '2024-01-01',
                     type: 'demo',
                     image: embeddingsDemoHero
                   }} 
                 />
                 <ContentCard 
                   key="tokenization-demo"
                   article={{
                     slug: '/demos/tokenize',
                     title: 'Why do LLMs have context limits and token costs?',
                     description: 'See how language models break text into tokens. Understand why context windows exist, how pricing works, and optimize your prompts for better performance.',
                     author: 'Zachary Proser',
                     date: '2024-01-01',
                     type: 'demo',
                     image: tokenizationDemoHero
                   }} 
                 />
               </div>

              <div className="text-center mt-8">
                <Link
                  href="/demos"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 text-white dark:text-charcoal-500 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                  onClick={() => {
                    track("main_cta_click", {
                      destination: "all_demos"
                    })
                  }}
                >
                  View All Interactive Demos &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Content Collections Section Header */}
        <section className="py-12 bg-parchment-100 dark:bg-charcoal-400 border-t border-parchment-300 dark:border-charcoal-100/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-10">
              <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-4xl text-charcoal-50 dark:text-parchment-100 mb-4">
                Knowledge Collections
              </h2>
              <p className="text-lg text-parchment-600 dark:text-parchment-400 max-w-3xl mx-auto">
                Explore my comprehensive library of AI engineering resources and implementation guides.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 justify-center mt-8">
              <Link
                href="/projects"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-white bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-400 dark:hover:bg-amber-500 dark:text-charcoal-500 transition-colors shadow-md"
                onClick={() => {
                  track("main_cta_click", {
                    destination: "projects"
                  })
                }}
              >
                All Projects &rarr;
              </Link>
              <Link
                href="/publications"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-burnt-400 dark:text-amber-400 bg-burnt-400/10 dark:bg-amber-400/10 hover:bg-burnt-400/20 dark:hover:bg-amber-400/20 border border-burnt-400/30 dark:border-amber-400/30 transition-colors shadow-md"
                onClick={() => {
                  track("main_cta_click", {
                    destination: "publications"
                  })
                }}
              >
                All Publications &rarr;
              </Link>
              <Link
                href="/testimonials"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg text-burnt-400 dark:text-amber-400 bg-burnt-400/10 dark:bg-amber-400/10 hover:bg-burnt-400/20 dark:hover:bg-amber-400/20 border border-burnt-400/30 dark:border-amber-400/30 transition-colors shadow-md"
                onClick={() => {
                  track("main_cta_click", {
                    destination: "testimonials"
                  })
                }}
              >
                Client Success Stories &rarr;
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-parchment-50 dark:bg-charcoal-300 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center text-charcoal-50 dark:text-parchment-100">
              Deep and Machine Learning Tutorials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deepMLTutorials.slice(0, 3).map((article, index) => (
                <ContentCard key={`ml-tutorial-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-parchment-200 dark:bg-charcoal-500 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center text-charcoal-50 dark:text-parchment-100">
              Open-source AI / ML / Pipelines Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mlProjects.slice(0, 3).map((article, index) => (
                <ContentCard key={`ml-project-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-parchment-50 dark:bg-charcoal-300 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center text-charcoal-50 dark:text-parchment-100">
              AI-assisted Development
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiDev.slice(0, 3).map((article, index) => (
                <ContentCard key={`ai-dev-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-parchment-200 dark:bg-charcoal-500 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center text-charcoal-50 dark:text-parchment-100">
              Career Advice
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerAdvice.slice(0, 3).map((article, index) => (
                <ContentCard key={`career-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-parchment-50 dark:bg-charcoal-300 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center text-charcoal-50 dark:text-parchment-100">
              Videos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.slice(0, 3).map((article, index) => (
                <ContentCard key={`video-${index}`} article={article} />
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/videos"
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-lg text-burnt-400 dark:text-amber-400 bg-burnt-400/10 dark:bg-amber-400/10 hover:bg-burnt-400/20 dark:hover:bg-amber-400/20 border border-burnt-400/30 dark:border-amber-400/30 transition-colors"
                onClick={() => {
                  track("see_all_click", {
                    contentType: "videos"
                  })
                }}
              >
                See all videos &rarr;
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-parchment-200 dark:bg-charcoal-500 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-6 flex items-center text-charcoal-50 dark:text-parchment-100">
              Reference Architectures and Demos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {refArchitectures.slice(0, 3).map((article, index) => (
                <ContentCard key={`ref-arch-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <footer className="w-full py-6 bg-charcoal-400 dark:bg-charcoal-600 text-parchment-100">
      </footer>
      <ConsultationForm 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </div>
  )
}