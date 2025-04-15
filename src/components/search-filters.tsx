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
    <div className="space-y-4 bg-white dark:bg-gray-800/90 rounded-xl shadow-md p-4 border border-slate-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-slate-800 dark:text-white">Filters</h2>
        <Button variant="ghost" size="sm" onClick={() => setShowFilters(!showFilters)} className="text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700">
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-300 h-4 w-4" />
        <Input
          type="text"
          placeholder="Filter by keyword..."
          className="pl-10 border-slate-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-slate-400"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </form>

      {showFilters && (
        <div className="pt-2 border-t border-slate-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.id}
                variant={selectedCategories.includes(category.id) ? "default" : "outline"}
                className={
                  selectedCategories.includes(category.id)
                    ? "cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 hover:from-blue-700 hover:to-blue-900 dark:hover:from-blue-500 dark:hover:to-blue-700 text-white border-none"
                    : "cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700 border-slate-200 dark:border-gray-600"
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
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-gray-700">
          <span className="text-sm text-slate-500 dark:text-slate-300">
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
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  )
} 