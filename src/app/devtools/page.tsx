import { Metadata } from 'next'
import { SearchFilters } from "@/components/search-filters"
import { ToolGrid } from "@/components/tool-grid"
import { ComparisonBar } from "@/components/comparison-bar"
import { ToolsProvider } from "@/components/tools-provider"
import { NaturalLanguageSearch } from "@/components/natural-language-search"
import { createMetadata } from '@/utils/createMetadata'
import DevToolsWrapper from './devtools-wrapper'

export const metadata: Metadata = createMetadata({
  title: 'AI-Assisted Developer Tools Compared',
  description: 'Find and compare the best AI development tools for your next project',
});

export default function DevToolsPage() {
  return (
    <ToolsProvider>
      <DevToolsWrapper>
        <NaturalLanguageSearch />
        <div className="mt-12">
          <SearchFilters />
        </div>
        <main className="container mx-auto px-4 py-8">
          <ToolGrid />
        </main>
        <ComparisonBar />
      </DevToolsWrapper>
    </ToolsProvider>
  )
}
