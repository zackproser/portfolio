import { z } from 'zod';

// Base types
export type Source = { 
  url: string; 
  observed_at: string; 
  content_hash?: string;
  excerpt?: string;
};

export type MoneyPerK = number;
export type Confidence = 'low' | 'med' | 'high';
export type Persona = 'startup' | 'enterprise' | 'learning';

// LLM API Schema
export const LlmApiModelSchema = z.object({
  id: z.string(),
  modalities: z.array(z.enum(['text', 'image', 'audio'])),
  context_window_tokens: z.number(),
  input_price_per_1k: z.number(),
  output_price_per_1k: z.number(),
  endpoints: z.array(z.string()),
  sources: z.array(z.object({
    url: z.string(),
    observed_at: z.string(),
    content_hash: z.string().optional(),
    excerpt: z.string().optional(),
  })),
});

export const LlmApiSchema = z.object({
  kind: z.literal('llm_api'),
  id: z.string(),
  name: z.string(),
  models: z.array(LlmApiModelSchema),
  rate_limits: z.object({
    rpm: z.number(),
    tpm: z.number(),
    scope: z.enum(['account', 'key']),
    sources: z.array(z.object({
      url: z.string(),
      observed_at: z.string(),
    })),
  }),
  sdks: z.object({
    official: z.array(z.string()),
    community: z.array(z.string()),
  }),
  data_retention: z.object({
    window_days: z.number().nullable(),
    notes: z.string().optional(),
    sources: z.array(z.object({
      url: z.string(),
      observed_at: z.string(),
    })),
  }),
  notes: z.object({
    strengths: z.array(z.string()).optional(),
    tradeoffs: z.array(z.string()).optional(),
  }).optional(),
});

// Framework Schema
export const FrameworkSchema = z.object({
  kind: z.literal('framework'),
  id: z.string(),
  name: z.string(),
  licensing: z.string(),
  install: z.object({
    pypi: z.string().optional(),
    npm: z.string().optional(),
  }),
  docs: z.object({
    quickstart_examples: z.number(),
    api_coverage_ratio: z.number(),
    last_updated_days: z.number(),
    sources: z.array(z.object({
      url: z.string(),
      observed_at: z.string(),
    })),
  }),
  community: z.object({
    github_stars: z.number(),
    github_open_issues: z.number(),
    discord_members: z.number().optional(),
    release_cadence_days: z.number(),
    sources: z.array(z.object({
      url: z.string(),
      observed_at: z.string(),
    })),
  }),
  reliability: z.object({
    breaking_changes_30d: z.number(),
    deprecations_announced: z.boolean(),
    sources: z.array(z.object({
      url: z.string(),
      observed_at: z.string(),
    })),
  }),
});

// Vector Database Schema
export const VectorDbSchema = z.object({
  kind: z.literal('vector_db'),
  id: z.string(),
  name: z.string(),
  pricing: z.object({
    model: z.string(),
    free_tier: z.boolean(),
    starting_price: z.string().optional(),
    pricing_details: z.string().optional(),
    sources: z.array(z.object({
      url: z.string(),
      observed_at: z.string(),
    })),
  }),
  technical: z.object({
    open_source: z.boolean(),
    api_access: z.boolean(),
    setup_complexity: z.string(),
    languages: z.array(z.string()),
    sources: z.array(z.object({
      url: z.string(),
      observed_at: z.string(),
    })),
  }),
  community: z.object({
    github_stars: z.number(),
    github_forks: z.number(),
    github_issues: z.number(),
    release_frequency: z.string(),
    last_commit: z.string().optional(),
    sources: z.array(z.object({
      url: z.string(),
      observed_at: z.string(),
    })),
  }),
  documentation: z.object({
    has_docs: z.boolean(),
    doc_pages: z.number().optional(),
    has_tutorials: z.boolean(),
    has_examples: z.boolean(),
    quality: z.string(),
    last_updated: z.string().optional(),
    sources: z.array(z.object({
      url: z.string(),
      observed_at: z.string(),
    })),
  }),
});

// Union type for all tool kinds
export const ToolSchema = z.discriminatedUnion('kind', [
  LlmApiSchema,
  FrameworkSchema,
  VectorDbSchema,
]);

export type LlmApi = z.infer<typeof LlmApiSchema>;
export type Framework = z.infer<typeof FrameworkSchema>;
export type VectorDb = z.infer<typeof VectorDbSchema>;
export type Tool = z.infer<typeof ToolSchema>;

// Scoring types
export interface Score {
  value: number;
  confidence: Confidence;
  reasoning?: string;
}

export interface Scores {
  pricing: Score;
  ease: Score;
  docs: Score;
  community: Score;
  reliability: Score;
}

export interface PersonaWeights {
  pricing: number;
  ease: number;
  docs: number;
  community: number;
  reliability: number;
}

export const PERSONA_WEIGHTS: Record<Persona, PersonaWeights> = {
  startup: { 
    pricing: 0.35, 
    ease: 0.25, 
    docs: 0.2, 
    community: 0.1, 
    reliability: 0.1 
  },
  enterprise: { 
    reliability: 0.35, 
    docs: 0.25, 
    pricing: 0.15, 
    ease: 0.15, 
    community: 0.10 
  },
  learning: { 
    docs: 0.35, 
    community: 0.25, 
    ease: 0.2, 
    pricing: 0.15, 
    reliability: 0.05 
  },
};

// Verdict types
export interface Verdict {
  winner: string;
  confidence: 'slight' | 'moderate' | 'strong';
  reasons: string[];
  whatThisMeans: string;
  whatWouldChange: string[];
}

// Comparison result
export interface ComparisonResult {
  tool1: {
    id: string;
    name: string;
    scores: Scores;
    weightedScore: number;
  };
  tool2: {
    id: string;
    name: string;
    scores: Scores;
    weightedScore: number;
  };
  verdict: Verdict;
  persona: Persona;
}

// Index page types
export interface IndexFilter {
  kind?: string;
  pricing_model?: string;
  context_window?: string;
  free_tier?: boolean;
  sdks?: string[];
  region?: string;
  data_retention?: string;
}

export interface IndexTool {
  id: string;
  name: string;
  starting_price: string;
  context: string;
  key_strengths: string[];
  last_verified: string;
  selected?: boolean;
}

