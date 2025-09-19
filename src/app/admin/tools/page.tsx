// Remove client-side imports
// import { useState } from "react"
import { Button } from "@/components/ui/button"
// import { AddToolForm } from "@/components/admin/add-tool-form"
// import { ToolsList } from "@/components/admin/tools-list"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getAllTools } from "@/actions/tool-actions"
import type { ManifestTool } from "@/actions/tool-actions"
import { ToolsAdminClient } from "@/components/admin/tools-admin-client" // Import the client component

export default async function ToolsAdminPage() {
  console.log("ADMIN TOOLS PAGE (Prod Test): Attempting to fetch tools..."); // Add log
  let tools: ManifestTool[] = [];
  let fetchError = null;

  // const [isAddingTool, setIsAddingTool] = useState(false) // Remove state
  // const tools: Tool[] = await getAllTools()
  try {
    tools = await getAllTools();
    console.log(`ADMIN TOOLS PAGE (Prod Test): Successfully fetched ${tools.length} tools.`); // Add log
  } catch (error) {
    console.error("ADMIN TOOLS PAGE (Prod Test): Error directly calling getAllTools:", error); // Add log
    fetchError = error; 
  }

  // Optional: Add a check for the error to display something different
  if (fetchError) {
     console.error("ADMIN TOOLS PAGE (Prod Test): Rendering error state due to fetchError."); // Add log
     return (
        <div className="container mx-auto px-4 py-8">
          {/* Basic error display */}
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Tools</h1>
          <p className="text-red-500">Failed to fetch tools from the database. Please check server logs or contact support.</p>
          {/* You could potentially log the error message here too, but be careful about exposing sensitive info */}
          {/* <pre className="mt-4 p-2 bg-red-100 text-red-800 rounded">{JSON.stringify(fetchError, null, 2)}</pre> */}
         </div>
      )
  }

  console.log(`ADMIN TOOLS PAGE (Prod Test): Rendering ToolsAdminClient with ${tools.length} tools.`); // Add log
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