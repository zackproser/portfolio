'use client';

interface ModelData {
  id: string;
  name: string;
  context_tokens_max: number;
  pricing: {
    input_per_1k: number;
    output_per_1k: number;
  };
  supports: Record<string, boolean>;
}

interface ModelComparisonProps {
  modelsData: ModelData[];
  highlightFields?: string[];
  customAnnotations?: Record<string, string>;
}

/**
 * Side-by-side model comparison
 * Displays model data in cards
 */
export function ModelComparison({
  modelsData,
  highlightFields,
  customAnnotations
}: ModelComparisonProps) {

  return (
    <div className="my-8">
      <div className="grid md:grid-cols-2 gap-6">
        {modelsData.map(model => (
          <div key={model.id} className="border rounded-lg p-6 bg-white">
            <h4 className="text-lg font-semibold mb-4">{model.name}</h4>

            <div className="space-y-4">
              {/* Context Window */}
              <div>
                <div className="text-sm font-medium text-gray-600">Context Window</div>
                <div className="text-lg font-bold">
                  {(model.context_tokens_max / 1000).toFixed(0)}K tokens
                </div>
                {customAnnotations?.context_tokens_max && highlightFields?.includes('context_tokens_max') && (
                  <div className="text-sm text-blue-600 mt-1">
                    {customAnnotations.context_tokens_max}
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div>
                <div className="text-sm font-medium text-gray-600">Pricing</div>
                <div className="text-sm">
                  <div>Input: ${model.pricing.input_per_1k}/1K tokens</div>
                  <div>Output: ${model.pricing.output_per_1k}/1K tokens</div>
                </div>
                {customAnnotations?.pricing && highlightFields?.includes('pricing') && (
                  <div className="text-sm text-blue-600 mt-1">
                    {customAnnotations.pricing}
                  </div>
                )}
              </div>

              {/* Capabilities */}
              <div>
                <div className="text-sm font-medium text-gray-600 mb-2">Capabilities</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(model.supports).map(([key, value]) => (
                    <span
                      key={key}
                      className={`px-2 py-1 text-xs rounded ${
                        value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {key.replace(/_/g, ' ')}
                      {value ? ' ✓' : ' ✗'}
                    </span>
                  ))}
                </div>
                {customAnnotations?.batch && highlightFields?.includes('supports') && (
                  <div className="text-sm text-blue-600 mt-2">
                    {customAnnotations.batch}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
