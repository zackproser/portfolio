"use server"

import { revalidatePath } from "next/cache"
import { PrismaClient } from "@prisma/client"
import type { Tool } from "@prisma/client"

// Instantiate Prisma Client
const prisma = new PrismaClient()

// Build-time cache to avoid duplicate queries during static generation
const buildTimeCache = new Map<string, Tool | null>()
const allToolsCache = new Map<string, Tool[]>()

// Cache key for getAllTools 
const ALL_TOOLS_CACHE_KEY = 'all_tools'

// Clear cache function for development
export async function clearBuildCache() {
  buildTimeCache.clear()
  allToolsCache.clear()
}

// In a real app, this would interact with a database
// For this demo, we'll just simulate the action with the data in memory

// let dynamicTools = [...toolsData] // Remove dependency on static data

export async function addTool(data: Omit<Tool, 'id' | 'createdAt' | 'updatedAt'>) {
  console.log("Adding tool (using Prisma):", data)
  try {
    const newTool = await prisma.tool.create({ data });
    // Clear cache when data changes
    clearBuildCache()
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
    // Clear cache when data changes
    clearBuildCache()
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
    // Clear cache when data changes
    clearBuildCache()
    revalidatePath("/admin/tools") // Revalidate relevant paths
    revalidatePath("/")
    return { success: true, id };
  } catch (error) {
    console.error("Error deleting tool:", error)
    return { success: false, error: "Failed to delete tool" }
  }
}

export async function getAllTools(): Promise<Tool[]> {
  // Check cache first
  if (allToolsCache.has(ALL_TOOLS_CACHE_KEY)) {
    console.log("Fetching all tools (using cache)")
    return allToolsCache.get(ALL_TOOLS_CACHE_KEY)!
  }

  console.log("Fetching all tools (using Prisma)")
  try {
    const tools = await prisma.tool.findMany();
    // Cache the result for subsequent calls during build
    allToolsCache.set(ALL_TOOLS_CACHE_KEY, tools)
    return tools;
  } catch (error) {
    console.error("Error fetching tools:", error)
    return []; // Return empty array on error
  }
}

// Bulk fetch tools by multiple slugs to reduce database round trips
export async function getToolsBySlugs(slugs: string[]): Promise<Map<string, Tool | null>> {
  const results = new Map<string, Tool | null>()
  
  // Check cache first for all slugs
  const uncachedSlugs: string[] = []
  for (const slug of slugs) {
    if (buildTimeCache.has(slug)) {
      results.set(slug, buildTimeCache.get(slug)!)
    } else {
      uncachedSlugs.push(slug)
    }
  }
  
  if (uncachedSlugs.length === 0) {
    console.log(`Fetching ${slugs.length} tools by slugs (all from cache)`)
    return results
  }
  
  console.log(`Fetching ${uncachedSlugs.length} tools by slugs (using Prisma)`)
  
  try {
    // Generate all search patterns for all uncached slugs
    const allPatterns: Array<{ slug: string; patterns: string[] }> = uncachedSlugs.map(slug => {
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
      return { slug, patterns: [...new Set(patterns)] }
    })
    
    // Create a single query with all patterns
    const allSearchPatterns = allPatterns.flatMap(({ patterns }) => patterns)
    
    const tools = await prisma.tool.findMany({
      where: { 
        OR: allSearchPatterns.flatMap(pattern => [
          { name: { equals: pattern, mode: 'insensitive' } },
          { name: { contains: pattern, mode: 'insensitive' } }
        ])
      }
    });
    
    // Match tools back to their original slugs
    for (const { slug, patterns } of allPatterns) {
      const matchedTool = tools.find(tool => 
        patterns.some(pattern => 
          tool.name.toLowerCase() === pattern.toLowerCase() ||
          tool.name.toLowerCase().includes(pattern.toLowerCase())
        )
      )
      
      results.set(slug, matchedTool || null)
      buildTimeCache.set(slug, matchedTool || null)
      
      if (matchedTool) {
        console.log(`Found tool: ${matchedTool.name} for slug: ${slug}`)
      } else {
        console.log(`No tool found for slug: ${slug}`)
      }
    }
    
    return results
  } catch (error) {
    console.error("Error fetching tools by slugs:", error)
    // Return null for all uncached slugs on error
    for (const slug of uncachedSlugs) {
      results.set(slug, null)
    }
    return results
  }
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  // Check cache first
  if (buildTimeCache.has(slug)) {
    console.log(`Fetching tool by slug: ${slug} (using cache)`)
    return buildTimeCache.get(slug)!
  }

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
    
    // Cache the result for subsequent calls during build
    buildTimeCache.set(slug, tool)
    
    return tool;
  } catch (error) {
    console.error("Error fetching tool by slug:", error)
    return null;
  }
} 