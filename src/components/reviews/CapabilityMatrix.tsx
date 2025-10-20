'use client';

interface UseCase {
  name: string;
  relevantFields?: string[];
  commentary?: string;
}

interface CapabilityMatrixProps {
  tools: string[];  // Tool slugs
  groupBy?: 'useCase' | 'feature';
  useCases?: UseCase[];  // When groupBy="useCase", provide use case definitions
}

/**
 * Capability comparison matrix
 * Groups features by use case rather than generic checkboxes
 */
export function CapabilityMatrix({
  tools,
  groupBy = 'feature',
  useCases
}: CapabilityMatrixProps) {
  // TODO: Load actual tool data from manifests
  // Placeholder capabilities
  const capabilities: Record<string, Record<string, any>> = {
    'anthropic-api': {
      context_tokens_max: 200000,
      streaming: true,
      batch: false,
      data_retention_days: null,
      json_mode: true,
      tools_function_calling: true
    },
    'openai-api': {
      context_tokens_max: 128000,
      streaming: true,
      batch: true,
      data_retention_days: 30,
      json_mode: true,
      tools_function_calling: true
    }
  };

  const toolNames: Record<string, string> = {
    'anthropic-api': 'Anthropic',
    'openai-api': 'OpenAI'
  };

  if (groupBy === 'useCase' && useCases) {
    return (
      <div className="my-8 space-y-6">
        {useCases.map((useCase, idx) => (
          <div key={idx} className="border rounded-lg p-6 bg-gray-50">
            <h4 className="text-lg font-semibold mb-3">{useCase.name}</h4>

            {/* Show relevant capabilities for this use case */}
            {useCase.relevantFields && useCase.relevantFields.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                {tools.map(tool => (
                  <div key={tool} className="bg-white p-4 rounded border">
                    <div className="font-medium mb-2">{toolNames[tool]}</div>
                    <div className="space-y-1 text-sm">
                      {useCase.relevantFields!.map(field => {
                        const value = capabilities[tool]?.[field];
                        return (
                          <div key={field} className="flex justify-between">
                            <span className="text-gray-600">
                              {field.replace(/_/g, ' ')}:
                            </span>
                            <span className="font-medium">
                              {typeof value === 'boolean' ? (value ? '✓' : '✗') : value || 'N/A'}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Commentary */}
            {useCase.commentary && (
              <div className="text-sm text-blue-800 bg-blue-50 p-3 rounded">
                <strong>Bottom line:</strong> {useCase.commentary}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }

  // Default feature-based view
  return (
    <div className="my-8 overflow-x-auto">
      <table className="w-full border rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="p-3 text-left font-semibold">Feature</th>
            {tools.map(tool => (
              <th key={tool} className="p-3 text-center font-semibold">
                {toolNames[tool]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(capabilities[tools[0]] || {}).map(feature => (
            <tr key={feature} className="border-t">
              <td className="p-3 font-medium">{feature.replace(/_/g, ' ')}</td>
              {tools.map(tool => {
                const value = capabilities[tool]?.[feature];
                return (
                  <td key={tool} className="p-3 text-center">
                    {typeof value === 'boolean' ? (
                      <span className={value ? 'text-green-600' : 'text-gray-400'}>
                        {value ? '✓' : '✗'}
                      </span>
                    ) : (
                      value || 'N/A'
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
