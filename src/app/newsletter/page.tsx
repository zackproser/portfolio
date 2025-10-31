import { Metadata } from 'next'
import { Container } from '@/components/Container'
import { type BlogWithSlug } from '@/types'
import { getAllContent } from '@/lib/content-handlers'
import { ContentCard } from '@/components/ContentCard'
import { createMetadata } from '@/utils/createMetadata'
import { Zap, TrendingUp, Code, Sparkles, Mail, BookOpen, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { NewsletterSignupInline } from '@/components/NewsletterSignupInline'
import { Suspense } from 'react'
import CV from '@/components/CV'
import RandomPortrait from '@/components/RandomPortrait'
import { NewsletterSocialProof } from '@/components/NewsletterSocialProof'

export const metadata: Metadata = createMetadata({
  title: "AI & Developer Tools Newsletter - Zachary Proser",
  description: "Get weekly insights on AI coding tools, vector databases, and developer productivity. Join 3,000+ engineers staying ahead of the curve.",
});

export const revalidate = 3600;

export default async function NewsletterPage() {
  const articles = await getAllContent('newsletter')
  // Hardcode subscriber count until API is configured
  const subscriberCount = "3,000+"

  return (
    <div className="min-h-screen">
      {/* Hero Section - Clean and Direct */}
      <section className="relative min-h-[80vh] bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0.6))]" />

        <Container>
          <div className="relative grid lg:grid-cols-[0.8fr,1.4fr] gap-12 items-center py-24 min-h-[80vh]">
            {/* Left side - Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full text-sm font-medium text-blue-200 border border-blue-400/30">
                <Sparkles className="w-4 h-4" />
                <span>Join {subscriberCount} engineers reading every week</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                Master AI Development
              </h1>

              <p className="text-xl text-blue-100 leading-relaxed">
                Real benchmarks, practical tutorials, and no-BS tool comparisons for developers, business owners, and investors navigating the AI landscape.
              </p>
            </div>

            {/* Right side - Wide Newsletter Signup */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-2xl">
                <NewsletterSignupInline variant="dark" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <NewsletterSocialProof />

      {/* About Section - Using CV Component */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Portrait + CV */}
              <div className="space-y-8">
                <div className="w-full max-w-[400px] mx-auto lg:mx-0">
                  <Suspense fallback={<div className="w-full aspect-square bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />}>
                    <RandomPortrait width={400} height={400} />
                  </Suspense>
                </div>
                <div>
                  <CV showHeading={false} />
                </div>
              </div>

              {/* Right Column - Text Content */}
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                  Learn from Someone <span className="text-blue-600 dark:text-blue-400">Building This Stuff</span>
                </h2>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  I&apos;m <strong>Zachary Proser</strong>, a Staff-level AI Engineer with 13+ years shipping production systems.
                  I&apos;ve built RAG pipelines, vector database features, and AI developer tools at companies you know.
                </p>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  I teach AI development through <strong>interactive machine learning examples</strong> that break down complex concepts from the ground up—no prerequisites needed.
                </p>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  This newsletter shares what I&apos;m actually using and building—real benchmarks, honest tool comparisons, and technical deep dives that skip the marketing fluff.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Recent Episodes */}
      <Container>
        <div className="max-w-7xl mx-auto mt-20 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Recent Episodes
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              See what {subscriberCount} engineers are reading
            </p>
          </div>

          {/* Featured Latest Episode */}
          {articles.length > 0 && (
            <div className="mb-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
                  Latest
                </div>
              </div>
              <ContentCard article={articles[0]} />
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            {articles.slice(1, 7).map((article) => (
              <ContentCard key={article.slug} article={article} />
            ))}
          </div>

          {articles.length > 7 && (
            <div className="text-center mt-12">
              <p className="text-zinc-600 dark:text-zinc-400 text-lg">
                <strong>{articles.length - 7} more episodes</strong> in the archive
              </p>
            </div>
          )}
        </div>

      {/* What You'll Get Section - Interesting Cards */}
        <div className="max-w-6xl mx-auto mt-24 mb-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              What You&apos;ll Get
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400">
              Cut through the AI hype with practical, battle-tested insights
            </p>
          </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tool Deep Dives - Gradient Card */}
          <div className="group relative bg-gradient-to-br from-blue-500 to-cyan-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 rounded-2xl group-hover:bg-black/0 transition-colors"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Tool Deep Dives
              </h3>
              <p className="text-blue-50 text-lg leading-relaxed">
                Hands-on reviews of Cursor, Claude, GPT-4, WisprFlow, and other AI coding tools.
                Real performance benchmarks and workflow integration tips.
              </p>
            </div>
          </div>

          {/* AI Implementation - Dark Card */}
          <div className="group relative bg-gradient-to-br from-purple-600 to-pink-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 rounded-2xl group-hover:bg-black/0 transition-colors"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                AI Implementation Guides
              </h3>
              <p className="text-purple-50 text-lg leading-relaxed">
                Step-by-step tutorials on building with LLMs, embeddings, vector databases, and RAG pipelines.
                Code examples included.
              </p>
            </div>
          </div>

          {/* Industry Trends - Gradient Card */}
          <div className="group relative bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 rounded-2xl group-hover:bg-black/0 transition-colors"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Industry Trends
              </h3>
              <p className="text-emerald-50 text-lg leading-relaxed">
                Analysis of the latest AI developments, new model releases, and emerging tools.
                Cut through the hype with data-driven insights.
              </p>
            </div>
          </div>

          {/* Productivity Hacks - Gradient Card */}
          <div className="group relative bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-black/10 rounded-2xl group-hover:bg-black/0 transition-colors"></div>
            <div className="relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Productivity Hacks
              </h3>
              <p className="text-amber-50 text-lg leading-relaxed">
                Voice-to-code workflows, AI agent orchestration, and automation strategies.
                Learn how to 10x your development speed.
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* Final CTA */}
        <div className="max-w-3xl mx-auto text-center py-16">
          <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
            Ready to Master AI Development?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
            Join {subscriberCount} engineers getting smarter about AI tools.
          </p>
          <NewsletterSignupInline />
        </div>
      </Container>
    </div>
  )
}
