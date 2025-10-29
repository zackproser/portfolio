import { Metadata } from 'next'
import { SearchFilters } from "@/components/search-filters"
import { ToolGrid } from "@/components/tool-grid"
import { ComparisonBar } from "@/components/comparison-bar"
import { ToolsProvider } from "@/components/tools-provider"
import { NaturalLanguageSearch } from "@/components/natural-language-search"
import { createMetadata } from '@/utils/createMetadata'
import Callout from '@/components/Callout'

export const metadata: Metadata = createMetadata({
  title: 'AI-Assisted Developer Tools Compared',
  description: 'Find and compare the best AI development tools for your next project',
});

export default function DevToolsPage() {
  return (
    <ToolsProvider>
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-blue-700/20 dark:from-blue-600/30 dark:to-blue-800/30 opacity-50 h-72" />
          <div className="container mx-auto px-4 pt-16 pb-8 relative">
            <Callout type="announcement" title="This experience is under construction" className="mb-6">
              We’re actively improving accuracy and coverage. Expect rough edges and occasional mistakes.
            </Callout>
            <header className="mb-12 text-center">
              <h1 className="text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-500 text-transparent bg-clip-text">
                AI Dev Tool Comparison
              </h1>
              <p className="text-xl text-slate-600 dark:text-slate-200 max-w-2xl mx-auto">
                Find and compare the best AI development tools for your next project
              </p>
            </header>

            <NaturalLanguageSearch />

            <div className="mt-12">
              <SearchFilters />
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 py-8">
          <ToolGrid />
        </main>

        <ComparisonBar />
      </div>
    </ToolsProvider>
  )
}