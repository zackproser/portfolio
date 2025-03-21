"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Mail,
  Calendar,
  Clock,
  Edit,
  Copy,
  Plus,
  Filter,
  ChevronDown,
  ChevronUp,
  FileText,
  Send,
  Archive,
} from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

interface NewsletterItem {
  id: string
  subject: string
  dateCreated: string
  dateSent?: string
  scheduledDate?: string
  status: "draft" | "scheduled" | "sent"
  links: any[]
}

interface NewsletterSidebarProps {
  currentId?: string
  onSelectNewsletter: (id: string) => void
  onCreateNewDraft: () => void
  onDuplicateNewsletter: (id: string) => void
}

export default function NewsletterSidebar({
  currentId,
  onSelectNewsletter,
  onCreateNewDraft,
  onDuplicateNewsletter,
}: NewsletterSidebarProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string[]>(["all"])
  const [newsletters, setNewsletters] = useState<NewsletterItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Mock data for demonstration
  const mockNewsletters: NewsletterItem[] = [
    {
      id: "1",
      subject: "Latest Web Development Trends - March 2025",
      dateCreated: "2025-03-15T10:30:00Z",
      dateSent: "2025-03-16T09:00:00Z",
      status: "sent",
      links: [
        { id: "101", title: "The Future of React in 2025" },
        { id: "102", title: "CSS Container Queries: A Complete Guide" },
      ],
    },
    {
      id: "2",
      subject: "AI Tools for Developers - February 2025",
      dateCreated: "2025-02-20T14:15:00Z",
      dateSent: "2025-02-22T09:00:00Z",
      status: "sent",
      links: [
        { id: "201", title: "Top 10 AI Coding Assistants" },
        { id: "202", title: "How to Use GPT-5 for Code Generation" },
      ],
    },
    {
      id: "3",
      subject: "DevOps Best Practices - April 2025",
      dateCreated: "2025-03-25T11:45:00Z",
      scheduledDate: "2025-04-01T09:00:00Z",
      status: "scheduled",
      links: [
        { id: "301", title: "Containerization Strategies for 2025" },
        { id: "302", title: "GitHub Actions vs. Jenkins: A Comparison" },
      ],
    },
    {
      id: "4",
      subject: "Frontend Performance Optimization",
      dateCreated: "2025-03-28T15:20:00Z",
      status: "draft",
      links: [{ id: "401", title: "Web Vitals: The Complete Guide" }],
    },
    {
      id: "5",
      subject: "Mobile Development Trends",
      dateCreated: "2025-03-29T09:10:00Z",
      status: "draft",
      links: [],
    },
  ]

  const handleStatusChange = (status: string) => {
    setSelectedStatus((prev) => {
      if (prev.includes(status)) {
        return prev.filter((s) => s !== status)
      } else {
        if (status === "all") {
          return ["all"]
        }
        const newStatus = prev.filter((s) => s !== "all").concat(status)
        return newStatus.length === 0 ? ["all"] : newStatus
      }
    })
  }

  const fetchNewsletters = () => {
    setIsLoading(true)

    // In a real implementation, this would be an API call
    setTimeout(() => {
      setNewsletters(mockNewsletters)
      setIsLoading(false)
    }, 500)
  }

  useEffect(() => {
    fetchNewsletters()
  }, [])

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const matchesSearch = searchTerm === "" || newsletter.subject.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = selectedStatus.includes("all") || selectedStatus.includes(newsletter.status)

    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "draft":
        return <Edit className="h-3 w-3" />
      case "scheduled":
        return <Calendar className="h-3 w-3" />
      case "sent":
        return <Send className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "scheduled":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "sent":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Mail className="h-4 w-4 mr-2 text-blue-300" />
          Newsletters
          <Button
            variant="outline"
            size="sm"
            onClick={onCreateNewDraft}
            className="ml-auto border-white/20 text-white hover:bg-white/20 h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search newsletters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/20 border-white/20 placeholder:text-white/50 text-white"
          />
        </div>

        <Collapsible open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/20">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Status
              {isFilterOpen ? <ChevronUp className="h-4 w-4 ml-auto" /> : <ChevronDown className="h-4 w-4 ml-auto" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2 p-2 bg-white/5 rounded-md">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-all"
                checked={selectedStatus.includes("all")}
                onCheckedChange={() => handleStatusChange("all")}
              />
              <label
                htmlFor="status-all"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                All
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-draft"
                checked={selectedStatus.includes("draft")}
                onCheckedChange={() => handleStatusChange("draft")}
              />
              <label
                htmlFor="status-draft"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Drafts
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-scheduled"
                checked={selectedStatus.includes("scheduled")}
                onCheckedChange={() => handleStatusChange("scheduled")}
              />
              <label
                htmlFor="status-scheduled"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Scheduled
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status-sent"
                checked={selectedStatus.includes("sent")}
                onCheckedChange={() => handleStatusChange("sent")}
              />
              <label
                htmlFor="status-sent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Sent
              </label>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <div className="mt-2">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner size={24} />
            </div>
          ) : filteredNewsletters.length === 0 ? (
            <div className="text-center py-4 text-white/70 text-sm">
              {searchTerm ? "No newsletters found" : "No newsletters available"}
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)]">
              <div className="space-y-2 pr-3">
                {filteredNewsletters.map((newsletter) => (
                  <div
                    key={newsletter.id}
                    className={`p-3 rounded-md hover:bg-white/10 transition-colors border ${
                      currentId === newsletter.id ? "border-blue-500 bg-blue-500/10" : "border-white/10"
                    } cursor-pointer`}
                    onClick={() => onSelectNewsletter(newsletter.id)}
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-white text-sm line-clamp-1">{newsletter.subject}</h4>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => e.stopPropagation()}
                            className="h-6 w-6 p-0 ml-2 text-white hover:bg-white/20"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-blue-900 border-blue-700 text-white">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectNewsletter(newsletter.id)
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              onDuplicateNewsletter(newsletter.id)
                            }}
                            className="cursor-pointer"
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Duplicate
                          </DropdownMenuItem>
                          {newsletter.status === "sent" && (
                            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="cursor-pointer" asChild>
                              <Link href={`/admin/newsletter/analytics?id=${newsletter.id}`}>
                                <Archive className="h-4 w-4 mr-2" />
                                View Analytics
                              </Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center mt-1 text-xs text-white/70">
                      <Badge variant="outline" className={`text-xs mr-2 ${getStatusColor(newsletter.status)}`}>
                        <span className="flex items-center">
                          {getStatusIcon(newsletter.status)}
                          <span className="ml-1">
                            {newsletter.status.charAt(0).toUpperCase() + newsletter.status.slice(1)}
                          </span>
                        </span>
                      </Badge>

                      {newsletter.status === "sent" && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(newsletter.dateSent)}
                        </span>
                      )}

                      {newsletter.status === "scheduled" && (
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(newsletter.scheduledDate)}
                        </span>
                      )}

                      {newsletter.status === "draft" && (
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(newsletter.dateCreated)}
                        </span>
                      )}
                    </div>

                    {newsletter.links.length > 0 && (
                      <div className="mt-2 text-xs text-white/70">
                        <p className="font-medium mb-1">{newsletter.links.length} items:</p>
                        <ul className="list-disc list-inside space-y-1">
                          {newsletter.links.slice(0, 2).map((link) => (
                            <li key={link.id} className="truncate">
                              {link.title}
                            </li>
                          ))}
                          {newsletter.links.length > 2 && <li>+{newsletter.links.length - 2} more</li>}
                        </ul>
                      </div>
                    )}
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

// Add the Checkbox component since it's used in the code
function Checkbox({ id, checked, onCheckedChange }: any) {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={() => onCheckedChange(!checked)}
        className="h-4 w-4 rounded border-white/20 bg-white/10 text-blue-600"
      />
    </div>
  )
}

