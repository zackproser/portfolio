export type Tool = {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  category: string;
  categoryName?: string;
  pricing?: string;
  websiteUrl: string;
  githubUrl?: string;
  openSource?: boolean;
  apiAccess?: boolean;
  documentationQuality?: string;
  communitySize?: string;
  lastUpdated?: string;
  features?: string[];
  pros?: string[];
  cons?: string[];
  license?: string;
  languages?: string[];
  reviewCount?: number;
  reviewUrl?: string;
};

export interface Category {
  id: string;
  name: string;
}

export interface ToolComparison {
  id: string;
  name: string;
  value: string | boolean | number | null;
} 