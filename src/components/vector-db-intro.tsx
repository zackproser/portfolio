'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, Database, Search, Zap, Brain } from 'lucide-react'

export function VectorDbIntro() {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="bg-parchment-100 dark:bg-slate-800/60 rounded-xl p-6 mb-8 border border-parchment-300 dark:border-slate-700">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-burnt-400/10 dark:bg-amber-500/10 rounded-lg">
          <Database className="h-6 w-6 text-burnt-400 dark:text-amber-400" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-charcoal-50 dark:text-parchment-100 mb-2">
            What is a Vector Database?
          </h2>
          <p className="text-parchment-600 dark:text-slate-300 leading-relaxed">
            A vector database stores data as mathematical representations (embeddings) that capture semantic meaning.
            This enables <strong className="text-burnt-500 dark:text-amber-400">similarity search</strong> — finding content based on meaning rather than exact keywords.
          </p>

          {expanded && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-parchment-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-burnt-400 dark:text-amber-400" />
                    <span className="font-medium text-charcoal-50 dark:text-parchment-100">RAG & LLM Apps</span>
                  </div>
                  <p className="text-sm text-parchment-600 dark:text-slate-400">
                    Ground AI responses with relevant context from your data, reducing hallucinations.
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-parchment-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Search className="h-5 w-5 text-burnt-400 dark:text-amber-400" />
                    <span className="font-medium text-charcoal-50 dark:text-parchment-100">Semantic Search</span>
                  </div>
                  <p className="text-sm text-parchment-600 dark:text-slate-400">
                    Find documents by meaning, not just keywords. Search for &quot;happy&quot; and find &quot;joyful.&quot;
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-parchment-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-burnt-400 dark:text-amber-400" />
                    <span className="font-medium text-charcoal-50 dark:text-parchment-100">Recommendations</span>
                  </div>
                  <p className="text-sm text-parchment-600 dark:text-slate-400">
                    Power &quot;similar items&quot; and personalization by finding semantically related content.
                  </p>
                </div>
              </div>
              <p className="text-sm text-parchment-500 dark:text-slate-500 italic">
                Use this tool to compare {'>'}30 vector databases and find the right one for your use case.
              </p>
            </div>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-burnt-400 dark:text-amber-400 text-sm font-medium flex items-center gap-1 hover:text-burnt-500 dark:hover:text-amber-300 transition-colors"
          >
            {expanded ? (
              <>Show less <ChevronUp className="h-4 w-4" /></>
            ) : (
              <>Learn more about use cases <ChevronDown className="h-4 w-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
