"use server"

import { revalidatePath } from "next/cache"
import { toolsData } from "@/data/tools"
import { Tool } from "@/types/tools"

// In a real app, this would interact with a database
// For this demo, we'll just simulate the action with the data in memory

let dynamicTools = [...toolsData]

export async function addTool(toolData: any) {
  try {
    // Simulate a delay to mimic a database operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate a unique ID (in a real app, this would be handled by the database)
    const id = `tool-${Date.now()}`

    // Process the category to get the category name
    const categoryNames: Record<string, string> = {
      llm: "LLM APIs",
      "vector-db": "Vector Databases",
      framework: "AI Frameworks",
      agent: "Agent Frameworks",
      embedding: "Embedding Models",
      orchestration: "Orchestration",
      evaluation: "Evaluation Tools",
      "fine-tuning": "Fine-tuning",
    }

    const categoryName = categoryNames[toolData.category] || toolData.category

    // Create the new tool object
    const newTool: Tool = {
      id,
      ...toolData,
      categoryName,
    }

    // In a real app, you would save this to a database
    dynamicTools.push(newTool)
    console.log("New tool created:", newTool)

    // Revalidate the tools page to show the new tool
    revalidatePath("/admin/tools")
    revalidatePath("/")

    return { success: true, tool: newTool }
  } catch (error) {
    console.error("Error adding tool:", error)
    return { success: false, error: "Failed to add tool" }
  }
}

export async function deleteTool(id: string) {
  try {
    // Simulate a delay to mimic a database operation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, you would delete this from a database
    dynamicTools = dynamicTools.filter(tool => tool.id !== id)
    console.log("Tool deleted:", id)

    // Revalidate the tools page
    revalidatePath("/admin/tools")
    revalidatePath("/")

    return { success: true }
  } catch (error) {
    console.error("Error deleting tool:", error)
    return { success: false, error: "Failed to delete tool" }
  }
}

export async function getAllTools(): Promise<Tool[]> {
  // This would fetch from a database in a real app
  return dynamicTools
} 