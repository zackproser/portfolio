'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function getToolByName(name) {
  if (!name) return null
  
  return prisma.tool.findFirst({
    where: {
      name: {
        equals: name,
        mode: 'insensitive'
      }
    }
  })
}

export async function getToolBySlug(slug) {
  if (!slug) return null
  
  return prisma.tool.findFirst({
    where: {
      name: {
        equals: slug.replace(/-/g, ' '),
        mode: 'insensitive'
      }
    }
  })
}

export async function getToolById(id) {
  if (!id) return null
  
  return prisma.tool.findUnique({
    where: { id }
  })
}

export async function getAllTools() {
  return prisma.tool.findMany({
    orderBy: { name: 'asc' }
  })
}

export async function getPopularTools(limit = 10) {
  return prisma.tool.findMany({
    orderBy: { reviewCount: 'desc' },
    take: limit
  })
}

export async function getToolsByCategory(category) {
  return prisma.tool.findMany({
    where: { category },
    orderBy: { name: 'asc' }
  })
}

export async function getToolPairs() {
  const tools = await getAllTools()
  const pairs = []
  
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      pairs.push([tools[i], tools[j]])
    }
  }
  
  return pairs
}

export async function getPopularComparisons(limit = 20) {
  // This is a placeholder - ideally you would track popular comparisons
  // For now, we'll just return the first n pairs of tools
  const pairs = await getToolPairs()
  return pairs.slice(0, limit)
}

// Admin CRUD operations
export async function addTool(formData) {
  try {
    // Convert array fields from string to actual arrays
    const features = formData.features ? formData.features.split(',').map(f => f.trim()) : []
    const languages = formData.languages ? formData.languages.split(',').map(l => l.trim()) : []
    const pros = formData.pros ? formData.pros.split(',').map(p => p.trim()) : []
    const cons = formData.cons ? formData.cons.split(',').map(c => c.trim()) : []
    
    const tool = await prisma.tool.create({
      data: {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        website: formData.website,
        githubUrl: formData.githubUrl || null,
        pricing: formData.pricing || null,
        features,
        languages,
        pros,
        cons,
        openSource: formData.openSource === 'true',
        rating: parseFloat(formData.rating) || 0,
        reviewCount: parseInt(formData.reviewCount) || 0,
        logoUrl: formData.logoUrl || null,
        demosUrl: formData.demosUrl || null
      }
    })
    
    revalidatePath('/comparisons')
    revalidatePath('/devtools')
    revalidatePath('/admin/tools')
    
    return { success: true, tool }
  } catch (error) {
    console.error('Error adding tool:', error)
    return { success: false, error: error.message }
  }
}

export async function updateTool(id, formData) {
  try {
    // Convert array fields from string to actual arrays
    const features = formData.features ? formData.features.split(',').map(f => f.trim()) : []
    const languages = formData.languages ? formData.languages.split(',').map(l => l.trim()) : []
    const pros = formData.pros ? formData.pros.split(',').map(p => p.trim()) : []
    const cons = formData.cons ? formData.cons.split(',').map(c => c.trim()) : []
    
    const tool = await prisma.tool.update({
      where: { id },
      data: {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        website: formData.website,
        githubUrl: formData.githubUrl || null,
        pricing: formData.pricing || null,
        features,
        languages,
        pros,
        cons,
        openSource: formData.openSource === 'true',
        rating: parseFloat(formData.rating) || 0,
        reviewCount: parseInt(formData.reviewCount) || 0,
        logoUrl: formData.logoUrl || null,
        demosUrl: formData.demosUrl || null
      }
    })
    
    revalidatePath('/comparisons')
    revalidatePath('/devtools')
    revalidatePath('/admin/tools')
    revalidatePath(`/comparisons/${tool.name.toLowerCase().replace(/ /g, '-')}`)
    
    return { success: true, tool }
  } catch (error) {
    console.error('Error updating tool:', error)
    return { success: false, error: error.message }
  }
}

export async function deleteTool(id) {
  try {
    const tool = await prisma.tool.delete({
      where: { id }
    })
    
    revalidatePath('/comparisons')
    revalidatePath('/devtools')
    revalidatePath('/admin/tools')
    
    return { success: true, tool }
  } catch (error) {
    console.error('Error deleting tool:', error)
    return { success: false, error: error.message }
  }
} 