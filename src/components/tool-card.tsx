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
    <Card className="h-full flex flex-col overflow-hidden group hover:shadow-lg transition-all duration-300 border-parchment-200 dark:border-slate-700 hover:border-burnt-400 dark:hover:border-amber-500 dark:bg-slate-800">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-burnt-400 to-burnt-500 dark:from-amber-400 dark:to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md overflow-hidden flex items-center justify-center bg-white shadow-sm border border-parchment-200 dark:border-slate-700 dark:bg-slate-700">
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat p-1"
                style={{ backgroundImage: `url(${tool.logoUrl || "/placeholder.svg?height=40&width=40"})` }}
                role="img"
                aria-label={`${tool.name} logo`}
              />
            </div>
            <CardTitle className="text-lg text-charcoal-50 dark:text-parchment-100">{tool.name}</CardTitle>
          </div>
          {tool.reviewCount && tool.reviewUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="text-parchment-600 dark:text-slate-300 hover:text-burnt-400 dark:hover:text-amber-400 hover:bg-parchment-100 dark:hover:bg-slate-700 px-2 py-1 h-auto"
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
            className="bg-burnt-400/10 dark:bg-amber-500/10 text-burnt-500 dark:text-amber-400 hover:bg-burnt-400/20 dark:hover:bg-amber-500/20"
          >
            {tool.category}
          </Badge>
          {tool.pricing && (
            <Badge variant="outline" className="text-parchment-600 dark:text-slate-300 border-parchment-300 dark:border-slate-600">
              {tool.pricing}
            </Badge>
          )}
        </div>
        <p className="text-sm text-parchment-600 dark:text-slate-400 mb-3 line-clamp-3">{tool.description}</p>
      </CardContent>

      <CardFooter className="pt-2 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewDetails}
          className="text-burnt-400 dark:text-amber-400 hover:text-burnt-500 dark:hover:text-amber-300 hover:bg-burnt-400/10 dark:hover:bg-amber-500/10"
        >
          Details
        </Button>

        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-parchment-600 dark:text-slate-300 hover:text-charcoal-50 dark:hover:text-white hover:bg-parchment-100 dark:hover:bg-slate-700" asChild>
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
                ? "bg-burnt-400 hover:bg-burnt-500 dark:bg-amber-500 dark:hover:bg-amber-400 text-white border-none"
                : "text-burnt-400 dark:text-amber-400 border-burnt-400/30 dark:border-amber-500/30 hover:bg-burnt-400/10 dark:hover:bg-amber-500/10"
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