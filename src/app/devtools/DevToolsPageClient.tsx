'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { track } from '@vercel/analytics'
import { SimpleLayout } from '@/components/SimpleLayout'
import DevToolSearchFilter from '@/components/DevToolSearchFilter'
import { Button } from "@/components/ui/button"
import { DiffIcon, SearchIcon, CodeIcon } from "lucide-react"
import { getLogoById } from '@/lib/logoImports'
import heroImage from '@/images/ai-hacking.webp'

interface Tool {
  name: string
  description: string
}

interface DevToolsPageClientProps {
  initialTools: Tool[]
}

export default function DevToolsPageClient({ initialTools }: DevToolsPageClientProps) {
  const router = useRouter()
  const [filteredTools, setFilteredTools] = useState(initialTools)
  const [searchTerm, setSearchTerm] = useState('')

  const handleFilter = (filtered: Tool[], term: string) => {
    setFilteredTools(filtered)
    setSearchTerm(term)
  }

  const handleReset = () => {
    setFilteredTools(initialTools)
    setSearchTerm('')
  }

  const handleCompareClick = (toolName: string) => {
    track('compare_click', { tool: toolName })
    router.push(`/devtools/compare?tools=${encodeURIComponent(toolName)}`)
  }

  const handleDetailsClick = (toolName: string) => {
    track('details_click', { tool: toolName })
    router.push(`/devtools/detail/${encodeURIComponent(toolName)}`)
  }

  return (
    <SimpleLayout
      title="AI-Assisted Developer Tools"
      intro="Compare different AI-assisted developer tools to find the best fit for your needs"
    >
      <div className="relative w-full h-64 mb-8">
        <Image
          src={heroImage}
          alt="AI Hacking"
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
        />
      </div>
      <DevToolSearchFilter 
        tools={initialTools} 
        onFilter={handleFilter} 
        onReset={handleReset}
        searchTerm={searchTerm}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool, index) => (
          <article key={index} className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-800">
            <div className="p-6 flex-grow flex flex-col">
              <header className="flex items-center space-x-4 mb-4">
                {tool.name && getLogoById(tool.name) ? (
                  <Image
                    src={getLogoById(tool.name)}
                    alt={`${tool.name} icon`}
                    width={48}
                    height={48}
                    className="rounded-full"
                  />
                ) : (
                  <CodeIcon className="w-12 h-12 text-gray-400" />
                )}
                <h3 className="text-xl font-semibold text-zinc-800 dark:text-zinc-100">{tool.name}</h3>
              </header>
              <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 flex-grow">{tool.description}</p>
              <div className="flex justify-between mt-auto">
                <Button
                  variant="outline"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => handleCompareClick(tool.name)}
                >
                  <DiffIcon className="w-4 h-4 mr-2" />
                  Compare
                </Button>
                <Button
                  variant="outline"
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                  onClick={() => handleDetailsClick(tool.name)}
                >
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Details
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </SimpleLayout>
  )
}