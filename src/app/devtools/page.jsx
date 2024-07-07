'use client'

import { SimpleLayout } from '@/components/SimpleLayout'
import { getTools } from '@/lib/getTools'
import DevToolSearchFilter from '@/components/DevToolSearchFilter'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { track } from '@vercel/analytics'
import { Button } from "@/components/ui/button";
import { DiffIcon, SearchIcon } from "lucide-react";

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
          <div key={index} className="flex flex-col dark:bg-zinc-800 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{tool.name}</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">{tool.description}</p>
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
          </div>
        ))}
      </div>
    </SimpleLayout>
  )
}