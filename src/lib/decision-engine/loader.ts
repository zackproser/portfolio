import { Tool, LlmApi, Framework, VectorDb } from './types';
import { loadLlmApiManifest, createManifestProvider } from '@/lib/manifests/loader';

export class DecisionEngineLoader {
  private manifestProvider = createManifestProvider();
  private cache: { tools?: { at: number; data: Tool[] } } = {};

  /**
   * Load all tools and convert to decision engine format
   */
  async loadAllTools(): Promise<Tool[]> {
    const now = Date.now();
    const ttlMs = 60 * 1000; // 60s in-memory cache per request scope
    if (this.cache.tools && now - this.cache.tools.at < ttlMs) {
      return this.cache.tools.data;
    }

    const manifestSlugs = await this.manifestProvider.list();
    const tools: Tool[] = [];

    for (const slug of manifestSlugs) {
      try {
        const manifest = await loadLlmApiManifest(slug, this.manifestProvider);
        const tool = this.convertManifestToTool(manifest);
        if (tool) tools.push(tool);
      } catch (error) {
        console.error(`Failed to load manifest ${slug}:`, error);
      }
    }

    this.cache.tools = { at: now, data: tools };
    return tools;
  }

  /**
   * Convert existing manifest to decision engine tool format
   */
  private convertManifestToTool(manifest: any): Tool | null {
    if (!manifest || !manifest.facts) {
      return null;
    }

    // Convert to LLM API format
    const llmApi: LlmApi = {
      kind: 'llm_api',
      id: manifest.slug,
      name: manifest.name,
      models: manifest.facts.models.map((model: any) => ({
        id: model.id || `${manifest.slug}-${model.name}`,
        modalities: this.extractModalities(model),
        context_window_tokens: model.context_tokens_max || 0,
        input_price_per_1k: model.pricing?.input_per_1k || 0,
        output_price_per_1k: model.pricing?.output_per_1k || 0,
        endpoints: this.extractEndpoints(model),
        sources: this.extractSources(model)
      })),
      rate_limits: {
        rpm: manifest.facts.rate_limits?.rpm || 0,
        tpm: manifest.facts.rate_limits?.tpm || 0,
        scope: manifest.facts.rate_limits?.scope || 'account',
        sources: this.extractRateLimitSources(manifest.facts.rate_limits)
      },
      sdks: {
        official: manifest.facts.sdks?.official || [],
        community: manifest.facts.sdks?.community || []
      },
      data_retention: {
        window_days: manifest.facts.data_retention?.window_days || null,
        notes: manifest.facts.data_retention?.notes,
        sources: this.extractDataRetentionSources(manifest.facts.data_retention)
      },
      notes: {
        strengths: manifest.facts.strengths || [],
        tradeoffs: manifest.facts.tradeoffs || []
      }
    };

    return llmApi;
  }

  private extractModalities(model: any): ('text' | 'image' | 'audio')[] {
    const modalities: ('text' | 'image' | 'audio')[] = ['text'];
    
    if (model.capabilities?.vision) {
      modalities.push('image');
    }
    if (model.capabilities?.audio) {
      modalities.push('audio');
    }
    
    return modalities;
  }

  private extractEndpoints(model: any): string[] {
    const endpoints: string[] = [];
    
    if (model.endpoints?.messages) {
      endpoints.push('messages');
    }
    if (model.endpoints?.streaming) {
      endpoints.push('streaming');
    }
    if (model.endpoints?.embeddings) {
      endpoints.push('embeddings');
    }
    
    return endpoints;
  }

  private extractSources(model: any): Array<{ url: string; observed_at: string; content_hash?: string; excerpt?: string }> {
    if (!model.sources) {
      return [{
        url: 'https://example.com',
        observed_at: new Date().toISOString().split('T')[0]
      }];
    }

    return model.sources.map((source: any) => ({
      url: source.url || 'https://example.com',
      observed_at: source.observed_at || new Date().toISOString().split('T')[0],
      content_hash: source.content_hash,
      excerpt: source.excerpt
    }));
  }

  private extractRateLimitSources(rateLimits: any): Array<{ url: string; observed_at: string }> {
    if (!rateLimits?.sources) {
      return [{
        url: 'https://example.com',
        observed_at: new Date().toISOString().split('T')[0]
      }];
    }

    return rateLimits.sources.map((source: any) => ({
      url: source.url || 'https://example.com',
      observed_at: source.observed_at || new Date().toISOString().split('T')[0]
    }));
  }

  private extractDataRetentionSources(dataRetention: any): Array<{ url: string; observed_at: string }> {
    if (!dataRetention?.sources) {
      return [{
        url: 'https://example.com',
        observed_at: new Date().toISOString().split('T')[0]
      }];
    }

    return dataRetention.sources.map((source: any) => ({
      url: source.url || 'https://example.com',
      observed_at: source.observed_at || new Date().toISOString().split('T')[0]
    }));
  }

  /**
   * Load tools by category
   */
  async loadToolsByCategory(category: string): Promise<Tool[]> {
    const allTools = await this.loadAllTools();
    return allTools.filter(tool => {
      switch (tool.kind) {
        case 'llm_api':
          return category === 'llm_api';
        case 'framework':
          return category === 'framework';
        case 'vector_db':
          return category === 'vector_db';
        default:
          return false;
      }
    });
  }

  /**
   * Load a specific tool by ID
   */
  async loadToolById(id: string): Promise<Tool | null> {
    const allTools = await this.loadAllTools();
    return allTools.find(tool => tool.id === id) || null;
  }

  /**
   * Load tools for comparison
   */
  async loadToolsForComparison(tool1Id: string, tool2Id: string): Promise<{ tool1: Tool | null; tool2: Tool | null }> {
    const [tool1, tool2] = await Promise.all([
      this.loadToolById(tool1Id),
      this.loadToolById(tool2Id)
    ]);

    return { tool1, tool2 };
  }

  /**
   * Get featured comparisons based on popular tools
   */
  async getFeaturedComparisons(): Promise<Array<{
    id: string;
    title: string;
    description: string;
    tools: string[];
    href: string;
  }>> {
    const tools = await this.loadAllTools();
    
    // For now, create some featured comparisons based on available tools
    const featured: Array<{
      id: string;
      title: string;
      description: string;
      tools: string[];
      href: string;
    }> = [];

    if (tools.length >= 2) {
      // Create some common comparisons
      const tool1 = tools[0];
      const tool2 = tools[1];
      
      featured.push({
        id: `${tool1.id}-vs-${tool2.id}`,
        title: `${tool1.name} vs ${tool2.name}`,
        description: 'Compare pricing, features, and capabilities',
        tools: [tool1.name, tool2.name],
        href: `/comparisons/${tool1.id}/vs/${tool2.id}`
      });
    }

    return featured;
  }
}

export const decisionEngineLoader = new DecisionEngineLoader();

