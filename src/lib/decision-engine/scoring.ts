import { Tool, Scores, Score, Persona, PERSONA_WEIGHTS, LlmApi, Framework, VectorDb } from './types';

export class EvidenceBasedScoringEngine {
  /**
   * Calculate all scores for a tool with evidence-based reasoning
   */
  calculateScores(tool: Tool): Scores {
    switch (tool.kind) {
      case 'llm_api':
        return this.scoreLlmApi(tool);
      case 'framework':
        return this.scoreFramework(tool);
      case 'vector_db':
        return this.scoreVectorDb(tool);
      default:
        throw new Error(`Unknown tool kind: ${(tool as any).kind}`);
    }
  }

  /**
   * Calculate weighted score for a specific persona
   */
  calculateWeightedScore(scores: Scores, persona: Persona): number {
    const weights = PERSONA_WEIGHTS[persona];
    const total = Object.entries(weights).reduce((acc, [axis, weight]) => {
      return acc + scores[axis as keyof Scores].value * weight;
    }, 0);
    return Math.round(total * 10) / 10;
  }

  /**
   * Score LLM API based on real pricing, context, and capabilities
   */
  private scoreLlmApi(tool: LlmApi): Scores {
    const pricing = this.scoreLlmApiPricing(tool);
    const ease = this.scoreLlmApiEase(tool);
    const docs = this.scoreLlmApiDocs(tool);
    const community = this.scoreLlmApiCommunity(tool);
    const reliability = this.scoreLlmApiReliability(tool);

    return { pricing, ease, docs, community, reliability };
  }

  private scoreLlmApiPricing(tool: LlmApi): Score {
    let score = 5;
    let confidence: 'low' | 'med' | 'high' = 'med';
    let reasoning = '';

    // Find the most cost-effective model
    const cheapestModel = tool.models.reduce((cheapest, model) => {
      const totalCost = model.input_price_per_1k + model.output_price_per_1k;
      const cheapestCost = cheapest.input_price_per_1k + cheapest.output_price_per_1k;
      return totalCost < cheapestCost ? model : cheapest;
    });

    const totalCost = cheapestModel.input_price_per_1k + cheapestModel.output_price_per_1k;

    // Score based on pricing tiers
    if (totalCost < 0.001) {
      score = 9;
      reasoning = 'Extremely low cost per token';
    } else if (totalCost < 0.005) {
      score = 8;
      reasoning = 'Very competitive pricing';
    } else if (totalCost < 0.01) {
      score = 7;
      reasoning = 'Good value for money';
    } else if (totalCost < 0.02) {
      score = 6;
      reasoning = 'Moderate pricing';
    } else if (totalCost < 0.05) {
      score = 4;
      reasoning = 'Higher cost than alternatives';
    } else {
      score = 2;
      reasoning = 'Premium pricing';
    }

    // Adjust confidence based on data freshness
    const sources = cheapestModel.sources;
    const daysSinceUpdate = this.getDaysSinceUpdate(sources);
    if (daysSinceUpdate > 30) {
      confidence = 'low';
    } else if (daysSinceUpdate > 7) {
      confidence = 'med';
    } else {
      confidence = 'high';
    }

    return { value: score, confidence, reasoning };
  }

  private scoreLlmApiEase(tool: LlmApi): Score {
    let score = 5;
    let confidence: 'low' | 'med' | 'high' = 'med';
    let reasoning = '';

    // SDK availability
    const officialSdks = tool.sdks.official.length;
    const communitySdks = tool.sdks.community.length;

    if (officialSdks >= 3) {
      score += 2;
      reasoning += 'Excellent SDK coverage. ';
    } else if (officialSdks >= 2) {
      score += 1;
      reasoning += 'Good SDK coverage. ';
    }

    // Community SDKs as bonus
    if (communitySdks > 0) {
      score += 1;
      reasoning += 'Active community SDKs. ';
    }

    // Rate limits (higher limits = easier to use)
    const tpm = tool.rate_limits.tpm;
    if (tpm >= 100000) {
      score += 1;
      reasoning += 'Generous rate limits. ';
    } else if (tpm < 10000) {
      score -= 1;
      reasoning += 'Restrictive rate limits. ';
    }

    // Data retention (shorter = easier for privacy)
    if (tool.data_retention.window_days === null || tool.data_retention.window_days === 0) {
      score += 1;
      reasoning += 'No data retention. ';
    }

    return { 
      value: Math.min(10, Math.max(0, score)), 
      confidence: 'high', 
      reasoning: reasoning || 'Standard API access'
    };
  }

