"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@prisma/client"
import type { Tool } from "@prisma/client"

// Instantiate Prisma Client
const prisma = new PrismaClient()

// In a real app, this would interact with a database
// For this demo, we'll just simulate the action with the data in memory

// let dynamicTools = [...toolsData] // Remove dependency on static data

export async function addTool(data: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) {
  console.log("Adding tool (using Prisma):", data)
  try {
    const newTool = await prisma.tool.create({ data });
    revalidatePath("/admin/tools") // Revalidate relevant paths
    revalidatePath("/")
    return { success: true, data: newTool }
  } catch (error) {
    console.error("Error adding tool:", error)
    return { success: false, error: "Failed to add tool" }
  }
}

export async function updateTool(id: string, data: Partial<Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>>) {
  console.log(`Updating tool ${id} (using Prisma):`, data)
  try {
    const updatedTool = await prisma.tool.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/tools") // Revalidate relevant paths
    revalidatePath("/")
    return { success: true, id, data: updatedTool }
  } catch (error) {
    console.error("Error updating tool:", error)
    return { success: false, error: "Failed to update tool" }
  }
}

export async function deleteTool(id: string) {
  console.log(`Deleting tool ${id} (using Prisma)`);
  try {
    await prisma.tool.delete({ where: { id } });
    revalidatePath("/admin/tools") // Revalidate relevant paths
    revalidatePath("/")
    return { success: true, id };
  } catch (error) {
    console.error("Error deleting tool:", error)
    return { success: false, error: "Failed to delete tool" }
  }
}

export async function getAllTools(): Promise<Tool[]> {
  console.log("Fetching all tools (using Prisma)")
  try {
    const tools = await prisma.tool.findMany();
    return tools;
  } catch (error) {
    console.error("Error fetching tools:", error)
    return []; // Return empty array on error
  }
} 