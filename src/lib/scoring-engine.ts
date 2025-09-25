interface ToolData {
  id: string;
  name: string;
  category: string;
  description: string;
  pricing: string;
  openSource: boolean;
  apiAccess: boolean;
  easeOfUse: string;
  reliability: string;
  documentation: string;
  community: string;
  features: string[];
  websiteUrl: string;
  logoUrl: string;
  // Raw data for scoring
  rawPricing?: {
    model: string;
    freeTier: boolean;
    startingPrice?: string;
    pricingDetails?: string;
  };
  rawTechnical?: {
    openSource: boolean;
    apiAccess: boolean;
    license?: string;
    setupComplexity: string;
    languages: string[];
  };
  rawCommunity?: {
    githubStars?: number;
    githubForks?: number;
    githubIssues?: number;
    releaseFrequency: string;
    lastCommit?: string;
  };
  rawDocumentation?: {
    hasDocs: boolean;
    docPages?: number;
    hasTutorials: boolean;
    hasExamples: boolean;
    quality: string;
    lastUpdated?: string;
  };
}

export const scoringEngine = {
  pricing: (tool: ToolData): number => {
    let score = 5; // Base score
    
    // Free tier bonus
    if (tool.rawPricing?.freeTier) {
      score += 3;
    } else if (tool.pricing.toLowerCase().includes('free')) {
      score += 2;
    }
    
    // Open source bonus (usually free to use)
    if (tool.openSource) {
      score += 2;
    }
    
    // Pricing model analysis
    const pricing = tool.pricing.toLowerCase();
    if (pricing.includes('freemium')) {
      score += 1;
    } else if (pricing.includes('pay-as-you-go')) {
      score += 1;
    } else if (pricing.includes('subscription')) {
      score -= 1;
    }
    
    // Starting price analysis (if available)
    if (tool.rawPricing?.startingPrice) {
      const price = parseFloat(tool.rawPricing.startingPrice.replace(/[^0-9.]/g, ''));
      if (price < 10) score += 1;
      else if (price > 100) score -= 1;
    }
    
    return Math.min(10, Math.max(0, score));
  },

  easeOfUse: (tool: ToolData): number => {
    let score = 5; // Base score
    
    // Convert string ratings to numeric
    switch (tool.easeOfUse) {
      case 'Very Easy': return 9;
      case 'Easy': return 7;
      case 'Moderate': return 5;
      case 'Difficult': return 3;
      case 'Very Difficult': return 1;
      default: return 5;
    }
  },

  documentation: (tool: ToolData): number => {
    let score = 5; // Base score
    
    // Convert string ratings to numeric
    switch (tool.documentation) {
      case 'Excellent': return 9;
      case 'Very Good': return 8;
      case 'Good': return 6;
      case 'Moderate': return 4;
      case 'Basic': return 2;
      case 'Poor': return 1;
      default: return 5;
    }
  },

  community: (tool: ToolData): number => {
    let score = 5; // Base score
    
    // Convert string ratings to numeric
    switch (tool.community) {
      case 'Very Large': return 9;
      case 'Large': return 8;
      case 'Medium': return 6;
      case 'Small but growing': return 4;
      case 'Small': return 2;
      case 'Limited': return 1;
      default: return 5;
    }
  },

  reliability: (tool: ToolData): number => {
    let score = 5; // Base score
    
    // Convert string ratings to numeric
    switch (tool.reliability) {
      case 'Very High': return 9;
      case 'High': return 8;
      case 'Moderate': return 5;
      case 'Low': return 3;
      case 'Very Low': return 1;
      default: return 5;
    }
  }
};

export function calculateAllScores(tool: ToolData) {
  return {
    pricing: scoringEngine.pricing(tool),
    easeOfUse: scoringEngine.easeOfUse(tool),
    documentation: scoringEngine.documentation(tool),
    community: scoringEngine.community(tool),
    reliability: scoringEngine.reliability(tool)
  };
}

export function calculateWeightedScore(tool: ToolData, weights: Partial<{ pricing: number; easeOfUse: number; documentation: number; community: number; reliability: number }> = {}) {
  const scores = calculateAllScores(tool);
  const defaultWeights = {
    pricing: 0.2,
    easeOfUse: 0.2,
    documentation: 0.2,
    community: 0.2,
    reliability: 0.2
  };
  
  const finalWeights = { ...defaultWeights, ...weights };
  
  return Object.entries(scores).reduce((total, [metric, score]) => {
    const weight = finalWeights[metric as keyof typeof finalWeights] || 0;
    return total + (score * weight);
  }, 0);
}

export function findTopAdvantages(winner: ToolData, loser: ToolData) {
  const winnerScores = calculateAllScores(winner);
  const loserScores = calculateAllScores(loser);
  
  const advantages = Object.entries(winnerScores)
    .map(([metric, score]) => ({
      metric,
      difference: score - (loserScores[metric as keyof typeof loserScores] || 0),
      score
    }))
    .filter(adv => adv.difference > 0)
    .sort((a, b) => b.difference - a.difference);
  
  return advantages.slice(0, 3); // Top 3 advantages
}
