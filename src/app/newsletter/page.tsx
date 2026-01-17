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
    <div className="min-h-screen bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-200 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950">
      {/* Hero Section - Parchment/Amber Theme */}
      <section className="relative min-h-[80vh] overflow-hidden">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5 dark:opacity-10" />
        {/* Gradient accent */}
        <div className="absolute inset-0 h-96 bg-gradient-to-r from-burnt-400/10 to-burnt-600/10 dark:from-amber-600/10 dark:to-amber-800/10" />

        <Container>
          <div className="relative grid lg:grid-cols-[0.8fr,1.4fr] gap-12 items-center py-24 min-h-[80vh]">
            {/* Left side - Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-burnt-400/10 dark:bg-amber-500/20 backdrop-blur-sm rounded-full text-sm font-medium text-burnt-500 dark:text-amber-300 border border-burnt-400/30 dark:border-amber-400/30">
                <Sparkles className="w-4 h-4" />
                <span>Join {subscriberCount} engineers reading every week</span>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight">
                <span className="text-charcoal-50 dark:text-white">Master </span>
                <span className="text-burnt-400 dark:text-amber-400">AI Development</span>
              </h1>

              <p className="text-xl text-parchment-600 dark:text-slate-300 leading-relaxed">
                Real benchmarks, practical tutorials, and no-BS tool comparisons for developers, business owners, and investors navigating the AI landscape.
              </p>
            </div>

            {/* Right side - Wide Newsletter Signup */}
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-2xl">
                <NewsletterSignupInline variant="light" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <NewsletterSocialProof />

      {/* About Section - Using CV Component */}
      <section className="py-24 bg-parchment-100/50 dark:bg-slate-800/50">
        <Container>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left Column - Portrait + CV */}
              <div className="space-y-8">
                <div className="w-full max-w-[400px] mx-auto lg:mx-0">
                  <Suspense fallback={<div className="w-full aspect-square bg-parchment-200 dark:bg-slate-700 rounded-2xl animate-pulse" />}>
                    <RandomPortrait width={400} height={400} />
                  </Suspense>
                </div>
                <div>
                  <CV showHeading={false} />
                </div>
              </div>

              {/* Right Column - Text Content */}
              <div className="space-y-6">
                <h2 className="font-serif text-4xl font-bold text-charcoal-50 dark:text-white">
                  Learn from Someone <span className="text-burnt-400 dark:text-amber-400">Building This Stuff</span>
                </h2>
                <p className="text-lg text-parchment-600 dark:text-slate-300 leading-relaxed">
                  I&apos;m <strong className="text-charcoal-50 dark:text-white">Zachary Proser</strong>, a Staff-level AI Engineer with 13+ years shipping production systems.
                  I&apos;ve built RAG pipelines, vector database features, and AI developer tools at companies you know.
                </p>
                <p className="text-lg text-parchment-600 dark:text-slate-300 leading-relaxed">
                  I teach AI development through <strong className="text-charcoal-50 dark:text-white">interactive machine learning examples</strong> that break down complex concepts from the ground up—no prerequisites needed.
                </p>
                <p className="text-lg text-parchment-600 dark:text-slate-300 leading-relaxed">
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
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-charcoal-50 dark:text-white mb-4">
              Recent Episodes
            </h2>
            <p className="text-lg text-parchment-600 dark:text-slate-400">
              See what {subscriberCount} engineers are reading
            </p>
          </div>

          {/* Featured Latest Episode */}
          {articles.length > 0 && (
            <div className="mb-12 bg-gradient-to-br from-burnt-400/5 to-burnt-600/10 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl p-8 border border-burnt-400/20 dark:border-amber-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="px-3 py-1 bg-burnt-400 dark:bg-amber-600 text-white text-xs font-bold rounded-full uppercase tracking-wide">
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
              <p className="text-parchment-600 dark:text-slate-400 text-lg">
                <strong className="text-charcoal-50 dark:text-white">{articles.length - 7} more episodes</strong> in the archive
              </p>
            </div>
          )}
        </div>

      {/* What You'll Get Section - Interesting Cards */}
        <div className="max-w-6xl mx-auto mt-24 mb-16">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-charcoal-50 dark:text-white mb-4">
              What You&apos;ll Get
            </h2>
            <p className="text-xl text-parchment-600 dark:text-slate-400">
              Cut through the AI hype with practical, battle-tested insights
            </p>
          </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Tool Deep Dives */}
          <div className="group relative bg-parchment-50 dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-parchment-200 dark:border-slate-700 hover:shadow-xl hover:border-burnt-400/50 dark:hover:border-amber-500/50 transition-all hover:-translate-y-1">
            <div className="relative">
              <div className="w-16 h-16 bg-burnt-400/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <Code className="w-8 h-8 text-burnt-400 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-50 dark:text-white mb-4">
                Tool Deep Dives
              </h3>
              <p className="text-parchment-600 dark:text-slate-300 text-lg leading-relaxed">
                Hands-on reviews of Cursor, Claude, GPT-4, WisprFlow, and other AI coding tools.
                Real performance benchmarks and workflow integration tips.
              </p>
            </div>
          </div>

          {/* AI Implementation */}
          <div className="group relative bg-parchment-50 dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-parchment-200 dark:border-slate-700 hover:shadow-xl hover:border-burnt-400/50 dark:hover:border-amber-500/50 transition-all hover:-translate-y-1">
            <div className="relative">
              <div className="w-16 h-16 bg-burnt-400/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-burnt-400 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-50 dark:text-white mb-4">
                AI Implementation Guides
              </h3>
              <p className="text-parchment-600 dark:text-slate-300 text-lg leading-relaxed">
                Step-by-step tutorials on building with LLMs, embeddings, vector databases, and RAG pipelines.
                Code examples included.
              </p>
            </div>
          </div>

          {/* Industry Trends */}
          <div className="group relative bg-parchment-50 dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-parchment-200 dark:border-slate-700 hover:shadow-xl hover:border-burnt-400/50 dark:hover:border-amber-500/50 transition-all hover:-translate-y-1">
            <div className="relative">
              <div className="w-16 h-16 bg-burnt-400/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-burnt-400 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-50 dark:text-white mb-4">
                Industry Trends
              </h3>
              <p className="text-parchment-600 dark:text-slate-300 text-lg leading-relaxed">
                Analysis of the latest AI developments, new model releases, and emerging tools.
                Cut through the hype with data-driven insights.
              </p>
            </div>
          </div>

          {/* Productivity Hacks */}
          <div className="group relative bg-parchment-50 dark:bg-slate-800 p-8 rounded-2xl shadow-lg border border-parchment-200 dark:border-slate-700 hover:shadow-xl hover:border-burnt-400/50 dark:hover:border-amber-500/50 transition-all hover:-translate-y-1">
            <div className="relative">
              <div className="w-16 h-16 bg-burnt-400/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-burnt-400 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-bold text-charcoal-50 dark:text-white mb-4">
                Productivity Hacks
              </h3>
              <p className="text-parchment-600 dark:text-slate-300 text-lg leading-relaxed">
                Voice-to-code workflows, AI agent orchestration, and automation strategies.
                Learn how to 10x your development speed.
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* Final CTA */}
        <div className="max-w-3xl mx-auto text-center py-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">
            <span className="text-charcoal-50 dark:text-white">Ready to Master </span>
            <span className="text-burnt-400 dark:text-amber-400">AI Development?</span>
          </h2>
          <p className="text-lg text-parchment-600 dark:text-slate-400 mb-8 leading-relaxed">
            Join {subscriberCount} engineers getting smarter about AI tools.
          </p>
          <NewsletterSignupInline variant="light" />
        </div>
      </Container>
    </div>
  )
}
