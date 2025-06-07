export interface Tool {
  name: string;
  slug: string;
  description: string;
  category: string;
  pricing?: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  website?: string;
}

// Mock tool data - in a real app this would come from a database or API
const tools: Tool[] = [
  {
    name: "GitHub Copilot",
    slug: "github-copilot",
    description: "AI-powered code completion and generation tool by GitHub",
    category: "Code Generation",
    pricing: "$10/month",
    features: ["Code completion", "Code generation", "Multi-language support"],
    pros: ["Excellent IDE integration", "High-quality suggestions", "Large training dataset"],
    cons: ["Subscription required", "Privacy concerns", "Can suggest outdated patterns"],
    website: "https://github.com/features/copilot"
  },
  {
    name: "Cursor",
    slug: "cursor",
    description: "AI-first code editor built for pair programming with AI",
    category: "Code Editor",
    pricing: "$20/month",
    features: ["AI chat", "Code editing", "Codebase understanding"],
    pros: ["Native AI integration", "Codebase awareness", "Modern interface"],
    cons: ["Newer tool", "Higher price", "Learning curve"],
    website: "https://cursor.sh"
  }
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(tool => tool.slug === slug);
}

export function getAllTools(): Tool[] {
  return tools;
}

export function getToolComparison(tool1Slug: string, tool2Slug: string) {
  const tool1 = getToolBySlug(tool1Slug);
  const tool2 = getToolBySlug(tool2Slug);
  
  if (!tool1 || !tool2) {
    return null;
  }
  
  return {
    tool1,
    tool2,
    comparisonTitle: `${tool1.name} vs ${tool2.name}`,
    comparisonDescription: `Compare ${tool1.name} and ${tool2.name} to find the best AI development tool for your needs.`
  };
}

export function generateComparisonSlug(tool1: string, tool2: string): string {
  return `${tool1}-vs-${tool2}`;
}

export function parseComparisonSlug(slug: string): { tool1: string; tool2: string } | null {
  const parts = slug.split('-vs-');
  if (parts.length !== 2) {
    return null;
  }
  return {
    tool1: parts[0],
    tool2: parts[1]
  };
}

export function deslugifyToolName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
} 