/**
 * Utility functions for converting between tool names and URL-friendly slugs
 */

/**
 * Convert a tool name to a URL-friendly slug
 */
export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

/**
 * Convert a URL slug back to a searchable name pattern
 * This handles common variations and patterns
 */
export function slugToNamePattern(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate multiple search patterns from a slug to improve matching
 */
export function generateSearchPatterns(slug: string): string[] {
  const patterns = []
  
  // Original slug
  patterns.push(slug)
  
  // Title case version
  const titleCase = slugToNamePattern(slug)
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
  
  return [...new Set(patterns)] // Remove duplicates
} 