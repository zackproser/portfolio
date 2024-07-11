'use client'

import { SimpleLayout } from '@/components/SimpleLayout'
import { getTools } from '@/lib/getTools'
import DevToolSearchFilter from '@/components/DevToolSearchFilter'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { Button } from "@/components/ui/button";
import { DiffIcon, SearchIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from 'next/image'
import { CodeIcon } from 'lucide-react' // Import a default icon
import { getLogoById } from '@/lib/logoImports'

export default function DevToolsIndex() {
  const router = useRouter();
  const allTools = getTools();
  const [filteredTools, setFilteredTools] = useState(allTools);
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilter = (filtered, term) => {
    setFilteredTools(filtered);
    setSearchTerm(term);
  };

  const handleReset = () => {
    setFilteredTools(allTools);
    setSearchTerm('');
  };

  const handleCompareClick = (toolName) => {
    track('compare_click', { tool: toolName });
    router.push(`/devtools/compare?tools=${encodeURIComponent(toolName)}`);
  };

  const handleDetailsClick = (toolName) => {
    track('details_click', { tool: toolName });
    router.push(`/devtools/detail/${encodeURIComponent(toolName)}`);
  };

  return (
    <SimpleLayout
      title="AI-Assisted Developer Tools"
      intro="Compare different AI-assisted developer tools to find the best fit for your needs"
    >
      <DevToolSearchFilter 
        tools={allTools} 
        onFilter={handleFilter} 
        onReset={handleReset}
        searchTerm={searchTerm}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool, index) => (
          <Card key={index} className="flex flex-col dark:bg-zinc-800">
            <CardHeader className="flex flex-row items-center space-x-4">
              {tool.name && getLogoById(tool.name) ? (
                <Image
                  src={getLogoById(tool.name)}
                  alt={`${tool.name} icon`}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <CodeIcon className="w-10 h-10 text-gray-400" />
              )}
              <CardTitle>{tool.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-gray-600 dark:text-zinc-400">{tool.description}</p>
            </CardContent>
            <div className="p-4 mt-auto flex justify-between">
              <Button
                variant="primary"
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => handleCompareClick(tool.name)}
              >
                <DiffIcon className="w-4 h-4 mr-2" />
                Compare
              </Button>
              <Button
                variant="secondary"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
                onClick={() => handleDetailsClick(tool.name)}
              >
                <SearchIcon className="w-4 h-4 mr-2" />
                Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </SimpleLayout>
  )
}