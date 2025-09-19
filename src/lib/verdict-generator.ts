/**
 * Verdict Generator - Always provides clear, opinionated recommendations
 * Never says "no clear winner" - there's always a lean
 */

export interface ToolData {
  id: string
  name: string
  category: string
  pricing?: string
  openSource?: boolean
  easeOfUse?: string
  reliability?: string
  documentation?: string
  community?: string
  features?: string[]
  websiteUrl?: string
}

export interface Verdict {
  winner: string
  headline: string
  confidence: 'slight' | 'moderate' | 'strong'
  reasons: Array<{
    metric: string
    text: string
    icon: string
    sentiment: 'positive' | 'negative'
  }>
  recommendations: {
    startup: string
    startupReason: string
    startupConfidence: 'slight' | 'moderate' | 'strong'
    enterprise: string
    enterpriseReason: string
    enterpriseConfidence: 'slight' | 'moderate' | 'strong'
    learning: string
    learningReason: string
    learningConfidence: 'slight' | 'moderate' | 'strong'
  }
}

interface PersonaWeights {
  pricing: number
  ease: number
  docs: number
  community: number
  reliability: number
}

const PERSONA_WEIGHTS: Record<string, PersonaWeights> = {
  startup: { pricing: 0.4, ease: 0.3, docs: 0.2, community: 0.1, reliability: 0.0 },
  enterprise: { pricing: 0.1, ease: 0.2, docs: 0.3, community: 0.1, reliability: 0.3 },
  learning: { pricing: 0.3, ease: 0.4, docs: 0.2, community: 0.1, reliability: 0.0 }
}

/**
 * Calculate a score for a tool based on various metrics
 */
function calculateToolScore(tool: ToolData, weights: PersonaWeights): number {
  let score = 0
  
  // Pricing score (inverted - lower cost is better)
  const pricingScore = getPricingScore(tool.pricing)
  score += pricingScore * weights.pricing
  
  // Ease of use score
  const easeScore = getEaseScore(tool.easeOfUse)
  score += easeScore * weights.ease
  
  // Documentation score
  const docsScore = getDocsScore(tool.documentation)
  score += docsScore * weights.docs
  
  // Community score
  const communityScore = getCommunityScore(tool.community)
  score += communityScore * weights.community
  
  // Reliability score
  const reliabilityScore = getReliabilityScore(tool.reliability, tool.openSource)
  score += reliabilityScore * weights.reliability
  
  return Math.min(10, Math.max(0, score))
}

function getPricingScore(pricing?: string): number {
  if (!pricing) return 5
  
  const pricingLower = pricing.toLowerCase()
  if (pricingLower.includes('free')) return 10
  if (pricingLower.includes('open source')) return 9
  if (pricingLower.includes('low') || pricingLower.includes('affordable')) return 7
  if (pricingLower.includes('moderate')) return 5
  if (pricingLower.includes('high') || pricingLower.includes('expensive')) return 2
  return 5
}

function getEaseScore(easeOfUse?: string): number {
  if (!easeOfUse) return 5
  
  const easeLower = easeOfUse.toLowerCase()
  if (easeLower.includes('very easy') || easeLower.includes('beginner')) return 10
  if (easeLower.includes('easy')) return 8
  if (easeLower.includes('moderate')) return 6
  if (easeLower.includes('difficult') || easeLower.includes('complex')) return 3
  return 5
}

function getDocsScore(documentation?: string): number {
  if (!documentation) return 5
  
  const docsLower = documentation.toLowerCase()
  if (docsLower.includes('excellent') || docsLower.includes('comprehensive')) return 10
  if (docsLower.includes('good') || docsLower.includes('detailed')) return 8
  if (docsLower.includes('basic') || docsLower.includes('limited')) return 4
  if (docsLower.includes('poor') || docsLower.includes('minimal')) return 2
  return 5
}

function getCommunityScore(community?: string): number {
  if (!community) return 5
  
  const communityLower = community.toLowerCase()
  if (communityLower.includes('large') || communityLower.includes('vibrant')) return 10
  if (communityLower.includes('active') || communityLower.includes('growing')) return 7
  if (communityLower.includes('small') || communityLower.includes('limited')) return 4
  return 5
}

