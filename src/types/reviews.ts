/**
 * Types for the review/comparison system
 * Extends existing Content and ExtendedMetadata types
 */

import { Content } from './content';

export type ReviewStatus =
  | 'idea'           // In queue, not started
  | 'drafted'        // LLM scaffold generated, needs your review
  | 'in-progress'    // You're actively working on it
  | 'review'         // Ready for your final polish
  | 'published'      // Live on site
  | 'needs-update';  // Facts have changed, needs refresh

/**
 * Review metadata - extends the standard metadata.json structure
 * Lives in src/content/reviews/[slug]/metadata.json
 */
export interface ReviewMetadata extends Content {
  type: 'blog';  // Reviews render as blog posts

  // Review-specific fields
  tools: string[];  // References to manifest slugs (e.g., ["anthropic-api", "openai-api"])
  reviewType: 'comparison' | 'single-tool' | 'roundup';

  // Monetization
  affiliateLinks?: Record<string, string>;  // { "anthropic": "https://...", "openai": "https://..." }

  // Status tracking (optional - mainly for internal tooling)
  reviewStatus?: ReviewStatus;
  lastFactCheck?: string;  // ISO date string
  priority?: number;  // 1-10 for queue management
  estimatedRevenue?: string;  // "$500/month" - for prioritization

  // Optional commerce configuration (overrides Content's commerce if needed)
  // For reviews, typically just use requiresEmail for lead capture
}

/**
 * Queue management structure
 * Lives in .queue/reviews-queue.yaml
 */
export interface ReviewQueueItem {
  slug: string;
  title: string;
  status: ReviewStatus;
  tools: string[];
  reviewType: 'comparison' | 'single-tool' | 'roundup';
  priority: 'high' | 'medium' | 'low';
  reason?: string;  // Why this is prioritized
  estimatedRevenue?: string;
  affiliateOpportunity?: boolean;
  created: string;  // ISO date
  notes?: string;
}

export interface ReviewQueue {
  high_priority: ReviewQueueItem[];
  medium_priority: ReviewQueueItem[];
  backlog: ReviewQueueItem[];
}

/**
 * Draft metadata for LLM-generated scaffolds
 * Lives in .drafts/[slug]/metadata.json
 */
export interface DraftReviewMetadata extends ReviewMetadata {
  reviewStatus: 'drafted';
  generatedAt: string;  // ISO date
  generatedBy?: string;  // 'scaffold-script' | 'manual'
  needsHumanReview: true;
}
