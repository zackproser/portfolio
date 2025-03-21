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

interface ContentSearchResult extends Content {
  id: string;
  isSuggested: boolean;
}

interface ContentLibrarySidebarProps {
  onContentSelect: (content: Content) => void
}

export default function ContentLibrarySidebar({ onContentSelect }: ContentLibrarySidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["all"])
  const [searchResults, setSearchResults] = useState<ContentSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAllResults, setShowAllResults] = useState(false)
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
      const resultsWithSuggested = data.results.map((item: any, index: number) => ({
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
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white max-h-[50vh] flex flex-col overflow-hidden">
      <CardHeader className="pb-1 pt-2 px-3 flex-shrink-0">
        <CardTitle className="text-base flex items-center">
          <Book className="h-4 w-4 mr-1 text-blue-300" />
          Content Library
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="ml-auto text-white hover:bg-white/20 h-6 w-6 p-0"
            disabled={isLoading}
          >
            <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 px-3 py-1 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/50 h-3 w-3" />
          <Input
            placeholder="Search content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-7 bg-white/20 border-white/20 placeholder:text-white/50 text-white h-7 text-sm"
          />
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/20 h-7 text-xs">
              <Filter className="h-3 w-3 mr-1" />
              Filter by Type
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1 space-y-0.5 p-1 bg-white/5 rounded-md">
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

        <div className="mt-1 overflow-auto flex-grow">
          {isLoading ? (
            <div className="flex justify-center py-1">
              <LoadingSpinner size={16} />
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-1 text-white/70 text-xs">
              {searchTerm ? "No results found" : "Search for content to add to your newsletter"}
            </div>
          ) : (
            <ScrollArea className="h-[calc(50vh-120px)] overflow-auto">
              <div className="space-y-1 pr-1">
                {(showAllResults ? searchResults : searchResults.slice(0, 5)).map((content) => (
                  <div
                    key={content._id || content.slug}
                    className={`p-1.5 rounded-md hover:bg-white/10 transition-colors border ${
                      content.isSuggested ? "border-yellow-500/30 bg-yellow-500/10" : "border-white/10"
                    } cursor-pointer`}
                    onClick={() => onContentSelect(content)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white text-xs flex items-center">
                        {content.isSuggested && <Star className="h-3 w-3 mr-0.5 text-yellow-500 fill-yellow-500" />}
                        {content.title}
                      </h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation()
                          onContentSelect(content)
                        }}
                        className="ml-1 text-white hover:bg-blue-700 h-5 w-5 p-0"
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      <Badge variant="outline" className="border-blue-500 text-blue-300 text-xs py-0 px-1 h-4">
                        {content.type}
                      </Badge>
                      {content.tags && content.tags.length > 0 && content.tags.slice(0, 1).map((tag) => (
                        <Badge key={tag} variant="outline" className="border-blue-500 text-blue-300 text-xs py-0 px-1 h-4">
                          {tag}
                        </Badge>
                      ))}
                      {content.tags && content.tags.length > 1 && (
                        <Badge variant="outline" className="border-blue-500 text-blue-300 text-xs py-0 px-1 h-4">
                          +{content.tags.length - 1}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/70 mt-0.5 line-clamp-1">{content.description}</p>
                  </div>
                ))}
                
                {searchResults.length > 5 && !showAllResults && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full text-xs text-blue-300 hover:bg-white/10 mt-1"
                    onClick={() => setShowAllResults(true)}
                  >
                    Show all {searchResults.length} results
                  </Button>
                )}
                
                {searchResults.length > 5 && showAllResults && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="w-full text-xs text-blue-300 hover:bg-white/10 mt-1"
                    onClick={() => setShowAllResults(false)}
                  >
                    Show fewer results
                  </Button>
                )}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

