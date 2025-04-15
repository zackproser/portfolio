"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AddToolForm } from "@/components/admin/add-tool-form"
import { ToolsList } from "@/components/admin/tools-list"
import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ToolsAdminPage() {
  const [isAddingTool, setIsAddingTool] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button variant="outline" asChild className="mr-4 bg-white dark:bg-gray-900 dark:border-gray-700">
          <Link href="/admin">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-200">Manage Tools</h1>
      </div>

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
        <ToolsList />
      </div>
    </div>
  )
} 