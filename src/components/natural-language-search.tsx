"use client"

import type React from "react"
import { useState } from "react"
import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTools } from "@/components/tools-provider"

export function NaturalLanguageSearch() {
  const [query, setQuery] = useState("")
  const { setSearchTerm, setSelectedCategories } = useTools()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()

    // Simple keyword matching for demo purposes
    // In a real implementation, this would use an actual NLP model
    const lowercaseQuery = query.toLowerCase()

    // Reset previous filters
    setSelectedCategories([])

    // Process natural language query
    if (lowercaseQuery.includes("open source") || lowercaseQuery.includes("free")) {
      // This would trigger filtering for open source tools
      setSearchTerm("open source")
    } else if (lowercaseQuery.includes("vector") || lowercaseQuery.includes("embedding")) {
      // This would trigger filtering for vector databases
      setSearchTerm("vector")
    } else if (lowercaseQuery.includes("llm") || lowercaseQuery.includes("language model")) {
      // This would trigger filtering for LLM APIs
      setSearchTerm("llm")
    } else {
      // Default to regular search
      setSearchTerm(query)
    }
  }

  const exampleQueries = [
    "Show me open source LLM frameworks",
    "What are the best vector databases?",
    "I need tools for RAG applications",
    "Compare agent frameworks",
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 h-5 w-5" />
          <input
            type="text"
            placeholder="Ask anything about AI development tools..."
            className="w-full h-14 pl-12 pr-4 rounded-full border border-slate-200 dark:border-gray-600 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-lg bg-white dark:bg-gray-800 text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 hover:from-blue-700 hover:to-blue-900 dark:hover:from-blue-500 dark:hover:to-blue-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </form>

      <div className="mt-3 flex flex-wrap gap-2 justify-center">
        {exampleQueries.map((example, index) => (
          <button
            key={index}
            onClick={() => {
              setQuery(example)
            }}
            className="text-xs px-3 py-1 rounded-full bg-slate-100 dark:bg-gray-700 text-slate-600 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-gray-600 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
} 