  private scoreLlmApiDocs(tool: LlmApi): Score {
    // This would need to be enhanced with actual doc analysis
    // For now, use a placeholder based on model count (more models = better docs)
    const modelCount = tool.models.length;
    let score = 5;
    let reasoning = '';

    if (modelCount >= 5) {
      score = 8;
      reasoning = 'Comprehensive model documentation';
    } else if (modelCount >= 3) {
      score = 7;
      reasoning = 'Good model coverage';
    } else if (modelCount >= 2) {
      score = 6;
      reasoning = 'Basic model documentation';
    } else {
      score = 4;
      reasoning = 'Limited model options';
    }

    return { value: score, confidence: 'med', reasoning };
  }

  private scoreLlmApiCommunity(tool: LlmApi): Score {
    // Placeholder - would need GitHub stars, Discord members, etc.
    return { value: 5, confidence: 'low', reasoning: 'Community data not available' };
  }

  private scoreLlmApiReliability(tool: LlmApi): Score {
    // Placeholder - would need uptime data, incident history
    return { value: 5, confidence: 'low', reasoning: 'Reliability data not available' };
  }

  /**
   * Score Framework based on community, docs, and reliability
   */
  private scoreFramework(tool: Framework): Scores {
    const pricing = this.scoreFrameworkPricing(tool);
    const ease = this.scoreFrameworkEase(tool);
    const docs = this.scoreFrameworkDocs(tool);
    const community = this.scoreFrameworkCommunity(tool);
    const reliability = this.scoreFrameworkReliability(tool);

    return { pricing, ease, docs, community, reliability };
  }

  private scoreFrameworkPricing(tool: Framework): Score {
    // Frameworks are typically free (open source)
    const isFree = tool.licensing.toLowerCase().includes('mit') || 
                   tool.licensing.toLowerCase().includes('apache') ||
                   tool.licensing.toLowerCase().includes('bsd');

    return {
      value: isFree ? 10 : 5,
      confidence: 'high',
      reasoning: isFree ? 'Open source, free to use' : 'Commercial licensing required'
    };
  }

  private scoreFrameworkEase(tool: Framework): Score {
    let score = 5;
    let reasoning = '';

    // Installation options
    const hasPypi = !!tool.install.pypi;
    const hasNpm = !!tool.install.npm;

    if (hasPypi && hasNpm) {
      score += 2;
      reasoning += 'Multi-language support. ';
    } else if (hasPypi || hasNpm) {
      score += 1;
      reasoning += 'Single language support. ';
    }

    return { value: Math.min(10, score), confidence: 'high', reasoning };
  }

  private scoreFrameworkDocs(tool: Framework): Score {
    let score = 5;
    let reasoning = '';

    // Quickstart examples
    if (tool.docs.quickstart_examples >= 50) {
      score += 2;
      reasoning += 'Extensive examples. ';
    } else if (tool.docs.quickstart_examples >= 20) {
      score += 1;
      reasoning += 'Good example coverage. ';
    }

    // API coverage
    if (tool.docs.api_coverage_ratio >= 0.9) {
      score += 2;
      reasoning += 'Comprehensive API docs. ';
    } else if (tool.docs.api_coverage_ratio >= 0.7) {
      score += 1;
      reasoning += 'Good API coverage. ';
    }

    // Freshness
    if (tool.docs.last_updated_days <= 7) {
      score += 1;
      reasoning += 'Recently updated. ';
    } else if (tool.docs.last_updated_days > 30) {
      score -= 1;
      reasoning += 'Docs may be stale. ';
    }

    return { value: Math.min(10, Math.max(0, score)), confidence: 'high', reasoning };
  }

  private scoreFrameworkCommunity(tool: Framework): Score {
    let score = 5;
    let reasoning = '';

    // GitHub stars
    if (tool.community.github_stars >= 10000) {
      score += 3;
      reasoning += 'Very popular. ';
    } else if (tool.community.github_stars >= 1000) {
      score += 2;
      reasoning += 'Popular. ';
    } else if (tool.community.github_stars >= 100) {
      score += 1;
      reasoning += 'Growing community. ';
    }

    // Issue management
    const issueRatio = tool.community.github_open_issues / tool.community.github_stars;
    if (issueRatio < 0.01) {
      score += 1;
      reasoning += 'Well-maintained. ';
    } else if (issueRatio > 0.1) {
      score -= 1;
      reasoning += 'Many open issues. ';
    }

    // Release cadence
    if (tool.community.release_cadence_days <= 7) {
      score += 1;
      reasoning += 'Active development. ';
    } else if (tool.community.release_cadence_days > 30) {
      score -= 1;
      reasoning += 'Slow release cycle. ';
    }

    return { value: Math.min(10, Math.max(0, score)), confidence: 'high', reasoning };
  }

