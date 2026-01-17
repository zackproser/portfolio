"use client"

import type React from "react"
import { useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTools } from "@/components/tools-provider"

export function SearchFilters() {
  const { categories, searchTerm, setSearchTerm, selectedCategories, setSelectedCategories } = useTools()

  const [inputValue, setInputValue] = useState(searchTerm)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(inputValue)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(
      selectedCategories.includes(categoryId)
        ? selectedCategories.filter((id) => id !== categoryId)
        : [...selectedCategories, categoryId],
    )
  }

  return (
    <div className="space-y-4 bg-white dark:bg-slate-800/90 rounded-xl shadow-md p-4 border border-parchment-200 dark:border-slate-700">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-charcoal-50 dark:text-parchment-100">Filters</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="text-parchment-600 dark:text-slate-300 hover:bg-parchment-100 dark:hover:bg-slate-700">
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-parchment-500 dark:text-slate-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Filter by keyword..."
          className="pl-10 border-parchment-200 dark:border-slate-600 dark:bg-slate-800 text-charcoal-50 dark:text-parchment-100 dark:placeholder:text-slate-400"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>

      {showFilters && (
        <div className="pt-2 border-t border-parchment-200 dark:border-slate-700">
          <h3 className="text-sm font-medium text-parchment-600 dark:text-slate-300 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                className={
                  selectedCategories.includes(category.id)
                    ? "cursor-pointer bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white border-none"
                    : "cursor-pointer text-parchment-600 dark:text-slate-300 hover:bg-parchment-100 dark:hover:bg-slate-700 border-parchment-300 dark:border-slate-600"
                }
                onClick={() => toggleCategory(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {(selectedCategories.length > 0 || searchTerm) && (
        <div className="flex items-center justify-between pt-2 border-t border-parchment-200 dark:border-slate-700">
          <span className="text-sm text-parchment-500 dark:text-slate-400">
            {selectedCategories.length > 0 && `${selectedCategories.length} categories selected`}
            {selectedCategories.length > 0 && searchTerm && " • "}
            {searchTerm && `Search: "${searchTerm}"`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedCategories([])
              setSearchTerm("")
              setInputValue("")
            }}
            className="text-burnt-400 dark:text-amber-400 hover:text-burnt-500 dark:hover:text-amber-300 hover:bg-parchment-100 dark:hover:bg-slate-700"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
} 