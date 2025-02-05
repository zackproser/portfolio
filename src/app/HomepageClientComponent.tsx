'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Brain } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, Suspense } from "react"
import { usePathname } from "next/navigation"
import { track } from "@vercel/analytics"
import { BlogPostCard } from "@/components/BlogPostCard"
import dynamic from 'next/dynamic'
import Image from "next/image"
import ragPipelineElements from '@/images/rag-tutorial-elements.webp'

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
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex-1 space-y-4 max-w-2xl">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl text-white">
                  Supercharge Your Development Workflow 
                </h1>
                <p className="text-lg text-gray-200 md:text-xl">
                  Coding is changing. Don&apos;t get left behind. 
                </p>
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
                        className="flex-grow bg-white text-zinc-900"
                        required
                      />
                      <Button type="submit" className="bg-yellow-400 font-bold text-white hover:bg-yellow-300 transition-colors">
                        Count me in!
                      </Button>
                    </form>
                  )}
                  <p className="text-xs text-gray-300">
                    Get the latest tools, frameworks, and techniques for AI-assisted development, plus projects, tutorials and demos to keep you in the know. 
                  </p>
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

        {/* Featured Product Section */}
        <section className="bg-gradient-to-r from-emerald-500 to-emerald-700 py-16 mb-12">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-white text-emerald-600 rounded-full">
                  Featured Tutorial
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                  Build Your Own RAG Pipeline
                </h2>
                <p className="text-lg text-emerald-50">
                  Learn how to build production-ready RAG applications with this comprehensive guide. 
                  Master vector databases, embeddings, and advanced prompt engineering techniques.
                </p>
                <div className="mt-4 space-y-2">
                  <p className="text-white font-semibold">What you get:</p>
                  <ul className="list-none space-y-2 text-emerald-50">
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Data processing Jupyter Notebook
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Complete Next.js example site using latest Vercel AI SDK and OpenAI
                    </li>
                    <li className="flex items-center">
                      <span className="mr-2">•</span>
                      Step by step tutorial explaining how everything fits together
                    </li>
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/blog/rag-pipeline-tutorial"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50 md:py-4 md:text-lg md:px-8 transition-colors"
                    onClick={() => {
                      track("featured_product_click", {
                        location: "hero_section",
                        product: "rag_tutorial"
                      })
                    }}
                  >
                    Read Tutorial
                  </Link>
                  <Link 
                    href="/checkout?product=blog-rag-pipeline-tutorial"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-800 hover:bg-emerald-900 md:py-4 md:text-lg md:px-8 transition-colors"
                    onClick={() => {
                      track("featured_product_click", {
                        location: "hero_section",
                        product: "rag_tutorial",
                        action: "buy"
                      })
                    }}
                  >
                    Get Full Access $49
                  </Link>
                </div>
              </div>
              <div className="flex-1 relative">
                <Image
                  src={ragPipelineElements}
                  alt="RAG Pipeline Tutorial Elements"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Deep and Machine Learning Tutorials</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deepMLTutorials.slice(0, 3).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Open-source AI / ML / Pipelines Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mlProjects.slice(0, 3).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">AI-assisted Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiDev.slice(0, 3).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Career Advice</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careerAdvice.slice(0, 3).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-gray-900 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Videos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.slice(0, 3).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-gray-100 dark:bg-gray-800 py-12">
          <div className="container px-4 md:px-6 mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Reference Architectures and Demos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {refArchitectures.slice(0, 3).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
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