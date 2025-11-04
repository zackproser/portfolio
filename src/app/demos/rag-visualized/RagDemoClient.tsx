'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShieldCheck,
  Workflow,
  Gauge,
  NotebookPen,
  LayoutDashboard,
  LifeBuoy
} from 'lucide-react'

import { SAMPLE_DATASETS } from './data'
import RagPipelineVisualization from './RagPipelineVisualization'

const heroHighlights = [
  {
    title: 'Stay factual',
    description: 'Verified retrieval keeps responses tethered to audited sources.',
    icon: ShieldCheck
  },
  {
    title: 'Control cost',
    description: 'Semantic search over your corpus is leaner than repeated fine-tuning cycles.',
    icon: Gauge
  },
  {
    title: 'Ship fast',
    description: 'Engineers can assemble a RAG stack in weeks using existing models and tooling.',
    icon: Workflow
  }
] as const


export default function RagDemoClient() {
  const dataset = useMemo(() => SAMPLE_DATASETS[0], [])

  return (
    <div className="space-y-16">
      <section className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-emerald-50 px-6 py-4 shadow-sm dark:border-blue-900/40 dark:from-zinc-900 dark:via-zinc-900 dark:to-emerald-950/20">
        <div className="mx-auto max-w-6xl space-y-4">
          <div className="space-y-2 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
              Why RAG matters right now
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-[44px]">
              See a grounded RAG stack click into place
            </h1>
            <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-[15px]">
              🧭 Stay grounded in vetted knowledge. 💸 Control spend without bespoke fine-tuning cycles. 🚀 Ship a trustworthy copilot with the engineers you already have.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {heroHighlights.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="rounded-xl border border-blue-200 bg-white/90 p-4 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-blue-900/60 dark:bg-zinc-900/70"
              >
                <Icon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
                <h3 className="mt-2 text-base font-semibold text-blue-900 dark:text-blue-100">{title}</h3>
                <p className="mt-1.5 text-sm text-blue-800/80 dark:text-blue-100/70">{description}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 sm:text-sm">
            Crafted by Zachary Proser, senior AI/ML infrastructure engineer and Developer Experience Engineer at WorkOS. Looking for hands-on help?{' '}
            <Link href="/services" className="text-blue-600 underline decoration-blue-400 decoration-dotted underline-offset-4 dark:text-blue-300">
              Explore services
            </Link>
            .
          </p>
        </div>
      </section>

      <RagPipelineVisualization dataset={dataset} />

      <section className="relative overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-emerald-50/30 dark:from-blue-950/20 dark:via-transparent dark:to-emerald-950/10" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-16 md:py-20 lg:py-24">
          <div className="space-y-8">
            {/* Content */}
            <div className="space-y-6 text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 backdrop-blur-sm dark:bg-blue-900/40 dark:text-blue-200">
                Build production RAG
              </div>
              
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 sm:text-4xl lg:text-5xl">
                Build the Production Pipeline This Demo is Inspired By
              </h2>
              
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300 sm:text-lg max-w-2xl mx-auto">
                Follow the exact system I refined while leading RAG architecture at Pinecone. The premium tutorial includes the notebook that preprocesses your data, the Next.js app that ships to Vercel, and direct email support when you hit edge cases.
              </p>

              {/* Feature Grid - More refined */}
              <div className="grid gap-3 sm:grid-cols-3 text-zinc-600 dark:text-zinc-300 max-w-3xl mx-auto">
                <div className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-center">
                  <NotebookPen className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm leading-relaxed">Step-by-step Jupyter notebook for chunking, embeddings, and Pinecone indexing.</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-center">
                  <LayoutDashboard className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm leading-relaxed">Production-ready Next.js + Vercel AI SDK interface with streaming, citations, and guardrails.</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg p-4 transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-950/20 text-center">
                  <LifeBuoy className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm leading-relaxed">Direct email support from me while you adapt the pipeline to your stack.</span>
                </div>
              </div>

              {/* CTA Buttons - More refined */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center">
                <Link
                  href="/checkout?product=rag-pipeline-tutorial&type=blog"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold rounded-lg text-white bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                >
                  Get the $149 Tutorial →
                </Link>
                <Link
                  href="/products/rag-pipeline-tutorial"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-lg border border-blue-300/60 bg-white/80 text-blue-700 backdrop-blur-sm hover:bg-blue-50/80 hover:border-blue-400 transition-all dark:border-blue-700/60 dark:bg-zinc-900/80 dark:text-blue-200 dark:hover:bg-zinc-800/80 dark:hover:border-blue-600"
                >
                  Preview the Curriculum
                </Link>
              </div>
            </div>

            {/* RAG Pipeline Image - Centered below content */}
            <div className="relative max-w-3xl mx-auto">
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-32 w-32 rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-800/20" />
              <div className="absolute -bottom-4 -left-4 h-24 w-24 rounded-full bg-emerald-200/20 blur-2xl dark:bg-emerald-800/20" />
              
              <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900/80 dark:ring-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/30" />
                <Image
                  src="https://zackproser.b-cdn.net/images/rag-demo.webp"
                  alt="RAG pipeline production interface showing chat with citations and streaming responses"
                  width={800}
                  height={600}
                  className="relative h-auto w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
