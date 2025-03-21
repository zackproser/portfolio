"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import type { Content } from "@/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface ContentLibrarySearchProps {
  onSelect: (content: Content) => void
}

export default function ContentLibrarySearch({ onSelect }: ContentLibrarySearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
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

  // Update the useEffect hook that searches content to use the API
  useEffect(() => {
    if (!isOpen) return

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
        setSearchResults(data.results)
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

    // Add debounce to avoid too many requests
    const timeoutId = setTimeout(searchContent, 300)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, selectedTypes, isOpen, toast])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Search Content Library</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Search Content Library</DialogTitle>
          <DialogDescription>Search for content to include in your newsletter.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Search Term
            </Label>
            <Input
              type="text"
              id="name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Content Type
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all"
                  checked={selectedTypes.includes("all")}
                  onCheckedChange={() => handleTypeChange("all")}
                />
                <label
                  htmlFor="all"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  All
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="article"
                  checked={selectedTypes.includes("article")}
                  onCheckedChange={() => handleTypeChange("article")}
                />
                <label
                  htmlFor="article"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Article
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="video"
                  checked={selectedTypes.includes("video")}
                  onCheckedChange={() => handleTypeChange("video")}
                />
                <label
                  htmlFor="video"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Video
                </label>
              </div>
            </div>
          </div>
          <div>
            <Label>Results</Label>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </div>
              ) : searchResults.length === 0 ? (
                <div>No results found.</div>
              ) : (
                searchResults.map((content) => (
                  <div
                    key={content.id}
                    className="cursor-pointer rounded-md border p-4 hover:bg-secondary"
                    onClick={() => {
                      onSelect(content)
                      setIsOpen(false)
                    }}
                  >
                    {content.title} ({content.type})
                  </div>
                ))
              )}
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

