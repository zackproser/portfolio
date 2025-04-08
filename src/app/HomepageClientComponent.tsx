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
import LearningGrid from "@/components/learning-grid"

// Import company logos
import logoCloudflare from '/public/images/logos/cloudflare.svg'
import logoGruntwork from '/public/images/logos/terragrunt.svg'
import logoPinecone from '@/images/logos/pinecone-logo.webp'

// Dynamically import the NeuralNetworkPulse with no SSR
const NeuralNetworkPulse = dynamic(
  () => import('@/components/NeuralNetworkPulse').then(mod => mod.NeuralNetworkPulse),
  { 
    ssr: false,
    loading: () => (
      <div className="w-[600px] h-[600px] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading visualization...</div>
      </div>
    )
  }
)

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

  const sendFormSubmissionEvent = () => {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-ignore
      window.gtag("event", "sign_up", {
        method: "newsletter",
      })
    }

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
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-gray-900">
      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16 relative overflow-hidden bg-gradient-to-r from-blue-800 to-indigo-900 dark:from-gray-800 dark:to-blue-900">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex-1 space-y-4 max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-gray-50 dark:text-blue-100">
                  Zero Bullshit AI
                </h1>
                <p className="text-lg text-gray-200 md:text-xl">
                  <strong>Hype-free insights from an engineer who shipped production code at Cloudflare, Gruntwork, and Pinecone.</strong>
                </p>
                <div className="mt-6">
                  <p className="text-yellow-400 font-bold text-xl mb-4">🔥 <span className="text-white">Free Tutorial</span>: <span className="text-blue-200">Build a &quot;Chat with My Data&quot; app with LangChain, Pinecone, OpenAI and the Vercel AI SDK.</span></p>
                </div>
                <div className="w-full max-w-sm space-y-2">
                  {formSuccess ? (
                    <p className="text-green-400 font-semibold">Neural Network Activated! 🤖🧠❗ Thank you for joining our AI research community.</p>
                  ) : (
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-email flex-grow text-gray-900 dark:text-gray-100"
                        required
                      />
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
                        Get the Free Tutorial
                      </Button>
                    </form>
                  )}
                  <p className="text-xs text-gray-300">
                    Join 900+ engineers learning to build what actually works.
                  </p>
                  <div className="mt-8">
                    <p className="text-sm text-white uppercase font-medium mb-3">Trusted by industry leaders</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-auto flex items-center justify-center">
                          <Image
                            src={logoCloudflare}
                            alt="Cloudflare"
                            height={20} 
                            width={80}
                            className="brightness-0 invert"
                          />
                        </div>
                        <span className="text-sm font-medium text-white mt-2">Cloudflare</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-auto flex items-center justify-center">
                          <Image
                            src={logoGruntwork}
                            alt="Gruntwork"
                            height={16}
                            width={60}
                            className="brightness-0 invert scale-75"
                          />
                        </div>
                        <span className="text-sm font-medium text-white mt-2">Gruntwork</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="h-8 w-auto flex items-center justify-center">
                          <Image
                            src={logoPinecone}
                            alt="Pinecone"
                            height={20}
                            width={80}
                            className="brightness-0 invert"
                          />
                        </div>
                        <span className="text-sm font-medium text-white mt-2">Pinecone</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {!isMobile && (
                <div className="flex-1 md:w-1/2 flex justify-center">
                  <Suspense fallback={
                    <div className="w-[600px] h-[600px] flex items-center justify-center">
                      <div className="animate-pulse text-gray-400">Loading visualization...</div>
                    </div>
                  }>
                    <NeuralNetworkPulse />
                  </Suspense>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* AI Engineering Blueprint Section */}
        <section className="w-full py-12 md:py-16 lg:py-24 relative overflow-hidden bg-gradient-to-b from-[#1e3a8a] to-[#1e40af]">
          {/* Blueprint overlay pattern - more prominent */}
          <div className="absolute inset-0 bg-blueprint opacity-25 pointer-events-none"></div>
          
          {/* Engineering document appearance */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Corner fold effect */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[#1e3a8a] shadow-lg transform rotate-[-1deg] -translate-x-2 -translate-y-3"></div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#1e40af] to-[#1e3a8a] transform rotate-[-1deg]"></div>
            
            {/* Blueprint document border */}
            <div className="absolute inset-x-4 inset-y-4 border-2 border-white/10 rounded-lg"></div>
            
            {/* Engineering stamp */}
            <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 bg-blue-900/70 backdrop-blur-sm p-3 rounded-full border border-white/10 transform rotate-[-5deg] hidden md:block">
              <div className="font-mono text-xs text-white/40 tracking-tight">CONFIDENTIAL</div>
            </div>
          </div>
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="mb-10 text-center">
              <div className="inline-block bg-[#1e3a8a]/80 px-6 py-2 mb-4 border border-white/20 rounded-sm shadow-lg">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white font-mono uppercase">
                  AI Engineering Blueprint
                </h2>
              </div>
              <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto backdrop-blur-sm bg-[#1e3a8a]/30 p-4 rounded-lg">
                Master the most effective AI and agentic architectures, RAG pipelines, and machine learning concepts to transform your dev team and business. Taught via hands-on projects and production-ready implementations built by an engineer who actually did this work at top tech companies.
              </p>
            </div>
            
            <div className="relative p-8 rounded-lg bg-blue-900/40 border border-blue-400/20 backdrop-blur-md">
              <LearningGrid />
            </div>
          </div>
        </section>

        {/* Premium Featured Project Title Section */}
        <section className="py-8 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center">
              <div className="inline-block bg-blue-600 px-6 py-2 border border-blue-400/20 rounded-sm shadow-lg">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white font-mono uppercase">
                  Featured Premium Project
                </h2>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Product Content */}
        <section className="overflow-hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 lg:bg-transparent lg:px-5">
          <div className="mx-auto grid max-w-6xl grid-cols-1 grid-rows-[auto_1fr] gap-y-16 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-y-20 lg:px-3 lg:pt-20 lg:pb-36 xl:py-32">
            <div className="relative flex items-end lg:col-span-6 lg:row-span-2">
              <div className="absolute -top-20 -bottom-12 left-0 right-1/2 z-10 rounded-br-6xl bg-blue-600 text-white/10 md:bottom-8 lg:-inset-y-32 lg:left-[-100vw] lg:right-full lg:-mr-40">
                <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.1))]" />
              </div>
              <div className="relative z-10 mx-auto flex w-[90%] max-w-xl rounded-xl shadow-xl md:w-auto lg:w-auto">
                <div className="relative aspect-[3.5/3] sm:aspect-[4/3] w-full max-w-[650px] rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 p-6 sm:p-8 shadow-2xl border-t-8 border-blue-500/20">
                  {/* Badge and price in separate container with flexbox */}
                  <div className="w-full flex flex-col gap-2 sm:block">
                    <div className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-blue-500/20 text-blue-200 text-xs sm:text-sm font-medium">
                      Featured Premium Project
                    </div>
                    
                    <div className="hidden sm:block sm:absolute sm:top-8 sm:right-8">
                      <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500/20 rounded-full">
                        <span className="text-xl sm:text-2xl font-bold text-white">$49</span>
                      </div>
                    </div>
                    
                    <div className="sm:hidden absolute top-5 right-5">
                      <div className="px-3 py-1.5 bg-blue-500/20 rounded-full">
                        <span className="text-xl font-bold text-white">$49</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Title and subtitle */}
                  <div className="mt-5 sm:mt-6">
                    <h2 className="font-display text-2xl sm:text-4xl font-bold text-white leading-tight">
                      Build a Chatbot That <span className="italic">Actually Knows Your Shit</span>
                    </h2>
                    <p className="mt-3 sm:mt-6 text-base sm:text-lg text-slate-200 leading-relaxed">
                     Learn to create a chatbot that answers questions about your content.
                    </p>
                  </div>

                  {/* Feature list */}
                  <div className="mt-4 sm:mt-8 grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base text-slate-200"><strong>No hallucinations</strong> – Answers grounded in your docs</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base text-slate-200"><strong>State of the art tech</strong> – Vercel AI SDK, embeddings, vector retrieval</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm sm:text-base text-slate-200"><strong>Battle-tested</strong> – I&apos;ve built production RAG pipelines for years</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative px-4 sm:px-6 lg:col-span-6 lg:pr-0 lg:pb-14 lg:pl-16 xl:pl-20">
              <div className="hidden lg:absolute lg:-top-32 lg:bottom-0 lg:left-[-100vw] lg:right-[-100vw] lg:block lg:bg-slate-100" />
              <div className="relative">
                <div className="flex justify-start">
                  <div className="flex items-center text-blue-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="ml-2 text-sm text-slate-600">5.0 rating</span>
                  </div>
                </div>
                <blockquote className="mt-8">
                  <p className="font-display text-xl font-medium text-slate-900">
                    &ldquo;Thanks for publishing the tutorial, very helpful.&rdquo;
                  </p>
                </blockquote>
                <p className="mt-4 text-base text-slate-600">
                  <strong className="font-semibold text-blue-600">Scott McCallum</strong> • Full Stack Developer at Intermine
                </p>
              </div>
            </div>
            <div className="bg-white pt-16 lg:col-span-6 lg:bg-transparent lg:pt-0 lg:pl-16 xl:pl-20">
              <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/checkout?product=rag-pipeline-tutorial&type=blog"
                    className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      track("featured_product_click", {
                        location: "hero_section",
                        product: "rag_tutorial",
                        action: "buy"
                      })
                    }}
                  >
                    Get the $49 Tutorial →
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

        <section className="bg-white dark:bg-gray-900 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6">Deep and Machine Learning Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deepMLTutorials.slice(0, 3).map((article, index) => (
                <ContentCard key={`ml-tutorial-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6">Open-source AI / ML / Pipelines Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mlProjects.slice(0, 3).map((article, index) => (
                <ContentCard key={`ml-project-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6">AI-assisted Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiDev.slice(0, 3).map((article, index) => (
                <ContentCard key={`ai-dev-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6">Career Advice</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerAdvice.slice(0, 3).map((article, index) => (
                <ContentCard key={`career-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.slice(0, 3).map((article, index) => (
                <ContentCard key={`video-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6">Reference Architectures and Demos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {refArchitectures.slice(0, 3).map((article, index) => (
                <ContentCard key={`ref-arch-${index}`} article={article} />
              ))}
            </div>
          </div>
        </section>

      </main>
      <footer className="w-full py-6 bg-gray-800 text-white">
      </footer>
    </div>
  )
}