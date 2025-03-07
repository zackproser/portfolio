// Re-export all types for easier imports
export * from './Tool';
// Export types from the new files
export * from './content';
export * from './product';
export * from './metadata';
export * from './database';
export * from './commerce';

export interface LeadAnalysis {
  isPotentialLead: boolean;
  confidence: number;
  reasons: string[];
  topics: string[];
  nextSteps: string[];
} 