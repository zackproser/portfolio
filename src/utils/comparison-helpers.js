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
  
  // Introduction with context
  paragraphs.push(
    `Choosing between ${tool1.name} and ${tool2.name} is a common decision for developers in the ${tool1.category.toLowerCase()} space. Both tools have carved out their niches, but they serve different needs and use cases. This comparison will help you understand which tool aligns better with your project requirements, team structure, and long-term goals.`
  );
  
  // Core positioning
  if (tool1.description && tool2.description) {
    paragraphs.push(
      `${tool1.name} positions itself as ${tool1.description.toLowerCase()}, making it particularly suitable for teams that prioritize ${getPrimaryStrength(tool1)}. In contrast, ${tool2.name} focuses on ${tool2.description.toLowerCase()}, which appeals to developers who value ${getPrimaryStrength(tool2)}.`
    );
  }
  
  // Pricing and accessibility analysis
  const pricingComparison = generatePricingInsight(tool1, tool2);
  if (pricingComparison) {
    paragraphs.push(pricingComparison);
  }
  
  // Technical considerations
  const technicalInsight = generateTechnicalInsight(tool1, tool2);
  if (technicalInsight) {
    paragraphs.push(technicalInsight);
  }
  
  // Decision framework
  paragraphs.push(
    `When making your decision, consider these key factors: your budget constraints, team size and technical expertise, integration requirements with existing tools, and long-term scalability needs. ${tool1.name} might be the better choice if you prioritize ${getDecisionFactors(tool1).join(', ')}, while ${tool2.name} could be ideal if ${getDecisionFactors(tool2).join(', ')} are more important to your workflow.`
  );
  
  return paragraphs;
}

/**
 * Extract primary strength from tool data
 */
function getPrimaryStrength(tool) {
  if (tool.openSource) return 'transparency and customization';
  if (tool.pricing && tool.pricing.toLowerCase().includes('free')) return 'cost-effectiveness';
  if (tool.apiAccess) return 'integration flexibility';
  if (tool.documentationQuality) return 'developer experience';
  return 'reliability and ease of use';
}

/**
 * Generate pricing insight
 */
function generatePricingInsight(tool1, tool2) {
  const tool1Free = !tool1.pricing || tool1.pricing.toLowerCase().includes('free');
  const tool2Free = !tool2.pricing || tool2.pricing.toLowerCase().includes('free');
  
  if (tool1Free && !tool2Free) {
    return `From a cost perspective, ${tool1.name} offers significant advantages with its ${tool1.pricing || 'free'} pricing model, making it accessible to individual developers and small teams. ${tool2.name}'s ${tool2.pricing} pricing reflects its positioning as a more premium solution with additional features and support.`;
  } else if (!tool1Free && tool2Free) {
    return `${tool2.name}'s ${tool2.pricing || 'free'} pricing model makes it highly accessible, while ${tool1.name}'s ${tool1.pricing} pricing suggests a focus on enterprise features and professional support.`;
  } else if (tool1.pricing && tool2.pricing) {
    return `Both tools have commercial pricing models (${tool1.name}: ${tool1.pricing}, ${tool2.name}: ${tool2.pricing}), so your choice should focus on feature alignment rather than cost considerations.`;
  }
  
  return null;
}

/**
 * Generate technical insight
 */
function generateTechnicalInsight(tool1, tool2) {
  const insights = [];
  
  if (tool1.openSource !== tool2.openSource) {
    const openTool = tool1.openSource ? tool1 : tool2;
    const closedTool = tool1.openSource ? tool2 : tool1;
    insights.push(`${openTool.name}'s open-source nature provides transparency and customization opportunities, while ${closedTool.name}'s proprietary approach may offer more polished user experience and dedicated support`);
  }
  
  if (tool1.apiAccess !== tool2.apiAccess) {
    const apiTool = tool1.apiAccess ? tool1 : tool2;
    const noApiTool = tool1.apiAccess ? tool2 : tool1;
    insights.push(`${apiTool.name} provides API access for programmatic integration, giving it an edge for automation and custom workflows compared to ${noApiTool.name}`);
  }
  
  if (insights.length > 0) {
    return `From a technical standpoint, ${insights.join('. ')}.`;
  }
  
  return null;
}

/**
 * Get decision factors for a tool
 */
function getDecisionFactors(tool) {
  const factors = [];
  
  if (tool.openSource) factors.push('open-source flexibility');
  if (!tool.pricing || tool.pricing.toLowerCase().includes('free')) factors.push('budget constraints');
  if (tool.apiAccess) factors.push('API integration');
  if (tool.documentationQuality) factors.push('comprehensive documentation');
  if (tool.features && tool.features.length > 5) factors.push('feature richness');
  
  return factors.length > 0 ? factors : ['ease of use', 'reliability'];
} 