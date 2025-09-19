"use client"

import { createContext, useState, useContext, ReactNode, useEffect } from "react"
import type { ManifestTool } from "@/actions/tool-actions"
import { getAllTools } from "@/actions/tool-actions"

type ToolsContextType = {
  tools: ManifestTool[]
  filteredTools: ManifestTool[]
  selectedTools: string[]
  selectedCategories: string[]
  searchTerm: string
  categories: { id: string; name: string }[]
  addToComparison: (toolId: string) => void
  removeFromComparison: (toolId: string) => void
  toggleToolSelection: (toolId: string) => void
  clearComparison: () => void
  clearSelectedTools: () => void
  isInComparison: (toolId: string) => boolean
  setFilteredTools: (tools: ManifestTool[]) => void
  setSearchTerm: (term: string) => void
  setSelectedCategories: (categories: string[]) => void
  getToolById: (id: string) => ManifestTool | undefined
}

const ToolsContext = createContext<ToolsContextType | undefined>(undefined)

export function ToolsProvider({ children }: { children: ReactNode }) {
  const [tools, setTools] = useState<ManifestTool[]>([])
  const [filteredTools, setFilteredTools] = useState<ManifestTool[]>([])
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  // Fetch tools on component mount
  useEffect(() => {
    const fetchTools = async () => {
      const allTools = await getAllTools()
      setTools(allTools)
      setFilteredTools(allTools)
    }
    
    fetchTools()
  }, [])

  // Filter tools based on search term and selected categories
  useEffect(() => {
    let filtered = [...tools]
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (tool) =>
          tool.name.toLowerCase().includes(term) ||
          (tool.description && tool.description.toLowerCase().includes(term)) ||
          tool.category.toLowerCase().includes(term) ||
          tool.features?.some((feature) => feature.toLowerCase().includes(term)) ||
          tool.pros?.some((pro) => pro.toLowerCase().includes(term)) ||
          tool.cons?.some((con) => con.toLowerCase().includes(term))
      )
    }
    
    // Apply category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((tool) => selectedCategories.includes(tool.category))
    }
    
    setFilteredTools(filtered)
  }, [searchTerm, selectedCategories, tools])

  // Create categories list
  const categories = Array.from(new Set(tools.map((tool) => tool.category)))
    .map((category) => ({
      id: category,
      name: tools.find(tool => tool.category === category)?.category || category,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  const addToComparison = (toolId: string) => {
    if (selectedTools.includes(toolId) || selectedTools.length >= 4) return
    setSelectedTools((prev) => [...prev, toolId])
  }

  const removeFromComparison = (toolId: string) => {
    setSelectedTools((prev) => prev.filter((id) => id !== toolId))
  }

  const toggleToolSelection = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      removeFromComparison(toolId)
    } else if (selectedTools.length < 4) {
      addToComparison(toolId)
    }
  }

  const clearComparison = () => {
    setSelectedTools([])
  }

  const clearSelectedTools = () => {
    setSelectedTools([])
  }

  const isInComparison = (toolId: string) => {
    return selectedTools.includes(toolId)
  }

  const getToolById = (id: string) => {
    return tools.find(tool => tool.id === id)
  }

  return (
    <ToolsContext.Provider
      value={{
        tools,
        filteredTools,
        selectedTools,
        selectedCategories,
        searchTerm,
        categories,
        addToComparison,
        removeFromComparison,
        toggleToolSelection,
        clearComparison,
        clearSelectedTools,
        isInComparison,
        setFilteredTools,
        setSearchTerm,
        setSelectedCategories,
        getToolById
      }}
    >
      {children}
    </ToolsContext.Provider>
  )
}

export function useTools() {
  const context = useContext(ToolsContext)
  if (context === undefined) {
    throw new Error("useTools must be used within a ToolsProvider")
  }
  return context
} 