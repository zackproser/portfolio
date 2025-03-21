"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Tag, Plus, X, Search } from "lucide-react"
import type { LinkItem } from "./newsletter-builder"

interface LinkTaggerProps {
  link: LinkItem
  availableTags: string[]
  onAddTag: (linkId: string, tag: string) => void
  onRemoveTag: (linkId: string, tag: string) => void
  onCreateTag: (tag: string) => void
}

export default function LinkTagger({ link, availableTags, onAddTag, onRemoveTag, onCreateTag }: LinkTaggerProps) {
  const [newTag, setNewTag] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const handleAddTag = () => {
    if (!newTag.trim()) return

    const normalizedTag = newTag.trim()

    if (!availableTags.includes(normalizedTag)) {
      onCreateTag(normalizedTag)
    }

    onAddTag(link.id, normalizedTag)
    setNewTag("")

    toast({
      title: "Tag added",
      description: `Tag "${normalizedTag}" has been added to the link`,
    })
  }

  const filteredTags = availableTags.filter(
    (tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()) && !link.tags?.includes(tag),
  )

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Tag className="h-4 w-4 mr-2" />
          Link Tags
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {link.tags?.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-blue-700 hover:bg-blue-600 text-white">
              {tag}
              <button className="ml-2 hover:text-red-300" onClick={() => onRemoveTag(link.id, tag)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {!link.tags?.length && <p className="text-sm text-blue-300">No tags added yet</p>}
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Add new tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="bg-white/20 border-white/20 placeholder:text-white/50 text-white"
          />
          <Button onClick={handleAddTag} disabled={!newTag.trim()} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div>
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search available tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/20 border-white/20 placeholder:text-white/50 text-white text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2">
            {filteredTags.length > 0 ? (
              filteredTags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-blue-500 text-blue-300 cursor-pointer hover:bg-blue-800"
                  onClick={() => onAddTag(link.id, tag)}
                >
                  {tag}
                  <Plus className="h-3 w-3 ml-1" />
                </Badge>
              ))
            ) : (
              <p className="text-sm text-blue-300">
                {searchTerm ? "No matching tags found" : "No additional tags available"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

