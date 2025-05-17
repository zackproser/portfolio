"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ContentCard } from "@/components/ContentCard"
import type { ArticleWithSlug } from "@/types"

interface BlogClientProps {
  articles: ArticleWithSlug[]
  years: string[]
  allTags: string[]
}

export default function BlogClient({ articles, years, allTags }: BlogClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedTag, setSelectedTag] = useState("")

  const filteredArticles = articles.filter((article) => {
    const term = searchTerm.toLowerCase()
    const matchesSearch = term
      ? (article.title?.toLowerCase().includes(term) ||
         article.description?.toLowerCase().includes(term))
      : true
    const matchesYear = selectedYear && selectedYear !== "All Years"
      ? article.date.startsWith(selectedYear)
      : true
    const matchesTag = selectedTag && selectedTag !== "All Tags"
      ? Array.isArray(article.tags) && article.tags.includes(selectedTag)
      : true
    return matchesSearch && matchesYear && matchesTag
  })

  return (
    <div>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger>
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Years">All Years</SelectItem>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedTag} onValueChange={setSelectedTag}>
          <SelectTrigger>
            <SelectValue placeholder="Tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All Tags">All Tags</SelectItem>
            {allTags.map((tag) => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="mx-auto mt-16 grid max-w-none grid-cols-1 gap-x-8 gap-y-16 lg:grid-cols-3">
          {filteredArticles.map((article, index) => (
            <ContentCard key={index} article={article} />
          ))}
        </div>
      </div>
    </div>
  )
}

