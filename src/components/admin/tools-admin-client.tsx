'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AddToolForm } from '@/components/admin/add-tool-form'
import { ToolsList } from '@/components/admin/tools-list'
import { Plus } from 'lucide-react'
import type { Tool } from '@prisma/client'

interface ToolsAdminClientProps {
  initialTools: Tool[]
}

export function ToolsAdminClient({ initialTools }: ToolsAdminClientProps) {
  const [isAddingTool, setIsAddingTool] = useState(false)

  return (
    <>
      {isAddingTool ? (
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300">Add New Tool</h2>
            <Button variant="outline" onClick={() => setIsAddingTool(false)} className="bg-white dark:bg-gray-900 dark:border-gray-700">
              Cancel
            </Button>
          </div>
          <AddToolForm onSuccess={() => setIsAddingTool(false)} />
        </div>
      ) : (
        <Button 
          onClick={() => setIsAddingTool(true)} 
          className="mb-8 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 dark:from-blue-700 dark:to-blue-900 dark:hover:from-blue-600 dark:hover:to-blue-800 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Tool
        </Button>
      )}

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-6">All Tools</h2>
        <ToolsList initialTools={initialTools} />
      </div>
    </>
  )
} 