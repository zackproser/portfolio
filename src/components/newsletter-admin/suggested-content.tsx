"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Sparkles, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface ContentItem {
  id: string
  title: string
  url: string
  type: string
  date: string
  description: string
  image: string
  tags: string[]
}

interface SuggestedContentProps {
  onContentSelect: (content: ContentItem) => void
  currentLinks: any[]
}

export default function SuggestedContent({ onContentSelect, currentLinks }: SuggestedContentProps) {
  const [suggestions, setSuggestions] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchSuggestions = async () => {
    setIsLoading(true)
    try {
      // In a real implementation, you would pass the current links to get relevant suggestions
      // This is just a mock implementation
      const response = await fetch("/api/content-library/search?suggested=true")

      if (!response.ok) {
        throw new Error("Failed to fetch suggested content")
      }

      const data = await response.json()

      // Filter out content that's already in the newsletter
      const currentUrls = currentLinks.map((link) => link.url)
      const filteredSuggestions = data.results.filter(
        (item: ContentItem) => !currentUrls.includes(`${window.location.origin}${item.url}`),
      )

      setSuggestions(filteredSuggestions.slice(0, 3))
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      toast({
        title: "Failed to load suggestions",
        description: "Could not load content suggestions",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSuggestions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleRefresh = () => {
    fetchSuggestions()
  }

  if (suggestions.length === 0 && !isLoading) {
    return null
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
          Suggested Content
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            className="ml-auto text-white hover:bg-white/20"
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh suggestions</span>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <LoadingSpinner size={24} />
          </div>
        ) : (
          <div className="space-y-3">
            {suggestions.map((content) => (
              <div
                key={content.id}
                className="flex items-start justify-between p-2 rounded-md hover:bg-white/10 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">{content.title}</h4>
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
                        +{content.tags.length - 1} more
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onContentSelect(content)}
                  className="ml-2 text-white hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

