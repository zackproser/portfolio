"use client"

import { useState, useEffect } from "react"
import { useTheme } from 'next-themes'
import { Search, Code2, ArrowUpRight, Github, BookOpen, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import Link from "next/link"

// Import company logos
const logoCloudflare = 'https://zackproser.b-cdn.net/images/logos/cloudflare.svg'
const logoCloudmark = 'https://zackproser.b-cdn.net/images/logos/cloudmark.png'
const logoGrunty = 'https://zackproser.b-cdn.net/images/logos/grunty.png'
const logoPinecone = 'https://zackproser.b-cdn.net/images/logos/pinecone-logo.png'
const logoBrightcontext = 'https://zackproser.b-cdn.net/images/logos/brightcontext.png'
const logoWorkOS = 'https://zackproser.b-cdn.net/images/logos/workos.svg'

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
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [filteredProjects, setFilteredProjects] = useState(projects)
  const [view, setView] = useState("grid")

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === 'dark'

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

  // Get primary link for a project (prefer blogLink if available, else link)
  const getPrimaryLink = (project) => {
    return project.blogLink || project.link
  }

  // Check if link is external
  const isExternal = (url) => url.startsWith('http')

  return (
    <div className={`min-h-screen transition-colors duration-500 ${
      isDark
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950'
        : 'bg-gradient-to-b from-parchment-50 via-parchment-100 to-parchment-200'
    }`}>
      {/* Hero Header */}
      <header className={`border-b sticky top-16 z-10 transition-colors duration-500 ${
        isDark
          ? 'bg-slate-900/95 backdrop-blur-sm border-slate-700'
          : 'bg-parchment-100/95 backdrop-blur-sm border-parchment-300'
      }`}>
        <div className="container mx-auto px-4 py-6">
          <h1 className={`font-serif text-4xl font-bold mb-2 ${
            isDark ? '!text-amber-400' : '!text-burnt-400'
          }`}>
            Projects
          </h1>
          <p className={`max-w-2xl ${
            isDark ? 'text-slate-300' : 'text-parchment-600'
          }`}>
            A collection of projects I&apos;ve built, contributed to, or maintained over the years.
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and filters */}
        <div className={`rounded-xl shadow-sm p-4 mb-8 transition-colors duration-500 ${
          isDark
            ? 'bg-slate-800/60 border border-slate-700'
            : 'bg-white border border-parchment-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDark ? 'text-slate-400' : 'text-parchment-400'
              }`} size={18} />
              <Input
                placeholder="Search projects..."
                className={`pl-10 ${
                  isDark
                    ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400'
                    : 'bg-parchment-50 border-parchment-200 text-charcoal-50 placeholder:text-parchment-400'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className={
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-parchment-50 border-parchment-200 text-charcoal-50'
              }>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className={
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-parchment-200'
              }>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
              <SelectTrigger className={
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-parchment-50 border-parchment-200 text-charcoal-50'
              }>
                <SelectValue placeholder="Company" />
              </SelectTrigger>
              <SelectContent className={
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-parchment-200'
              }>
                <SelectItem value="All Companies">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className={
                isDark
                  ? 'bg-slate-700 border-slate-600 text-white'
                  : 'bg-parchment-50 border-parchment-200 text-charcoal-50'
              }>
                <SelectValue placeholder="Technology" />
              </SelectTrigger>
              <SelectContent className={
                isDark
                  ? 'bg-slate-800 border-slate-700'
                  : 'bg-white border-parchment-200'
              }>
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
            <Button
              variant="outline"
              size="sm"
              onClick={resetFilters}
              className={
                isDark
                  ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                  : 'border-parchment-300 text-parchment-600 hover:bg-parchment-100'
              }
            >
              Reset Filters
            </Button>
            <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>
              {filteredProjects.length} projects found
            </span>
          </div>
        </div>

        {/* View selection and projects display */}
        <div className="space-y-8">
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-semibold ${
                isDark ? 'text-white' : 'text-charcoal-50'
              }`}>
                All Projects
              </h2>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-parchment-500'}`}>View:</span>
                <Tabs value={view} onValueChange={setView}>
                  <TabsList className={
                    isDark
                      ? 'bg-slate-800 border border-slate-700'
                      : 'bg-parchment-100 border border-parchment-200'
                  }>
                    <TabsTrigger value="grid" className={
                      isDark
                        ? 'data-[state=active]:bg-amber-500 data-[state=active]:text-white'
                        : 'data-[state=active]:bg-burnt-400 data-[state=active]:text-white'
                    }>Grid</TabsTrigger>
                    <TabsTrigger value="list" className={
                      isDark
                        ? 'data-[state=active]:bg-amber-500 data-[state=active]:text-white'
                        : 'data-[state=active]:bg-burnt-400 data-[state=active]:text-white'
                    }>List</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            {view === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.name}
                    href={getPrimaryLink(project)}
                    target={isExternal(getPrimaryLink(project)) ? '_blank' : undefined}
                    rel={isExternal(getPrimaryLink(project)) ? 'noopener noreferrer' : undefined}
                    className="group"
                  >
                    <Card className={`overflow-hidden h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                      isDark
                        ? 'bg-slate-800/60 border-slate-700 hover:border-amber-500/50'
                        : 'bg-white border-parchment-200 hover:border-burnt-400/50'
                    }`}>
                      <div className="relative h-48">
                        <Image
                          src={project.logo}
                          alt={project.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {project.company && companyLogos[project.company] && (
                          <div className="absolute top-2 right-2">
                            <div className={`relative flex h-8 w-8 items-center justify-center rounded-lg shadow-md ${
                              isDark ? 'bg-slate-800 ring-1 ring-slate-700' : 'bg-white ring-1 ring-parchment-200'
                            }`}>
                              <Image
                                src={companyLogos[project.company]}
                                alt={project.company}
                                className="h-5 w-5"
                                unoptimized
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        )}
                        {/* Link type indicator */}
                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium ${
                          isDark ? 'bg-slate-800/90 text-slate-300' : 'bg-white/90 text-parchment-600'
                        }`}>
                          {project.blogLink ? (
                            <span className="flex items-center gap-1">
                              <BookOpen size={12} />
                              Article
                            </span>
                          ) : project.link.includes('github.com') ? (
                            <span className="flex items-center gap-1">
                              <Github size={12} />
                              GitHub
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <ExternalLink size={12} />
                              Project
                            </span>
                          )}
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className={`text-xl font-bold transition-colors ${
                          isDark ? 'text-white group-hover:text-amber-400' : 'text-charcoal-50 group-hover:text-burnt-400'
                        }`}>
                          {project.name}
                          <ArrowUpRight size={16} className={`inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isDark ? 'text-amber-400' : 'text-burnt-400'
                          }`} />
                        </CardTitle>
                        <CardDescription className={`text-sm mt-2 min-h-[60px] ${
                          isDark ? 'text-slate-300' : 'text-parchment-600'
                        }`}>
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.stacks.slice(0, 4).map((stack) => (
                            <Badge key={stack} variant="secondary" className={`text-xs ${
                              isDark
                                ? 'bg-slate-700 text-slate-300 border-slate-600'
                                : 'bg-parchment-100 text-parchment-600 border-parchment-200'
                            }`}>
                              {stack}
                            </Badge>
                          ))}
                          {project.stacks.length > 4 && (
                            <Badge variant="secondary" className={`text-xs ${
                              isDark
                                ? 'bg-slate-700 text-slate-300 border-slate-600'
                                : 'bg-parchment-100 text-parchment-600 border-parchment-200'
                            }`}>
                              +{project.stacks.length - 4}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className={`pt-0 text-sm flex items-center justify-between ${
                        isDark ? 'text-slate-400' : 'text-parchment-500'
                      }`}>
                        <span className="flex items-center">
                          <Code2 size={14} className="mr-1" />
                          {project.category}
                        </span>
                        {project.blogLink && project.link && (
                          <a
                            href={project.link}
                            target={isExternal(project.link) ? '_blank' : undefined}
                            rel={isExternal(project.link) ? 'noopener noreferrer' : undefined}
                            onClick={(e) => e.stopPropagation()}
                            className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                              isDark
                                ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                : 'bg-parchment-100 hover:bg-parchment-200 text-parchment-600'
                            }`}
                          >
                            {project.link.includes('github.com') ? <Github size={12} /> : <ExternalLink size={12} />}
                            {project.link.includes('github.com') ? 'Code' : 'Project'}
                          </a>
                        )}
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredProjects.map((project) => (
                  <Link
                    key={project.name}
                    href={getPrimaryLink(project)}
                    target={isExternal(getPrimaryLink(project)) ? '_blank' : undefined}
                    rel={isExternal(getPrimaryLink(project)) ? 'noopener noreferrer' : undefined}
                    className="group block"
                  >
                    <div className={`flex flex-col md:flex-row gap-4 p-4 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                      isDark
                        ? 'bg-slate-800/60 border border-slate-700 hover:border-amber-500/50'
                        : 'bg-white border border-parchment-200 hover:border-burnt-400/50'
                    }`}>
                      <div className="relative w-full md:w-48 h-48 flex-shrink-0">
                        <Image
                          src={project.logo}
                          alt={project.name}
                          fill
                          className="object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                        />
                        {project.company && companyLogos[project.company] && (
                          <div className="absolute top-2 right-2">
                            <div className={`relative flex h-8 w-8 items-center justify-center rounded-lg shadow-md ${
                              isDark ? 'bg-slate-800 ring-1 ring-slate-700' : 'bg-white ring-1 ring-parchment-200'
                            }`}>
                              <Image
                                src={companyLogos[project.company]}
                                alt={project.company}
                                className="h-5 w-5"
                                unoptimized
                                width={20}
                                height={20}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className={`text-lg font-semibold mb-2 ${
                          isDark ? 'text-white group-hover:text-amber-400' : 'text-charcoal-50 group-hover:text-burnt-400'
                        } transition-colors`}>
                          {project.name}
                          <ArrowUpRight size={16} className={`inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                            isDark ? 'text-amber-400' : 'text-burnt-400'
                          }`} />
                        </h3>
                        {/* Link type indicator */}
                        <div className={`inline-flex items-center gap-1 text-xs font-medium mb-3 px-2 py-1 rounded ${
                          isDark ? 'bg-slate-700 text-slate-300' : 'bg-parchment-100 text-parchment-600'
                        }`}>
                          {project.blogLink ? (
                            <>
                              <BookOpen size={12} />
                              Read Article
                            </>
                          ) : project.link.includes('github.com') ? (
                            <>
                              <Github size={12} />
                              View on GitHub
                            </>
                          ) : (
                            <>
                              <ExternalLink size={12} />
                              View Project
                            </>
                          )}
                        </div>
                        <p className={`text-sm mb-4 leading-relaxed ${
                          isDark ? 'text-slate-300' : 'text-parchment-600'
                        }`}>
                          {project.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {project.stacks.map((stack) => (
                              <Badge key={stack} variant="secondary" className={`text-xs ${
                                isDark
                                  ? 'bg-slate-700 text-slate-300 border-slate-600'
                                  : 'bg-parchment-100 text-parchment-600 border-parchment-200'
                              }`}>
                                {stack}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-3">
                            {project.blogLink && project.link && (
                              <a
                                href={project.link}
                                target={isExternal(project.link) ? '_blank' : undefined}
                                rel={isExternal(project.link) ? 'noopener noreferrer' : undefined}
                                onClick={(e) => e.stopPropagation()}
                                className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                                  isDark
                                    ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                    : 'bg-parchment-100 hover:bg-parchment-200 text-parchment-600'
                                }`}
                              >
                                {project.link.includes('github.com') ? <Github size={12} /> : <ExternalLink size={12} />}
                                {project.link.includes('github.com') ? 'Code' : 'Project'}
                              </a>
                            )}
                            <span className={`text-sm flex items-center ${
                              isDark ? 'text-slate-400' : 'text-parchment-500'
                            }`}>
                              <Code2 size={14} className="mr-1" />
                              {project.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
