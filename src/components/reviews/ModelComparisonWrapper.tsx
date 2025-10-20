import { DecisionEngineLoader } from '@/lib/decision-engine/loader';
import { ModelComparison } from './ModelComparison';
import type { LlmApi } from '@/lib/decision-engine/types';

interface ModelComparisonWrapperProps {
  models: Record<string, string[]>;  // { "anthropic-api": ["claude-3-5-sonnet-20241022"], "openai-api": ["gpt-4o"] }
  highlightFields?: string[];
  customAnnotations?: Record<string, string>;
}

/**
 * Server component wrapper that loads manifest data and passes to client component
 */
export async function ModelComparisonWrapper({
  models,
  highlightFields,
  customAnnotations
}: ModelComparisonWrapperProps) {
  const loader = new DecisionEngineLoader();

  // Flatten models structure and load tool data
  const modelsData: Array<{
    id: string;
    name: string;
    context_tokens_max: number;
    pricing: {
      input_per_1k: number;
      output_per_1k: number;
    };
    supports: Record<string, boolean>;
  }> = [];

  for (const [toolSlug, modelNames] of Object.entries(models)) {
    const tool = await loader.loadToolById(toolSlug);
    if (!tool || tool.kind !== 'llm_api') continue;

    const llmTool = tool as LlmApi;

    // Find requested models from this tool
    for (const modelName of modelNames) {
      const modelData = llmTool.models.find(m => m.id === modelName);
      if (!modelData) continue;

      modelsData.push({
        id: modelData.id,
        name: `${tool.name} - ${modelName.split('-').slice(0, -1).join(' ')}`,
        context_tokens_max: modelData.context_window_tokens,
        pricing: {
          input_per_1k: modelData.input_price_per_1k,
          output_per_1k: modelData.output_price_per_1k
        },
        supports: {
          streaming: modelData.endpoints.includes('streaming'),
          function_calling: modelData.endpoints.includes('tools'),
          json_mode: modelData.endpoints.includes('json'),
          batch: modelData.endpoints.includes('batch')
        }
      });
    }
  }

  return (
    <ModelComparison
      modelsData={modelsData}
      highlightFields={highlightFields}
      customAnnotations={customAnnotations}
    />
  );
}
