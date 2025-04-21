// Remove client-side imports
// import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { AddToolForm } from "@/components/admin/add-tool-form"
// import { ToolsList } from "@/components/admin/tools-list"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAllTools } from "@/actions/tool-actions"
import type { Tool } from "@prisma/client"
import { ToolsAdminClient } from "@/components/admin/tools-admin-client" // Import the client component

export default async function ToolsAdminPage() {
  // const [isAddingTool, setIsAddingTool] = useState(false) // Remove state
  const tools: Tool[] = await getAllTools()

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

      {/* Render the client component with fetched tools */}
      <ToolsAdminClient initialTools={tools} />

      {/* Remove the old conditional rendering logic */}
      {/* {isAddingTool ? (...) : (...)} */}
      {/* <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-gray-800">
        <h2 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-6">All Tools</h2>
        <ToolsList initialTools={tools} />
      </div> */}
    </div>
  )
} 