"use client"

import { useState } from "react"
import { useTools } from "@/components/tools-provider"
import { ToolCard } from "@/components/tool-card"
import { ToolDetailModal } from "@/components/tool-detail-modal"
import { Sparkles } from "lucide-react"

export function ToolGrid() {
  const { filteredTools } = useTools()
  const [selectedToolId, setSelectedToolId] = useState<string | null>(null)

  return (
    <div>
      {filteredTools.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800/90 rounded-xl shadow-sm border border-slate-100 dark:border-gray-700">
          <Sparkles className="h-12 w-12 mx-auto text-slate-300 dark:text-blue-400/50 mb-4" />
          <p className="text-slate-500 dark:text-slate-300 text-lg">No tools found matching your criteria.</p>
          <p className="text-slate-400 dark:text-slate-400 mt-2">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <>
          <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
            {filteredTools.length} {filteredTools.length === 1 ? "Tool" : "Tools"} Found
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} onViewDetails={() => setSelectedToolId(tool.id)} />
            ))}
          </div>
        </>
      )}

      {selectedToolId && (
        <ToolDetailModal toolId={selectedToolId} isOpen={!!selectedToolId} onClose={() => setSelectedToolId(null)} />
      )}
    </div>
  )
} 