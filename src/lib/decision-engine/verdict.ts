import { Tool, Scores, Persona, Verdict, ComparisonResult } from './types';
import { scoringEngine } from './scoring';

export class VerdictGenerator {
  /**
   * Generate a verdict for a head-to-head comparison
   */
  generateVerdict(tool1: Tool, tool2: Tool, persona: Persona): ComparisonResult {
    const scores1 = scoringEngine.calculateScores(tool1);
    const scores2 = scoringEngine.calculateScores(tool2);
    
    const weightedScore1 = scoringEngine.calculateWeightedScore(scores1, persona);
    const weightedScore2 = scoringEngine.calculateWeightedScore(scores2, persona);
    
    const verdict = this.createVerdict(tool1, tool2, scores1, scores2, weightedScore1, weightedScore2, persona);
    
    return {
      tool1: {
        id: tool1.id,
        name: tool1.name,
        scores: scores1,
        weightedScore: weightedScore1,
      },
      tool2: {
        id: tool2.id,
        name: tool2.name,
        scores: scores2,
        weightedScore: weightedScore2,
      },
      verdict,
      persona,
    };
  }

  private createVerdict(
    tool1: Tool,
    tool2: Tool,
    scores1: Scores,
    scores2: Scores,
    weightedScore1: number,
    weightedScore2: number,
    persona: Persona
  ): Verdict {
    const isTool1Winner = weightedScore1 > weightedScore2;
    const winner = isTool1Winner ? tool1 : tool2;
    const loser = isTool1Winner ? tool2 : tool1;
    const winnerScores = isTool1Winner ? scores1 : scores2;
    const loserScores = isTool1Winner ? scores2 : scores1;
    
    const scoreDifference = Math.abs(weightedScore1 - weightedScore2);
    
    // Determine confidence level
    let confidence: 'slight' | 'moderate' | 'strong';
    if (scoreDifference < 0.5) {
      confidence = 'slight';
    } else if (scoreDifference < 1.5) {
      confidence = 'moderate';
    } else {
      confidence = 'strong';
    }
    
    // Generate reasons based on biggest differences
    const reasons = this.generateReasons(winnerScores, loserScores, persona);
    
    // Generate "what this means for you" message
    const whatThisMeans = this.generateWhatThisMeans(winner, loser, scoreDifference, persona);
    
    // Generate "what would change the verdict" scenarios
    const whatWouldChange = this.generateWhatWouldChange(winner, loser, winnerScores, loserScores, persona);
    
    return {
      winner: winner.name,
      confidence,
      reasons,
      whatThisMeans,
      whatWouldChange,
    };
  }

  private generateReasons(winnerScores: Scores, loserScores: Scores, persona: Persona): string[] {
    const reasons: string[] = [];
    
    // Find the biggest differences
    const differences = Object.entries(winnerScores).map(([axis, winnerScore]) => {
      const loserScore = loserScores[axis as keyof Scores];
      return {
        axis,
        difference: winnerScore.value - loserScore.value,
        winnerScore: winnerScore.value,
        loserScore: loserScore.value,
        reasoning: winnerScore.reasoning,
      };
    }).filter(diff => diff.difference > 0).sort((a, b) => b.difference - a.difference);
    
    // Take top 2-3 reasons
    const topReasons = differences.slice(0, 3);
    
    for (const reason of topReasons) {
      if (reason.difference >= 2) {
        reasons.push(this.formatReason(reason.axis, reason.difference, reason.reasoning));
      }
    }
    
    // If no strong reasons, use the biggest difference
    if (reasons.length === 0 && differences.length > 0) {
      const topReason = differences[0];
      reasons.push(this.formatReason(topReason.axis, topReason.difference, topReason.reasoning));
    }
    
    return reasons;
  }

  private formatReason(axis: string, difference: number, reasoning?: string): string {
    const axisNames: Record<string, string> = {
      pricing: 'Pricing',
      ease: 'Ease of Use',
      docs: 'Documentation',
      community: 'Community',
      reliability: 'Reliability',
    };
    
    const axisName = axisNames[axis] || axis;
    const strength = difference >= 3 ? 'significantly' : difference >= 1.5 ? 'notably' : 'slightly';
    
    if (reasoning) {
      return `${axisName} ${strength} better: ${reasoning}`;
    } else {
      return `${axisName} ${strength} better`;
    }
  }

  private generateWhatThisMeans(winner: Tool, loser: Tool, scoreDifference: number, persona: Persona): string {
    const personaMessages: Record<Persona, Record<string, string>> = {
      startup: {
        pricing: `You'll save money on API costs, crucial for bootstrapped startups.`,
        ease: `Faster time to market with easier integration.`,
        docs: `Less time debugging, more time building features.`,
        community: `Better support when you hit roadblocks.`,
        reliability: `Fewer production issues to worry about.`,
      },
      enterprise: {
        pricing: `Lower total cost of ownership for large-scale deployments.`,
        ease: `Reduced training time for your development team.`,
        docs: `Better compliance and audit trail capabilities.`,
        community: `Enterprise-grade support and partnerships.`,
        reliability: `Mission-critical uptime and SLA guarantees.`,
      },
      learning: {
        pricing: `More experimentation within your budget.`,
        ease: `Less frustration, more learning progress.`,
        docs: `Better learning resources and examples.`,
        community: `More help when you're stuck on concepts.`,
        reliability: `Stable platform for consistent learning.`,
      },
    };
    
    // Find the biggest advantage
    const winnerScores = scoringEngine.calculateScores(winner);
    const loserScores = scoringEngine.calculateScores(loser);
    
    const biggestAdvantage = Object.entries(winnerScores).reduce((max, [axis, score]) => {
      const loserScore = loserScores[axis as keyof typeof loserScores];
      const difference = score.value - loserScore.value;
      return difference > max.difference ? { axis, difference } : max;
    }, { axis: 'pricing', difference: 0 });
    
    const message = personaMessages[persona][biggestAdvantage.axis];
    return message || `Better overall fit for your ${persona} needs.`;
  }

  private generateWhatWouldChange(winner: Tool, loser: Tool, winnerScores: Scores, loserScores: Scores, persona: Persona): string[] {
    const scenarios: string[] = [];
    
    // Pricing scenarios
    if (winnerScores.pricing.value < loserScores.pricing.value + 2) {
      scenarios.push(`If ${loser.name} reduced pricing by 30-40%, the cost advantage would disappear`);
    }
    
    // Context window scenarios (for LLM APIs)
    if (winner.kind === 'llm_api' && loser.kind === 'llm_api') {
      scenarios.push(`If ${loser.name} released a 1M+ token context model, the capabilities gap would close`);
    }
    
    // Community scenarios
    if (winnerScores.community.value < loserScores.community.value + 2) {
      scenarios.push(`If ${loser.name} gained significant community adoption, the support advantage would diminish`);
    }
    
    // Reliability scenarios
    if (winnerScores.reliability.value < loserScores.reliability.value + 2) {
      scenarios.push(`If ${loser.name} improved uptime to 99.9%+, the reliability gap would close`);
    }
    
    return scenarios.slice(0, 3); // Limit to 3 scenarios
  }
}

export const verdictGenerator = new VerdictGenerator();

