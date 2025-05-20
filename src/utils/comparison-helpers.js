/**
 * Generates comparison prose paragraphs from two tools
 * @param {object} tool1 - The first tool from the database
 * @param {object} tool2 - The second tool from the database
 * @returns {string[]} - Array of prose paragraphs for comparison
 */
export function generateComparisonProse(tool1, tool2) {
  if (!tool1 || !tool2) {
    return [
      "Comparison information is currently unavailable. Please check back later."
    ]
  }

  const paragraphs = []

  // Category comparison
  paragraphs.push(
    `Both ${tool1.name} and ${tool2.name} are in the ${tool1.category} category. ${getRandomCategoryDescription(tool1.category)}`
  )

  // Add a paragraph break
  paragraphs.push("\n\n")

  // Pricing comparison
  paragraphs.push(
    `${tool1.name}'s pricing is ${tool1.pricing || "not specified"}. ${tool2.name}'s pricing is ${tool2.pricing || "not specified"}.`
  )

  // Add a paragraph break
  paragraphs.push("\n\n")

  // Feature comparison
  if (tool1.features?.length > 0 && tool2.features?.length > 0) {
    const tool1Features = tool1.features.slice(0, 3).join(", ")
    const tool2Features = tool2.features.slice(0, 3).join(", ")
    paragraphs.push(
      `${tool1.name} offers features like ${tool1Features}. Meanwhile, ${tool2.name} provides ${tool2Features}.`
    )
    paragraphs.push("\n\n")
  }

  // Language support comparison
  if (tool1.languages?.length > 0 && tool2.languages?.length > 0) {
    const commonLanguages = tool1.languages.filter(lang => 
      tool2.languages.includes(lang)
    )
    
    const tool1UniqueLanguages = tool1.languages.filter(lang => 
      !tool2.languages.includes(lang)
    )
    
    const tool2UniqueLanguages = tool2.languages.filter(lang => 
      !tool1.languages.includes(lang)
    )
    
    if (commonLanguages.length > 0) {
      paragraphs.push(
        `Both tools support ${commonLanguages.join(", ")}.`
      )
    }
    
    if (tool1UniqueLanguages.length > 0) {
      paragraphs.push(
        `${tool1.name} uniquely supports ${tool1UniqueLanguages.join(", ")}.`
      )
    }
    
    if (tool2UniqueLanguages.length > 0) {
      paragraphs.push(
        `${tool2.name} uniquely supports ${tool2UniqueLanguages.join(", ")}.`
      )
    }
    
    paragraphs.push("\n\n")
  }

  // Pros and cons
  if (tool1.pros?.length > 0) {
    paragraphs.push(
      `Key advantages of ${tool1.name} include ${tool1.pros.slice(0, 2).join(" and ")}.`
    )
  }
  
  if (tool2.pros?.length > 0) {
    paragraphs.push(
      `${tool2.name}'s strengths are ${tool2.pros.slice(0, 2).join(" and ")}.`
    )
  }
  
  if (tool1.cons?.length > 0) {
    paragraphs.push(
      `${tool1.name}'s limitations include ${tool1.cons.slice(0, 1).join(", ")}.`
    )
  }
  
  if (tool2.cons?.length > 0) {
    paragraphs.push(
      `${tool2.name}'s drawbacks include ${tool2.cons.slice(0, 1).join(", ")}.`
    )
  }

  // Add final recommendation paragraph
  paragraphs.push("\n\n")
  paragraphs.push(
    `${tool1.name} might be better for ${getRandomUseCase(tool1)}. ${tool2.name} could be more suitable for ${getRandomUseCase(tool2)}.`
  )

  return paragraphs
}

/**
 * Get a random description for a tool category
 */
function getRandomCategoryDescription(category) {
  const descriptions = {
    "Code Autocompletion": [
      "Code autocompletion tools save developers time by suggesting code as they type.",
      "These tools predict what you're trying to code and offer relevant suggestions.",
      "Code assistants help reduce errors and speed up development by providing context-aware code snippets."
    ],
    "Code Chat": [
      "Code chat tools allow developers to discuss and collaborate on code through natural language.",
      "These assistants help explain, debug, and improve code through conversation.",
      "Chat interfaces for coding provide a natural way to interact with AI coding assistants."
    ],
    "AI-Enhanced IDE": [
      "AI-enhanced IDEs integrate artificial intelligence directly into the development environment.",
      "These enhanced editors offer intelligent features like refactoring, debugging assistance, and code generation.",
      "Smart IDEs combine traditional coding environments with AI capabilities for better productivity."
    ],
    "CLI Tool": [
      "Command-line interface tools offer AI assistance without leaving the terminal.",
      "These tools help developers who prefer working in the terminal environment.",
      "CLI-based AI tools integrate seamlessly with existing command-line workflows."
    ],
    "Visual Editor": [
      "Visual editors provide AI assistance for design and visual programming.",
      "These tools help create visual assets and interfaces with AI support.",
      "AI-powered visual editors bridge the gap between design and implementation."
    ]
  }

  // Get descriptions for this category or use generic descriptions
  const options = descriptions[category] || [
    "These tools help developers write better code more efficiently.",
    "These AI-powered tools enhance the development workflow.",
    "These solutions leverage AI to improve coding productivity."
  ]

  // Return a random description
  return options[Math.floor(Math.random() * options.length)]
}

/**
 * Get a random use case for a tool
 */
function getRandomUseCase(tool) {
  const useCases = [
    "developers who prioritize speed",
    "teams working on large codebases",
    "solo developers on small projects",
    "those who prefer an integrated solution",
    "developers who need extensive language support",
    "beginners learning to code",
    "experienced developers looking to optimize workflow",
    "those who primarily work in the terminal",
    "visual-oriented developers",
    "projects requiring extensive documentation"
  ]
  
  // Pick one at random but try to make it somewhat related to the tool
  if (tool.category?.includes("IDE")) {
    return useCases[3]
  }
  
  if (tool.category?.includes("CLI")) {
    return useCases[7]
  }
  
  if (tool.category?.includes("Visual")) {
    return useCases[8]
  }
  
  // Otherwise choose random
  return useCases[Math.floor(Math.random() * useCases.length)]
}

/**
 * Helper to convert a tool name to a slug
 */
export function slugifyToolName(name) {
  return name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
}

/**
 * Helper to convert a slug to a tool name
 */
export function deslugifyToolName(slug) {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
} 