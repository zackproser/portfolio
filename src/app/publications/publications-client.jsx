"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, BookOpen, ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PublicationsClient({ publications, categories, years, allTags }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [filteredPublications, setFilteredPublications] = useState(publications)
  const [view, setView] = useState("grid")

  useEffect(() => {
    let filtered = publications

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (pub) =>
          pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.publisher.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter((pub) => pub.category === selectedCategory)
    }

    // Apply year filter
    if (selectedYear && selectedYear !== "All Years") {
      filtered = filtered.filter((pub) => pub.date.includes(selectedYear))
    }

    // Apply tag filter
    if (selectedTag && selectedTag !== "All Tags") {
      filtered = filtered.filter((pub) => pub.tags.includes(selectedTag))
    }

    setFilteredPublications(filtered)
  }, [searchTerm, selectedCategory, selectedYear, selectedTag, publications])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedYear("")
    setSelectedTag("")
  }

  return (
    <div className="w-full">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Publications</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            A collection of articles, papers, and blog posts on AI, engineering, and modern software development.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and filters */}
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search publications..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white dark:bg-slate-800">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="bg-white dark:bg-slate-800">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Years">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="bg-white dark:bg-slate-800">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Tags">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-between items-center mt-4">
            <Button variant="outline" size="sm" onClick={resetFilters} className="text-slate-600 dark:text-slate-400">
              Reset Filters
            </Button>
            <span className="text-sm text-slate-500 dark:text-slate-400">
              {filteredPublications.length} publications found
            </span>
          </div>
        </div>

        {/* View selection and publications display */}
        <div className="space-y-8">
          {/* All publications */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">All Publications</h2>

            <div className="flex items-center justify-end gap-2 mb-4">
              <span className="text-sm text-slate-500 dark:text-slate-400">View:</span>
              <Tabs value={view} onValueChange={setView} className="w-full">
                <div className="flex justify-end">
                  <TabsList className="grid w-[160px] grid-cols-2">
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="grid" className="mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPublications.map((publication) => (
                      <Card
                        key={publication.id}
                        className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col bg-white dark:bg-slate-800"
                      >
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <Badge variant="outline" className="mb-2">
                              {publication.category}
                            </Badge>
                            <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
                              <Calendar size={14} className="mr-1" />
                              {publication.date}
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold hover:text-primary transition-colors">
                            <a href={publication.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                              {publication.title}
                              <ArrowUpRight size={16} className="inline-block opacity-70" />
                            </a>
                          </CardTitle>
                          <CardDescription className="text-sm line-clamp-2 mt-1">
                            {publication.abstract}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                          <div className="flex flex-wrap gap-1 mt-2">
                            {publication.tags.map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 text-sm text-slate-600 dark:text-slate-400 flex items-center">
                          <BookOpen size={14} className="mr-1" />
                          {publication.publisher}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="mt-4">
                  <div className="space-y-3">
                    {filteredPublications.map((publication) => (
                      <div
                        key={publication.id}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {publication.category}
                            </Badge>
                            <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {publication.date}
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold mb-1">
                            <a
                              href={publication.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary transition-colors flex items-center gap-1"
                            >
                              {publication.title}
                              <ArrowUpRight size={16} className="inline-block opacity-70" />
                            </a>
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2 line-clamp-1">
                            {publication.abstract}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {publication.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                              <BookOpen size={14} className="mr-1" />
                              {publication.publisher}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
} 