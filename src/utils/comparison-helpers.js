/**
 * Utility functions for tool comparison pages
 */

/**
 * Convert a slug back to a readable tool name
 * @param {string} slug - The slugified tool name
 * @returns {string} - The readable tool name
 */
export function deslugifyToolName(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate comparison prose for two tools
 * @param {Object} tool1 - First tool object
 * @param {Object} tool2 - Second tool object
 * @returns {Array} - Array of prose paragraphs
 */
export function generateComparisonProse(tool1, tool2) {
  const paragraphs = [];
  
  // Introduction paragraph
  paragraphs.push(
    `When comparing ${tool1.name} and ${tool2.name}, developers need to consider several key factors including ease of use, feature set, pricing, and integration capabilities. Both tools serve the developer community but with different approaches and strengths.`
  );
  
  // Feature comparison
  if (tool1.description && tool2.description) {
    paragraphs.push(
      `${tool1.name} focuses on ${tool1.description.toLowerCase()}, while ${tool2.name} emphasizes ${tool2.description.toLowerCase()}. This fundamental difference in approach affects how each tool fits into different development workflows.`
    );
  }
  
  // Use case paragraph
  paragraphs.push(
    `The choice between ${tool1.name} and ${tool2.name} often depends on your specific use case, team size, and technical requirements. Consider factors like learning curve, community support, and long-term maintenance when making your decision.`
  );
  
  return paragraphs;
} 