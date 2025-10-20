import { DecisionEngineLoader } from '@/lib/decision-engine/loader';
import { PricingCalculator } from './PricingCalculator';
import type { LlmApi } from '@/lib/decision-engine/types';

interface PricingScenario {
  name: string;
  input: number;
  output: number;
  note?: string;
}

interface PricingCalculatorWrapperProps {
  tools: string[];  // Tool slugs
  scenarios?: PricingScenario[];
  showAffiliateLinks?: boolean;
  affiliateLinks?: Record<string, string>;
  customCommentary?: string;
}

/**
 * Server component wrapper that loads manifest data and passes to client component
 */
export async function PricingCalculatorWrapper({
  tools,
  scenarios,
  showAffiliateLinks,
  affiliateLinks,
  customCommentary
}: PricingCalculatorWrapperProps) {
  const loader = new DecisionEngineLoader();

  // Load all requested tools
  const toolPromises = tools.map(id => loader.loadToolById(id));
  const loadedTools = await Promise.all(toolPromises);

  // Extract pricing data for each model (use first model's pricing as representative)
  const toolsData = loadedTools
    .filter((tool): tool is NonNullable<typeof tool> => tool !== null)
    .map(tool => {
      const llmTool = tool as LlmApi;
      const firstModel = llmTool.models[0];

      return {
        id: tool.id,
        name: tool.name,
        pricing: {
          input_per_1k: firstModel?.input_price_per_1k || 0,
          output_per_1k: firstModel?.output_price_per_1k || 0
        }
      };
    });

  return (
    <PricingCalculator
      toolsData={toolsData}
      scenarios={scenarios}
      showAffiliateLinks={showAffiliateLinks}
      affiliateLinks={affiliateLinks}
      customCommentary={customCommentary}
    />
  );
}
