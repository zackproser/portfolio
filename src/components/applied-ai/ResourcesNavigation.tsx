'use client'

import { useRef } from 'react'
import { Sparkles, Beaker, PlayCircle, FileText, BookOpen, Boxes, Quote } from 'lucide-react'

export function ResourcesNavigation() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4" />
            Explore My Work
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Comprehensive Resources for Hiring Managers
          </h2>
        </div>

        {/* Lead-in emphasizing interactive demos */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8 mb-8">
          <p className="text-gray-800 dark:text-gray-200 text-lg md:text-xl text-center">
            I build interactive machine learning demos into my site to teach concepts hands-on — try them in the Demos section, then dive deeper via videos, blog posts, and publications.
          </p>
        </div>

        {/* Mid-weight resource grid with icons and subtle gradients */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Demos - emphasized */}
          <a href="/demos" className="group relative rounded-2xl border border-blue-300/60 dark:border-blue-700/60 bg-white dark:bg-gray-800 p-6 hover:shadow-xl transition-all">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                <Beaker className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Demos</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">Interactive ML and AI prototypes you can use in the browser.</p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold">Explore /demos →</div>
              </div>
            </div>
          </a>

          <a href="/videos" className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-all">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md">
                <PlayCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Videos</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">Hands-on tutorials and deep dives on AI and engineering.</p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold">Watch /videos →</div>
              </div>
            </div>
          </a>

          <a href="/blog" className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-all">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Blog</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">Practical articles on RAG, embeddings, vector DBs, and production AI.</p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold">Read /blog →</div>
              </div>
            </div>
          </a>

          <a href="/publications" className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-all">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Publications</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">Docs and long-form guides used by thousands of engineers.</p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold">Browse /publications →</div>
              </div>
            </div>
          </a>

          <a href="/projects" className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-all">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-md">
                <Boxes className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Projects</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">Open-source and production builds across AI and infra.</p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold">See /projects →</div>
              </div>
            </div>
          </a>

          <a href="/testimonials" className="group relative rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:shadow-lg transition-all">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-fuchsia-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-start gap-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-white shadow-md">
                <Quote className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Testimonials</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-3">What clients and teams say about working together.</p>
                <div className="text-blue-600 dark:text-blue-400 font-semibold">View /testimonials →</div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </section>
  )
}