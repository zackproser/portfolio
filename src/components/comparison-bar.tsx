"use client"

import { useState } from "react"
import { useTools } from "@/components/tools-provider"
import { Button } from "@/components/ui/button"
import { X, Maximize2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export function ComparisonBar() {
  const { tools, selectedTools, removeFromComparison, clearComparison } = useTools()
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  // Update visibility based on selected tools
  if (selectedTools.length === 0 && isVisible) {
    setIsVisible(false)
  } else if (selectedTools.length > 0 && !isVisible) {
    setIsVisible(true)
  }

  const selectedToolDetails = tools.filter((tool) => selectedTools.includes(tool.id))

  const handleCompare = () => {
    router.push(`/comparison?tools=${selectedTools.join(",")}`)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-600/95 to-blue-800/95 dark:from-blue-800/95 dark:to-blue-900/95 backdrop-blur-sm border-t border-blue-300/50 dark:border-blue-700 shadow-lg p-4 z-10">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="font-medium text-white">
            Compare ({selectedTools.length}/{selectedTools.length >= 4 ? "max" : "4"}):
          </span>
          <div className="flex gap-2">
            {selectedToolDetails.map((tool) => (
              <div key={tool.id} className="flex items-center bg-white/10 dark:bg-white/10 rounded-md px-3 py-1">
                <div className="w-5 h-5 rounded overflow-hidden mr-2 bg-white/90 flex items-center justify-center">
                  {tool.logoUrl ? (
                    <Image
                      src={tool.logoUrl}
                      alt={`${tool.name} logo`}
                      width={20}
                      height={20}
                      className="object-contain p-0.5"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs">
                      {tool.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-sm text-white mr-2">{tool.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 text-white/70 hover:text-white hover:bg-white/10"
                  onClick={() => removeFromComparison(tool.id)}
                >
                  <X className="h-3 w-3" />
                  <span className="sr-only">Remove {tool.name}</span>
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearComparison}
            className="text-white/80 hover:text-white hover:bg-white/10"
          >
            Clear all
          </Button>
          <Button
            onClick={handleCompare}
            disabled={selectedTools.length < 2}
            className="bg-white text-blue-700 hover:bg-white/90 dark:text-blue-900 disabled:bg-white/30 disabled:text-blue-700/50 dark:disabled:text-blue-900/50"
          >
            <Maximize2 className="h-4 w-4 mr-2" />
            Compare
          </Button>
        </div>
      </div>
    </div>
  )
} 