"use server"

import { revalidatePath } from "next/cache"
import { createManifestProvider, loadLlmApiManifest } from "@/lib/manifests/loader"
import type { ToolManifest } from "@/lib/manifests/types/base"
import type { LlmApiFacts } from "@/lib/manifests/types/llm_api"

// Manifest-based tool interface
export interface ManifestTool {
  id: string
  name: string
  category: string
  slug: string
  homepage_url: string
  docs_url?: string
  github_repo?: string
  as_of: string
  facts: LlmApiFacts
  // Additional properties for compatibility
  description?: string
  logoUrl?: string
  pricing?: string
  openSource?: boolean
  apiAccess?: boolean
  documentationQuality?: string
  communitySize?: string
  lastUpdated?: string
  features?: string[]
  pros?: string[]
  cons?: string[]
  reliability?: string
  easeOfUse?: string
  websiteUrl?: string
  githubUrl?: string
  reviewUrl?: string
  license?: string
  reviewCount?: number
  languages?: string[]
}

// Convert manifest to tool format for compatibility
function manifestToTool(manifest: ToolManifest<LlmApiFacts>): ManifestTool {
  return {
    id: manifest.slug,
    name: manifest.name,
    category: manifest.category,
    slug: manifest.slug,
    homepage_url: manifest.homepage_url,
    docs_url: manifest.docs_url,
    github_repo: manifest.github_repo,
    as_of: manifest.as_of,
    facts: manifest.facts,
    // Map manifest facts to legacy properties
    description: manifest.facts.vendor || '',
    logoUrl: '',
    pricing: manifest.facts.models?.[0]?.pricing?.input_per_1k ? 
      `$${manifest.facts.models[0].pricing.input_per_1k}/1k tokens` : '',
    openSource: false, // LLM APIs are typically not open source
    apiAccess: true, // LLM APIs have API access by definition
    documentationQuality: manifest.facts.sdks?.official?.length ? 'Good' : '',
    communitySize: manifest.facts.sdks?.community?.length ? 'Large' : '',
    lastUpdated: manifest.as_of,
    features: [
      ...manifest.facts.models?.map(model => model.name) || [],
      ...manifest.facts.sdks?.official || [],
      manifest.facts.models?.[0]?.supports?.streaming ? 'Streaming' : '',
      manifest.facts.models?.[0]?.supports?.tools_function_calling ? 'Function Calling' : '',
      manifest.facts.models?.[0]?.supports?.json_mode ? 'JSON Mode' : ''
    ].filter(Boolean),
    pros: [
      manifest.facts.models?.[0]?.supports?.streaming ? 'Real-time streaming' : '',
      manifest.facts.models?.[0]?.supports?.tools_function_calling ? 'Function calling support' : '',
      manifest.facts.models?.[0]?.supports?.json_mode ? 'JSON mode' : '',
      manifest.facts.sdks?.official?.length ? 'Multiple SDKs available' : '',
      manifest.facts.terms?.allowed_prod_use ? 'Production ready' : ''
    ].filter(Boolean),
    cons: [
      !manifest.facts.models?.[0]?.supports?.streaming ? 'No streaming support' : '',
      !manifest.facts.models?.[0]?.supports?.tools_function_calling ? 'No function calling' : '',
      manifest.facts.models?.[0]?.availability === 'beta' ? 'Still in beta' : '',
      manifest.facts.models?.[0]?.availability === 'preview' ? 'Preview only' : ''
    ].filter(Boolean),
    reliability: manifest.facts.models?.[0]?.availability === 'ga' ? 'High' : 'Medium',
    easeOfUse: manifest.facts.sdks?.official?.length ? 'Easy' : 'Medium',
    websiteUrl: manifest.homepage_url,
    githubUrl: manifest.github_repo,
    reviewUrl: '',
    license: '',
    reviewCount: undefined,
    languages: manifest.facts.sdks?.official || []
  }
}

export async function addTool(data: Omit<ManifestTool, 'id'>) {
  console.log("Adding tool (manifest-based):", data)
  // Note: In manifest-based system, tools are added by creating YAML files
  // This is a placeholder for compatibility
  revalidatePath("/admin/tools")
  revalidatePath("/")
  return { success: true, data: { ...data, id: data.slug } }
}

export async function updateTool(id: string, data: Partial<Omit<ManifestTool, 'id'>>) {
  console.log(`Updating tool ${id} (manifest-based):`, data)
  // Note: In manifest-based system, tools are updated by modifying YAML files
  // This is a placeholder for compatibility
  revalidatePath("/admin/tools")
  revalidatePath("/")
  return { success: true, id, data: { ...data, id } }
}

export async function deleteTool(id: string) {
  console.log(`Deleting tool ${id} (manifest-based)`)
  // Note: In manifest-based system, tools are deleted by removing YAML files
  // This is a placeholder for compatibility
  revalidatePath("/admin/tools")
  revalidatePath("/")
  return { success: true, id }
}

export async function getAllTools(): Promise<ManifestTool[]> {
  console.log("Fetching all tools (manifest-based)")
  try {
    const provider = createManifestProvider()
    const slugs = await provider.list()
    
    const tools: ManifestTool[] = []
    
    for (const slug of slugs) {
      try {
        const manifest = await loadLlmApiManifest(slug, provider)
        tools.push(manifestToTool(manifest))
      } catch (error) {
        console.warn(`Failed to load manifest for ${slug}:`, error)
        // Continue with other tools
      }
    }
    
    return tools
  } catch (error) {
    console.error("Error fetching tools:", error)
    return []
  }
}

export async function getToolBySlug(slug: string): Promise<ManifestTool | null> {
  console.log(`Fetching tool by slug: ${slug} (manifest-based)`)
  try {
    const provider = createManifestProvider()
    const manifest = await loadLlmApiManifest(slug, provider)
    return manifestToTool(manifest)
  } catch (error) {
    console.log(`No tool found for slug: ${slug}`)
    return null
  }
} 