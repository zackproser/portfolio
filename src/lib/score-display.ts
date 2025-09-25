/**
 * Score Display Utilities
 * Maps scores to human-readable labels and descriptions
 */

export const scoreDescriptions: Record<string, Record<number, string>> = {
  pricing: {
    10: "Generous free tier and competitive pricing",
    7: "Reasonable pricing with good value",
    4: "Expensive for the features provided",
    1: "Very expensive with limited value"
  },
  documentation: {
    10: "Excellent documentation with examples and tutorials",
    7: "Good documentation with clear examples",
    4: "Basic documentation, could be better",
    1: "Poor documentation, hard to understand"
  },
  easeOfUse: {
    10: "Beginner-friendly with intuitive interface",
    7: "Easy to learn with good UX",
    4: "Steep learning curve",
    1: "Very complex and difficult to use"
  },
  community: {
    10: "Vibrant community with active support",
    7: "Active community with good engagement",
    4: "Small but helpful community",
    1: "Limited community support"
  },
  reliability: {
    10: "Highly reliable with excellent uptime",
    7: "Reliable with good performance",
    4: "Some reliability issues",
    1: "Frequent issues and downtime"
  },
  performance: {
    10: "Exceptional performance and speed",
    7: "Good performance for most use cases",
    4: "Adequate performance with some limitations",
    1: "Poor performance and slow"
  },
  features: {
    10: "Comprehensive feature set with advanced capabilities",
    7: "Good feature set covering most needs",
    4: "Basic features, some gaps",
    1: "Limited features and functionality"
  }
}

export const scoreLabels: Record<number, string> = {
  10: "Excellent",
  7: "Good", 
  4: "Fair",
  1: "Poor",
  0: "No data"
}

export const scoreColors: Record<number, string> = {
  10: "text-emerald-600 bg-emerald-100",
  7: "text-green-600 bg-green-100",
  4: "text-yellow-600 bg-yellow-100",
  1: "text-red-600 bg-red-100",
  0: "text-gray-600 bg-gray-100"
}

export const scoreIcons: Record<number, string> = {
  10: "✨",
  7: "🟢",
  4: "🟡",
  1: "🔴",
  0: "—"
}

/**
 * Get the appropriate score label for a given score
 */
export function getScoreLabel(score: number): string {
  const tiers = Object.keys(scoreLabels)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const tier of tiers) {
    if (score >= tier) {
      return scoreLabels[tier]
    }
  }
  
  return "No data"
}

/**
 * Get the appropriate score color classes for a given score
 */
export function getScoreColor(score: number): string {
  const tiers = Object.keys(scoreColors)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const tier of tiers) {
    if (score >= tier) {
      return scoreColors[tier]
    }
  }
  
  return scoreColors[0]
}

/**
 * Get the appropriate score icon for a given score
 */
export function getScoreIcon(score: number): string {
  const tiers = Object.keys(scoreIcons)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const tier of tiers) {
    if (score >= tier) {
      return scoreIcons[tier]
    }
  }
  
  return scoreIcons[0]
}

/**
 * Get a description for a specific metric and score
 */
export function getScoreDescription(metric: string, score: number): string {
  const metricDescriptions = scoreDescriptions[metric]
  if (!metricDescriptions) {
    return "No description available"
  }
  
  const tiers = Object.keys(metricDescriptions)
    .map(Number)
    .sort((a, b) => b - a)
  
  for (const tier of tiers) {
    if (score >= tier) {
      return metricDescriptions[tier]
    }
  }
  
  return "No data available"
}

/**
 * Get all score information for a metric and score
 */
export function getScoreInfo(metric: string, score: number) {
  return {
    label: getScoreLabel(score),
    color: getScoreColor(score),
    icon: getScoreIcon(score),
    description: getScoreDescription(metric, score)
  }
}

/**
 * Calculate a weighted score based on multiple metrics
 */
export function calculateWeightedScore(
  scores: Record<string, number>,
  weights: Record<string, number>
): number {
  let totalScore = 0
  let totalWeight = 0
  
  for (const [metric, score] of Object.entries(scores)) {
    const weight = weights[metric] || 0
    totalScore += score * weight
    totalWeight += weight
  }
  
  return totalWeight > 0 ? totalScore / totalWeight : 0
}

/**
 * Get score tier (0, 1, 4, 7, 10) for display purposes
 */
export function getScoreTier(score: number): number {
  if (score === 0) return 0
  if (score <= 3) return 1
  if (score <= 6) return 4
  if (score <= 9) return 7
  return 10
}

/**
 * Format score for display with appropriate precision
 */
export function formatScore(score: number): string {
  if (score === 0) return "0"
  if (score < 1) return score.toFixed(1)
  return Math.round(score).toString()
}

/**
 * Get score comparison text between two scores
 */
export function getScoreComparison(scoreA: number, scoreB: number, metric: string): string {
  const diff = Math.abs(scoreA - scoreB)
  
  if (diff < 1) {
    return `Both tools have similar ${metric} performance`
  }
  
  const better = scoreA > scoreB ? 'A' : 'B'
  const magnitude = diff < 2 ? 'slightly' : diff < 4 ? 'moderately' : 'significantly'
  
  return `Tool ${better} has ${magnitude} better ${metric} performance`
}
