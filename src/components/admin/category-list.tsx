"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Search } from "lucide-react"
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

// Define a sample categories array for the demo
// In a real application, this would come from a database
const categoriesData = [
  {
    id: "llm",
    name: "LLM APIs",
    description: "Large Language Model APIs and services",
    toolCount: 12,
    color: "violet",
  },
  {
    id: "vector-db",
    name: "Vector Databases",
    description: "Databases optimized for vector embeddings and similarity search",
    toolCount: 8,
    color: "blue",
  },
  {
    id: "framework",
    name: "AI Frameworks",
    description: "Frameworks for building AI applications",
    toolCount: 15,
    color: "green",
  },
  {
    id: "agent",
    name: "Agent Frameworks",
    description: "Frameworks for building autonomous AI agents",
    toolCount: 6,
    color: "amber",
  },
  {
    id: "embedding",
    name: "Embedding Models",
    description: "Models specialized in text-to-vector embeddings",
    toolCount: 9,
    color: "pink",
  },
  {
    id: "orchestration",
    name: "Orchestration",
    description: "Tools for orchestrating AI workflows",
    toolCount: 7,
    color: "cyan",
  },
  {
    id: "evaluation",
    name: "Evaluation Tools",
    description: "Tools for evaluating AI models and systems",
    toolCount: 4,
    color: "indigo",
  },
  {
    id: "fine-tuning",
    name: "Fine-tuning",
    description: "Tools and platforms for fine-tuning models",
    toolCount: 5,
    color: "orange",
  },
]

// In a real app, these would be server actions
async function deleteCategory(categoryId: string) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  console.log(`Deleting category with ID: ${categoryId}`)
  return { success: true }
}

export function CategoryList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteCategoryId, setDeleteCategoryId] = useState<string | null>(null)
  const { toast } = useToast()

  // Filter categories based on search term
  const filteredCategories = categoriesData.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (categoryId: string) => {
    try {
      // Call the function to delete the category
      await deleteCategory(categoryId)
      
      toast({
        title: "Category deleted",
        description: "The category has been successfully deleted.",
      })
      
      setDeleteCategoryId(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the category. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Get color class based on category color
  const getColorClass = (color: string) => {
    const colors: Record<string, string> = {
      violet: "bg-violet-100 text-violet-700",
      blue: "bg-blue-100 text-blue-700",
      green: "bg-green-100 text-green-700",
      amber: "bg-amber-100 text-amber-700",
      pink: "bg-pink-100 text-pink-700",
      cyan: "bg-cyan-100 text-cyan-700",
      indigo: "bg-indigo-100 text-indigo-700",
      orange: "bg-orange-100 text-orange-700",
    }
    return colors[color] || "bg-slate-100 text-slate-700"
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead>Tools Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No categories found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <Badge variant="secondary" className={getColorClass(category.color)}>
                      {category.name}
                    </Badge>
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category.toolCount} tools</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteCategoryId(category.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
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

      <AlertDialog open={!!deleteCategoryId} onOpenChange={() => setDeleteCategoryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and may affect tools assigned to it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCategoryId && handleDelete(deleteCategoryId)}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 