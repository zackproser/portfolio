"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Calendar, Mail, Copy, Edit, Trash2, Tag, BarChart, ChevronDown, Eye, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Mock data for demonstration
const mockEpisodes = [
  {
    id: "1",
    subject: "Latest Web Development Trends - March 2025",
    dateCreated: "2025-03-15T10:30:00Z",
    dateSent: "2025-03-16T09:00:00Z",
    tags: ["Web Development", "JavaScript", "CSS"],
    stats: {
      opens: 1250,
      clicks: 432,
      unsubscribes: 5,
    },
    links: [
      { title: "The Future of React in 2025", url: "https://example.com/react-2025" },
      { title: "CSS Container Queries: A Complete Guide", url: "https://example.com/container-queries" },
      { title: "Building Performant Web Apps", url: "https://example.com/performance" },
    ],
  },
  {
    id: "2",
    subject: "AI Tools for Developers - February 2025",
    dateCreated: "2025-02-20T14:15:00Z",
    dateSent: "2025-02-22T09:00:00Z",
    tags: ["AI", "Tools", "Productivity"],
    stats: {
      opens: 1420,
      clicks: 567,
      unsubscribes: 3,
    },
    links: [
      { title: "Top 10 AI Coding Assistants", url: "https://example.com/ai-coding" },
      { title: "How to Use GPT-5 for Code Generation", url: "https://example.com/gpt5-code" },
      { title: "AI-Powered Testing Tools", url: "https://example.com/ai-testing" },
    ],
  },
  {
    id: "3",
    subject: "DevOps Best Practices - January 2025",
    dateCreated: "2025-01-10T11:45:00Z",
    dateSent: "2025-01-12T09:00:00Z",
    tags: ["DevOps", "CI/CD", "Docker"],
    stats: {
      opens: 1150,
      clicks: 389,
      unsubscribes: 7,
    },
    links: [
      { title: "Containerization Strategies for 2025", url: "https://example.com/containers-2025" },
      { title: "GitHub Actions vs. Jenkins: A Comparison", url: "https://example.com/github-jenkins" },
      { title: "Kubernetes Best Practices", url: "https://example.com/k8s-best-practices" },
    ],
  },
]

export function EpisodeLibrary() {
  const [episodes, setEpisodes] = useState(mockEpisodes)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [episodeToDelete, setEpisodeToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  // Get all unique tags from episodes
  const allTags = Array.from(new Set(episodes.flatMap((episode) => episode.tags))).sort()

  const filteredEpisodes = episodes.filter((episode) => {
    const matchesSearch =
      searchTerm === "" ||
      episode.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      episode.links.some((link) => link.title.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesTags = selectedTags.length === 0 || selectedTags.every((tag) => episode.tags.includes(tag))

    return matchesSearch && matchesTags
  })

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  const handleDeleteEpisode = () => {
    if (episodeToDelete) {
      setEpisodes((prev) => prev.filter((ep) => ep.id !== episodeToDelete))
      toast({
        title: "Episode deleted",
        description: "The newsletter episode has been deleted",
      })
      setIsDeleteDialogOpen(false)
      setEpisodeToDelete(null)
    }
  }

  const handleDuplicateEpisode = (id: string) => {
    const episodeToDuplicate = episodes.find((ep) => ep.id === id)
    if (episodeToDuplicate) {
      const newEpisode = {
        ...episodeToDuplicate,
        id: Date.now().toString(),
        subject: `Copy of ${episodeToDuplicate.subject}`,
        dateCreated: new Date().toISOString(),
        dateSent: "",
      }
      setEpisodes((prev) => [newEpisode, ...prev])
      toast({
        title: "Episode duplicated",
        description: "A copy of the newsletter has been created",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search episodes by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/20">
              <Tag className="h-4 w-4 mr-2" />
              Filter by Tags
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-blue-900 border-blue-700 text-white">
            {allTags.map((tag) => (
              <DropdownMenuItem
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`cursor-pointer ${selectedTags.includes(tag) ? "bg-blue-700" : ""}`}
              >
                {tag}
              </DropdownMenuItem>
            ))}
            {selectedTags.length > 0 && (
              <DropdownMenuItem
                onClick={() => setSelectedTags([])}
                className="border-t border-blue-700 mt-2 pt-2 cursor-pointer"
              >
                Clear Filters
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-blue-700 hover:bg-blue-600 text-white">
              {tag}
              <button className="ml-2 hover:text-red-300" onClick={() => handleTagToggle(tag)}>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedTags([])}
            className="text-white hover:bg-white/20 h-6"
          >
            Clear All
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {filteredEpisodes.length > 0 ? (
          filteredEpisodes.map((episode) => (
            <Collapsible key={episode.id} className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{episode.subject}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {episode.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="border-blue-500 text-blue-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 text-sm text-blue-300">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(episode.dateSent || episode.dateCreated).toLocaleDateString()}</span>

                    <div className="flex items-center ml-4 space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{episode.dateSent ? "Sent" : "Draft"}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-4">
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/20">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </CollapsibleTrigger>

                  <Link href={`/admin/newsletter?edit=${episode.id}`} passHref>
                    <Button variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/20">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDuplicateEpisode(episode.id)}
                    className="border-white/20 text-white hover:bg-white/20"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Duplicate
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEpisodeToDelete(episode.id)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="border-white/20 text-white hover:bg-red-900/20 hover:text-red-300 hover:border-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>

              <CollapsibleContent>
                <div className="px-6 pb-6 border-t border-white/10 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Links</h4>
                      <ul className="space-y-2">
                        {episode.links.map((link, index) => (
                          <li key={index} className="text-blue-300 hover:text-blue-200">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-start">
                              <span className="inline-block w-5 text-right mr-2">{index + 1}.</span>
                              <span className="underline">{link.title}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-lg font-medium text-white mb-3">Analytics</h4>
                      {episode.dateSent ? (
                        <div className="grid grid-cols-3 gap-4">
                          <Card className="bg-blue-800/50 border-blue-700">
                            <CardContent className="p-4 text-center">
                              <p className="text-sm text-blue-300">Opens</p>
                              <p className="text-2xl font-bold text-white">{episode.stats.opens}</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-blue-800/50 border-blue-700">
                            <CardContent className="p-4 text-center">
                              <p className="text-sm text-blue-300">Clicks</p>
                              <p className="text-2xl font-bold text-white">{episode.stats.clicks}</p>
                            </CardContent>
                          </Card>
                          <Card className="bg-blue-800/50 border-blue-700">
                            <CardContent className="p-4 text-center">
                              <p className="text-sm text-blue-300">Unsubscribes</p>
                              <p className="text-2xl font-bold text-white">{episode.stats.unsubscribes}</p>
                            </CardContent>
                          </Card>
                        </div>
                      ) : (
                        <p className="text-blue-300 italic">No analytics available for drafts</p>
                      )}

                      {episode.dateSent && (
                        <div className="mt-4">
                          <Link href={`/admin/newsletter/analytics?id=${episode.id}`} passHref>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-white/20 text-white hover:bg-white/20"
                            >
                              <BarChart className="h-4 w-4 mr-2" />
                              View Detailed Analytics
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))
        ) : (
          <Card className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
            <CardContent className="p-6 text-center">
              <p className="text-white">No episodes found matching your search criteria.</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-blue-900 text-white border-blue-700">
          <DialogHeader>
            <DialogTitle>Delete Episode</DialogTitle>
            <DialogDescription className="text-blue-300">
              Are you sure you want to delete this newsletter episode? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-white/20 text-white hover:bg-white/20"
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEpisode} className="bg-red-600 hover:bg-red-700">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