function getReliabilityScore(reliability?: string, openSource?: boolean): number {
  if (openSource) return 8 // Open source is generally more reliable long-term
  
  if (!reliability) return 5
  
  const reliabilityLower = reliability.toLowerCase()
  if (reliabilityLower.includes('high') || reliabilityLower.includes('excellent')) return 10
  if (reliabilityLower.includes('good') || reliabilityLower.includes('stable')) return 7
  if (reliabilityLower.includes('moderate')) return 5
  if (reliabilityLower.includes('low') || reliabilityLower.includes('unstable')) return 2
  return 5
}

/**
 * Calculate key differences between two tools - amplified for visibility
 */
function calculateKeyDifferences(toolA: ToolData, toolB: ToolData) {
  const differences = []
  
  // Pricing difference
  const pricingA = getPricingScore(toolA.pricing)
  const pricingB = getPricingScore(toolB.pricing)
  const pricingDiff = Math.abs(pricingA - pricingB)
  if (pricingDiff > 0.5) { // Lower threshold to catch more differences
    differences.push({
      metric: 'pricing',
      advantage: pricingA > pricingB ? 'toolA' : 'toolB',
      description: pricingA > pricingB 
        ? `${toolA.name} offers better value`
        : `${toolB.name} offers better value`,
      magnitude: pricingDiff
    })
  }
  
  // Ease of use difference
  const easeA = getEaseScore(toolA.easeOfUse)
  const easeB = getEaseScore(toolB.easeOfUse)
  const easeDiff = Math.abs(easeA - easeB)
  if (easeDiff > 0.5) {
    differences.push({
      metric: 'ease',
      advantage: easeA > easeB ? 'toolA' : 'toolB',
      description: easeA > easeB 
        ? `${toolA.name} is easier to use`
        : `${toolB.name} is easier to use`,
      magnitude: easeDiff
    })
  }
  
  // Documentation difference
  const docsA = getDocsScore(toolA.documentation)
  const docsB = getDocsScore(toolB.documentation)
  const docsDiff = Math.abs(docsA - docsB)
  if (docsDiff > 0.5) {
    differences.push({
      metric: 'documentation',
      advantage: docsA > docsB ? 'toolA' : 'toolB',
      description: docsA > docsB 
        ? `${toolA.name} has better docs`
        : `${toolB.name} has better docs`,
      magnitude: docsDiff
    })
  }
  
  // Community difference
  const communityA = getCommunityScore(toolA.community)
  const communityB = getCommunityScore(toolB.community)
  const communityDiff = Math.abs(communityA - communityB)
  if (communityDiff > 0.5) {
    differences.push({
      metric: 'community',
      advantage: communityA > communityB ? 'toolA' : 'toolB',
      description: communityA > communityB 
        ? `${toolA.name} has stronger community`
        : `${toolB.name} has stronger community`,
      magnitude: communityDiff
    })
  }
  
  return differences.sort((a, b) => b.magnitude - a.magnitude)
}

/**
 * Determine overall winner - ALWAYS picks a winner, never "Tie"
 */
function determineOverallWinner(toolA: ToolData, toolB: ToolData): { winner: string, confidence: 'slight' | 'moderate' | 'strong', scoreDiff: number } {
  // Use startup weights as default (most common use case)
  const weights = PERSONA_WEIGHTS.startup
  
  const scoreA = calculateToolScore(toolA, weights)
  const scoreB = calculateToolScore(toolB, weights)
  
  const scoreDiff = Math.abs(scoreA - scoreB)
  
  let confidence: 'slight' | 'moderate' | 'strong'
  if (scoreDiff < 0.5) {
    confidence = 'slight'
  } else if (scoreDiff < 2) {
    confidence = 'moderate'
  } else {
    confidence = 'strong'
  }
  
  // Always pick a winner, even if by tiny margin
  const winner = scoreA >= scoreB ? toolA.name : toolB.name
  
  return { winner, confidence, scoreDiff }
}

/**
 * Generate headline based on confidence and differences
 */
function generateHeadline(winner: string, confidence: string, differences: any[]): string {
  if (confidence === 'slight') {
    return `${winner} edges out the competition for most developers`
  } else if (confidence === 'moderate') {
    return `${winner} is the better choice for most use cases`
  } else {
    return `${winner} is significantly better than the alternative`
  }
}

/**
 * Calculate persona-specific winner - ALWAYS picks a winner
 */
