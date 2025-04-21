"use client"

import type { Tool } from "@prisma/client"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Plus, Check, MessageSquare } from "lucide-react"
import { useTools } from "@/components/tools-provider"
import Image from "next/image"

interface ToolCardProps {
  tool: Tool
  onViewDetails: () => void
}

export function ToolCard({ tool, onViewDetails }: ToolCardProps) {
  const { toggleToolSelection, selectedTools } = useTools()
  const isSelected = selectedTools.includes(tool.id)

  return (
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-500 dark:bg-gray-800">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center bg-white shadow-sm border border-slate-100 dark:border-gray-700 dark:bg-gray-700">
              <div 
                className="w-full h-full bg-cover bg-center bg-no-repeat p-1"
                style={{ backgroundImage: `url(${tool.logoUrl || "/placeholder.svg?height=40&width=40"})` }}
                role="img"
                aria-label={`${tool.name} logo`}
              />
            </div>
            <CardTitle className="text-lg dark:text-white">{tool.name}</CardTitle>
          </div>
          {tool.reviewCount && tool.reviewUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700 px-2 py-1 h-auto"
              asChild
            >
              <a href={tool.reviewUrl} target="_blank" rel="noopener noreferrer">
                <MessageSquare className="h-3 w-3 mr-1" />
                {tool.reviewCount}
              </a>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow">
        <div className="mb-3 flex flex-wrap gap-1">
          <Badge
            variant="secondary"
            className="bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 text-blue-700 dark:text-blue-300 hover:from-blue-200 hover:to-blue-300 dark:hover:from-blue-800 dark:hover:to-blue-700"
          >
            {tool.category}
          </Badge>
          {tool.pricing && (
            <Badge variant="outline" className="text-slate-600 dark:text-slate-300 dark:border-gray-600">
              {tool.pricing}
            </Badge>
          )}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-3">{tool.description}</p>
      </CardContent>

      <CardFooter className="pt-2 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetails}
          className="text-blue-700 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
        >
          Details
        </Button>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-gray-700" asChild>
            <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Visit
            </a>
          </Button>

          <Button
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => toggleToolSelection(tool.id)}
            className={
              isSelected
                ? "bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-500 dark:to-blue-700 hover:from-blue-700 hover:to-blue-900 dark:hover:from-blue-600 dark:hover:to-blue-800 text-white border-none"
                : "text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            }
          >
            {isSelected ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Compare
              </>
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 