  private scoreFrameworkReliability(tool: Framework): Score {
    let score = 5;
    let reasoning = '';

    // Breaking changes
    if (tool.reliability.breaking_changes_30d === 0) {
      score += 2;
      reasoning += 'Stable API. ';
    } else if (tool.reliability.breaking_changes_30d <= 2) {
      score += 1;
      reasoning += 'Minor breaking changes. ';
    } else {
      score -= 1;
      reasoning += 'Frequent breaking changes. ';
    }

    // Deprecations
    if (!tool.reliability.deprecations_announced) {
      score += 1;
      reasoning += 'No recent deprecations. ';
    } else {
      score -= 1;
      reasoning += 'Recent deprecations announced. ';
    }

    return { value: Math.min(10, Math.max(0, score)), confidence: 'med', reasoning };
  }

  /**
   * Score Vector Database
   */
  private scoreVectorDb(tool: VectorDb): Scores {
    const pricing = this.scoreVectorDbPricing(tool);
    const ease = this.scoreVectorDbEase(tool);
    const docs = this.scoreVectorDbDocs(tool);
    const community = this.scoreVectorDbCommunity(tool);
    const reliability = this.scoreVectorDbReliability(tool);

    return { pricing, ease, docs, community, reliability };
  }

  private scoreVectorDbPricing(tool: VectorDb): Score {
    let score = 5;
    let reasoning = '';

    if (tool.pricing.free_tier) {
      score += 3;
      reasoning += 'Free tier available. ';
    }

    // Open source bonus
    if (tool.technical.open_source) {
      score += 2;
      reasoning += 'Open source. ';
    }

    return { value: Math.min(10, score), confidence: 'high', reasoning };
  }

  private scoreVectorDbEase(tool: VectorDb): Score {
    let score = 5;
    let reasoning = '';

    // Setup complexity
    switch (tool.technical.setup_complexity.toLowerCase()) {
      case 'easy':
        score += 2;
        reasoning += 'Easy setup. ';
        break;
      case 'medium':
        score += 1;
        reasoning += 'Moderate setup. ';
        break;
      case 'hard':
        score -= 1;
        reasoning += 'Complex setup. ';
        break;
    }

    // Language support
    if (tool.technical.languages.length >= 3) {
      score += 1;
      reasoning += 'Multi-language support. ';
    }

    return { value: Math.min(10, Math.max(0, score)), confidence: 'high', reasoning };
  }

  private scoreVectorDbDocs(tool: VectorDb): Score {
    let score = 5;
    let reasoning = '';

    if (tool.documentation.has_docs) {
      score += 2;
      reasoning += 'Documentation available. ';
    }

    if (tool.documentation.has_tutorials) {
      score += 1;
      reasoning += 'Tutorials available. ';
    }

    if (tool.documentation.has_examples) {
      score += 1;
      reasoning += 'Code examples available. ';
    }

    // Quality assessment
    switch (tool.documentation.quality.toLowerCase()) {
      case 'excellent':
        score += 2;
        reasoning += 'Excellent documentation quality. ';
        break;
      case 'good':
        score += 1;
        reasoning += 'Good documentation quality. ';
        break;
      case 'poor':
        score -= 1;
        reasoning += 'Poor documentation quality. ';
        break;
    }

    return { value: Math.min(10, Math.max(0, score)), confidence: 'med', reasoning };
  }

  private scoreVectorDbCommunity(tool: VectorDb): Score {
    let score = 5;
    let reasoning = '';

    // GitHub stars
    if (tool.community.github_stars >= 5000) {
      score += 3;
      reasoning += 'Very popular. ';
    } else if (tool.community.github_stars >= 1000) {
      score += 2;
      reasoning += 'Popular. ';
    } else if (tool.community.github_stars >= 100) {
      score += 1;
      reasoning += 'Growing community. ';
    }

    // Issue management
    const issueRatio = tool.community.github_issues / tool.community.github_stars;
    if (issueRatio < 0.05) {
      score += 1;
      reasoning += 'Well-maintained. ';
    } else if (issueRatio > 0.2) {
      score -= 1;
      reasoning += 'Many open issues. ';
    }

    return { value: Math.min(10, Math.max(0, score)), confidence: 'high', reasoning };
  }

  private scoreVectorDbReliability(tool: VectorDb): Score {
    // Placeholder - would need uptime data, incident history
    return { value: 5, confidence: 'low', reasoning: 'Reliability data not available' };
  }

  /**
   * Utility function to get days since last update
   */
  private getDaysSinceUpdate(sources: Array<{ observed_at: string }>): number {
    if (sources.length === 0) return 999;
    
    const latestDate = new Date(Math.max(...sources.map(s => new Date(s.observed_at).getTime())));
    const now = new Date();
    return Math.floor((now.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24));
  }
}

export const scoringEngine = new EvidenceBasedScoringEngine();