function calculatePersonaWinner(toolA: ToolData, toolB: ToolData, persona: string): { winner: string, confidence: 'slight' | 'moderate' | 'strong', reason: string } {
  const weights = PERSONA_WEIGHTS[persona]
  if (!weights) return { winner: toolA.name, confidence: 'slight', reason: 'No specific persona weights' }
  
  const scoreA = calculateToolScore(toolA, weights)
  const scoreB = calculateToolScore(toolB, weights)
  
  const scoreDiff = Math.abs(scoreA - scoreB)
  
  let confidence: 'slight' | 'moderate' | 'strong'
  if (scoreDiff < 0.5) {
    confidence = 'slight'
  } else if (scoreDiff < 1.5) {
    confidence = 'moderate'
  } else {
    confidence = 'strong'
  }
  
  // Always pick a winner
  const winner = scoreA >= scoreB ? toolA : toolB
  const loser = winner === toolA ? toolB : toolA
  
  // Generate specific reason based on persona priorities
  let reason = ''
  if (persona === 'startup') {
    if (winner.pricing?.toLowerCase().includes('free')) {
      reason = 'Free tier available for early-stage development'
    } else if (winner.easeOfUse?.toLowerCase().includes('easy')) {
      reason = 'Easy to set up and start building quickly'
    } else {
      reason = 'Better balance of features and cost for startups'
    }
  } else if (persona === 'enterprise') {
    if (winner.reliability === 'High') {
      reason = 'Proven reliability for production environments'
    } else if (winner.documentation?.toLowerCase().includes('comprehensive')) {
      reason = 'Comprehensive documentation for team adoption'
    } else {
      reason = 'Enterprise-grade features and support'
    }
  } else if (persona === 'learning') {
    if (winner.openSource) {
      reason = 'Open source allows deep understanding of the technology'
    } else if (winner.pricing?.toLowerCase().includes('free')) {
      reason = 'Free to experiment and learn without cost barriers'
    } else {
      reason = 'Great for learning AI development concepts'
    }
  }
  
  return { winner: winner.name, confidence, reason }
}

/**
 * Main function to generate verdict - ALWAYS provides clear recommendations
 */
export function generateVerdict(toolA: ToolData, toolB: ToolData): Verdict {
  const differences = calculateKeyDifferences(toolA, toolB)
  const { winner, confidence, scoreDiff } = determineOverallWinner(toolA, toolB)
  const headline = generateHeadline(winner, confidence, differences)
  
  // Create badge-style reasons - always show top differences
  const reasons = differences.slice(0, 3).map(diff => ({
    metric: diff.metric,
    text: diff.description,
    icon: getReasonIcon(diff.metric),
    sentiment: (diff.advantage === (winner === toolA.name ? 'toolA' : 'toolB') ? 'positive' : 'negative') as 'positive' | 'negative'
  }))
  
  // If no clear differences, create some based on the winner
  if (reasons.length === 0) {
    const winnerTool = winner === toolA.name ? toolA : toolB
    reasons.push({
      metric: 'overall',
      text: `${winner} has a slight edge in overall quality`,
      icon: '⭐',
      sentiment: 'positive' as 'positive' | 'negative'
    })
  }
  
  // Calculate persona recommendations - ALWAYS provide clear winners
  const startupResult = calculatePersonaWinner(toolA, toolB, 'startup')
  const enterpriseResult = calculatePersonaWinner(toolA, toolB, 'enterprise')
  const learningResult = calculatePersonaWinner(toolA, toolB, 'learning')
  
  return {
    winner,
    headline,
    confidence,
    reasons,
    recommendations: {
      startup: startupResult.winner,
      startupReason: startupResult.reason,
      startupConfidence: startupResult.confidence,
      enterprise: enterpriseResult.winner,
      enterpriseReason: enterpriseResult.reason,
      enterpriseConfidence: enterpriseResult.confidence,
      learning: learningResult.winner,
      learningReason: learningResult.reason,
      learningConfidence: learningResult.confidence
    }
  }
}

function getReasonIcon(metric: string): string {
  const iconMap: Record<string, string> = {
    pricing: '💰',
    ease: '⚡',
    documentation: '📚',
    community: '👥',
    reliability: '🛡️',
    performance: '🚀',
    features: '✨',
    overall: '⭐'
  }
  
  return iconMap[metric] || '⚖️'
}