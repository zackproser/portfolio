"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Search, ExternalLink } from "lucide-react"
import { toolsData } from "@/data/tools"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteTool } from "@/actions/tool-actions"

export function ToolsList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteToolId, setDeleteToolId] = useState<string | null>(null)
  const { toast } = useToast()

  // In a real app, this would fetch from an API or database
  const tools = toolsData

  // Filter tools based on search term
  const filteredTools = tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (toolId: string) => {
    try {
      // Call the server action to delete the tool
      await deleteTool(toolId);
      
      toast({
        title: "Tool deleted",
        description: "The tool has been successfully deleted.",
      })
      
      setDeleteToolId(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the tool. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCategoryName = (categoryId: string) => {
    const categories: Record<string, string> = {
      llm: "LLM APIs",
      "vector-db": "Vector Databases",
      framework: "AI Frameworks",
      agent: "Agent Frameworks",
      embedding: "Embedding Models",
      orchestration: "Orchestration",
      evaluation: "Evaluation Tools",
      "fine-tuning": "Fine-tuning",
    }
    return categories[categoryId] || categoryId
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 h-4 w-4" />
          <Input
            placeholder="Search tools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-900"
          />
        </div>
      </div>

      <div className="border border-slate-200 dark:border-gray-800 rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50 dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700">
              <TableHead className="w-[250px] text-slate-700 dark:text-slate-300">Name</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">Category</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">Pricing</TableHead>
              <TableHead className="text-slate-700 dark:text-slate-300">Open Source</TableHead>
              <TableHead className="text-right text-slate-700 dark:text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTools.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">
                  No tools found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredTools.map((tool) => (
                <TableRow key={tool.id} className="hover:bg-slate-50 dark:hover:bg-gray-800">
                  <TableCell className="font-medium text-slate-900 dark:text-slate-200">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-md overflow-hidden flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm border border-slate-100 dark:border-gray-700 mr-3">
                        <img
                          src={tool.logoUrl || "/placeholder.svg"}
                          alt={`${tool.name} logo`}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      {tool.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                      {getCategoryName(tool.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">{tool.pricing}</TableCell>
                  <TableCell className="text-slate-700 dark:text-slate-300">{tool.openSource ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-gray-800">
                        <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="hover:bg-slate-100 dark:hover:bg-gray-800">
                        <Pencil className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteToolId(tool.id)} className="hover:bg-slate-100 dark:hover:bg-gray-800">
                        <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deleteToolId} onOpenChange={() => setDeleteToolId(null)}>
        <AlertDialogContent className="bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-slate-900 dark:text-slate-100">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600 dark:text-slate-400">
              This action cannot be undone. This will permanently delete the tool from your platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white dark:bg-gray-900 border-slate-200 dark:border-gray-800 text-slate-700 dark:text-slate-300">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteToolId && handleDelete(deleteToolId)}
              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 