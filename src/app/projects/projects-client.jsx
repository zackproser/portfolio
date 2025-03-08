"use client"

import { useState, useEffect } from "react"
import { Search, Code2, ArrowUpRight } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"

// Import company logos
import logoCloudflare from '@/images/logos/cloudflare.svg'
import logoCloudmark from '@/images/logos/cloudmark.png'
import logoGrunty from '@/images/logos/grunty.png'
import logoPinecone from '@/images/logos/pinecone-logo.png'
import logoBrightcontext from '@/images/logos/brightcontext.png'
import logoWorkOS from '@/images/logos/workos.svg'

// Map company names to their logo images
const companyLogos = {
  'Pinecone': logoPinecone,
  'WorkOS': logoWorkOS,
  'Gruntwork': logoGrunty,
  'Cloudflare': logoCloudflare,
  'Cloudmark': logoCloudmark,
  'BrightContext': logoBrightcontext,
}

export default function ProjectsClient({ projects, categories, allTags, companies }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [view, setView] = useState("grid")

  useEffect(() => {
    let filtered = projects

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter((project) => project.category === selectedCategory)
    }

    // Apply company filter
    if (selectedCompany && selectedCompany !== "All Companies") {
      filtered = filtered.filter((project) => project.company === selectedCompany)
    }

    // Apply tag filter
    if (selectedTag && selectedTag !== "All Tags") {
      filtered = filtered.filter((project) => project.stacks.includes(selectedTag))
    }

    setFilteredProjects(filtered)
  }, [searchTerm, selectedCategory, selectedCompany, selectedTag, projects])

  const resetFilters = () => {
    setSearchTerm("")
    setSelectedCategory("")
    setSelectedCompany("")
    setSelectedTag("")
  }

  return (
    <div className="w-full">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Projects</h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl">
            A collection of projects I&apos;ve built, contributed to, or maintained over the years.
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
                placeholder="Search projects..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectItem value="All Companies">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectValue placeholder="Technology" />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
                <SelectItem value="All Tags">All Technologies</SelectItem>
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
              {filteredProjects.length} projects found
            </span>
          </div>
        </div>

        {/* View selection and projects display */}
        <div className="space-y-8">
          {/* All projects */}
          <section>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">All Projects</h2>

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
                    {filteredProjects.map((project) => (
                      <Card
                        key={project.name}
                        className="overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col bg-white dark:bg-slate-800"
                      >
                        <div className="relative h-48">
                          <Image
                            src={project.logo}
                            alt={project.name}
                            fill
                            className="object-cover"
                          />
                          {project.company && companyLogos[project.company] && (
                            <div className="absolute top-2 right-2">
                              <div className="relative flex h-8 w-8 flex-none items-center justify-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                                <Image
                                  src={companyLogos[project.company]}
                                  alt={project.company}
                                  className="h-5 w-5"
                                  unoptimized
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-xl font-bold hover:text-primary transition-colors">
                            <Link href={project.link} className="flex items-center gap-1">
                              {project.name}
                              <ArrowUpRight size={16} className="inline-block opacity-70" />
                            </Link>
                          </CardTitle>
                          <CardDescription className="text-sm mt-2 min-h-[60px]">
                            {project.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 flex-grow">
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.stacks.map((stack) => (
                              <Badge key={stack} variant="secondary" className="text-xs">
                                {stack}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="pt-0 text-sm text-slate-600 dark:text-slate-400 flex items-center">
                          <Code2 size={14} className="mr-1" />
                          {project.category}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="list" className="mt-4">
                  <div className="space-y-3">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.name}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-sm transition-shadow"
                      >
                        <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                          <Image
                            src={project.logo}
                            alt={project.name}
                            fill
                            className="object-cover rounded-lg"
                          />
                          {project.company && companyLogos[project.company] && (
                            <div className="absolute top-2 right-2">
                              <div className="relative flex h-8 w-8 flex-none items-center justify-center shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5 dark:border dark:border-zinc-700/50 dark:bg-zinc-800 dark:ring-0">
                                <Image
                                  src={companyLogos[project.company]}
                                  alt={project.company}
                                  className="h-5 w-5"
                                  unoptimized
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <Link href={project.link}>
                            <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors flex items-center gap-1">
                              {project.name}
                              <ArrowUpRight size={16} className="inline-block opacity-70" />
                            </h3>
                          </Link>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {project.stacks.map((stack) => (
                                <Badge key={stack} variant="secondary" className="text-xs">
                                  {stack}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-sm text-slate-500 dark:text-slate-400 flex items-center">
                              <Code2 size={14} className="mr-1" />
                              {project.category}
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