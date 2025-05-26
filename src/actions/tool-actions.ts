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

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  console.log(`Fetching tool by slug: ${slug} (using Prisma)`)
  try {
    // Generate search patterns inline to avoid dynamic import issues
    const patterns = []
    
    // Original slug
    patterns.push(slug)
    
    // Title case version
    const titleCase = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    patterns.push(titleCase)
    
    // All lowercase version
    patterns.push(slug.replace(/-/g, ' '))
    
    // All uppercase version
    patterns.push(titleCase.toUpperCase())
    
    // Handle common variations
    const variations = [
      slug.replace(/-/g, ''), // Remove all hyphens
      slug.replace(/-/g, '_'), // Replace hyphens with underscores
      slug.replace(/-ai$/, ' AI'), // Handle AI suffix
      slug.replace(/-io$/, '.io'), // Handle .io domains
    ]
    
    patterns.push(...variations)
    const searchPatterns = [...new Set(patterns)] // Remove duplicates
    
    console.log(`Search patterns for slug "${slug}":`, searchPatterns)
    
    // Try exact matches first, then fuzzy matches
    const tool = await prisma.tool.findFirst({
      where: { 
        OR: searchPatterns.flatMap(pattern => [
          { name: { equals: pattern, mode: 'insensitive' } },
          { name: { contains: pattern, mode: 'insensitive' } }
        ])
      }
    });
    
    if (tool) {
      console.log(`Found tool: ${tool.name} for slug: ${slug}`)
    } else {
      console.log(`No tool found for slug: ${slug}`)
    }
    
    return tool;
  } catch (error) {
    console.error("Error fetching tool by slug:", error)
    return null;
  }
} 