"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Book, RefreshCw, Filter, Star } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Content } from "@/types"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface ContentLibrarySidebarProps {
  onContentSelect: (content: Content) => void
}

export default function ContentLibrarySidebar({ onContentSelect }: ContentLibrarySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["all"])
  const [searchResults, setSearchResults] = useState<Content[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleTypeChange = (type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type)
      } else {
        if (type === "all") {
          return ["all"]
        }
        const newTypes = prev.filter((t) => t !== "all").concat(type)
        return newTypes.length === 0 ? ["all"] : newTypes
      }
    })
  }

  const handleRefresh = () => {
    searchContent()
  }

  const searchContent = async () => {
    setIsLoading(true)

    try {
      // Build query parameters
      const params = new URLSearchParams()
      if (searchTerm) params.append("query", searchTerm)
      if (!selectedTypes.includes("all")) {
        params.append("types", selectedTypes.join(","))
      }

      // Fetch from API
      const response = await fetch(`/api/content-library/search?${params.toString()}`)

      if (!response.ok) {
        throw new Error("Failed to search content library")
      }

      const data = await response.json()

      // Mark the first 3 items as suggested
      const resultsWithSuggested = data.results.map((item: Content, index: number) => ({
        ...item,
        isSuggested: index < 3,
      }))

      setSearchResults(resultsWithSuggested)
    } catch (error) {
      console.error("Error searching content:", error)
      toast({
        title: "Search failed",
        description: "Failed to search content library",
        variant: "destructive",
      })
      setSearchResults([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Add debounce to avoid too many requests
    const timeoutId = setTimeout(searchContent, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedTypes]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Book className="h-4 w-4 mr-2 text-blue-300" />
          Content Library
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="ml-auto text-white hover:bg-white/20 h-8 w-8 p-0"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/20 border-white/20 placeholder:text-white/50 text-white"
          />
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/20">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Type
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2 p-2 bg-white/5 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sidebar-all"
                checked={selectedTypes.includes("all")}
                onCheckedChange={() => handleTypeChange("all")}
              />
              <label
                htmlFor="sidebar-all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                All
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sidebar-blog"
                checked={selectedTypes.includes("blog")}
                onCheckedChange={() => handleTypeChange("blog")}
              />
              <label
                htmlFor="sidebar-blog"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Blog
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sidebar-tutorial"
                checked={selectedTypes.includes("tutorial")}
                onCheckedChange={() => handleTypeChange("tutorial")}
              />
              <label
                htmlFor="sidebar-tutorial"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Tutorial
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sidebar-project"
                checked={selectedTypes.includes("project")}
                onCheckedChange={() => handleTypeChange("project")}
              />
              <label
                htmlFor="sidebar-project"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Project
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sidebar-publication"
                checked={selectedTypes.includes("publication")}
                onCheckedChange={() => handleTypeChange("publication")}
              />
              <label
                htmlFor="sidebar-publication"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Publication
              </label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-2">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size={24} />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-4 text-white/70 text-sm">
              {searchTerm ? "No results found" : "Search for content to add to your newsletter"}
            </div>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-3">
                {searchResults.map((content) => (
                  <div
                    key={content.id}
                    className={`p-3 rounded-md hover:bg-white/10 transition-colors border ${
                      content.isSuggested ? "border-yellow-500/30 bg-yellow-500/10" : "border-white/10"
                    } cursor-pointer`}
                    onClick={() => onContentSelect(content)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white text-sm flex items-center">
                        {content.isSuggested && <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />}
                        {content.title}
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          onContentSelect(content)
                        }}
                        className="ml-2 text-white hover:bg-blue-700 h-6 w-6 p-0"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      <Badge variant="outline" className="border-blue-500 text-blue-300 text-xs">
                        {content.type}
                      </Badge>
                      {content.tags.slice(0, 1).map((tag) => (
                        <Badge key={tag} variant="outline" className="border-blue-500 text-blue-300 text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {content.tags.length > 1 && (
                        <Badge variant="outline" className="border-blue-500 text-blue-300 text-xs">
                          +{content.tags.length - 1}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/70 mt-1 line-clamp-2">{content.description}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

