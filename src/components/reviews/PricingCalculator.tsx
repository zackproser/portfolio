'use client';

import { useState, useEffect } from 'react';

interface PricingScenario {
  name: string;
  input: number;  // Input tokens
  output: number; // Output tokens
  note?: string;
}

interface PricingCalculatorProps {
  toolsData: Array<{
    id: string;
    name: string;
    pricing: {
      input_per_1k: number;
      output_per_1k: number;
    };
  }>;
  scenarios?: PricingScenario[];
  showAffiliateLinks?: boolean;
  affiliateLinks?: Record<string, string>;
  customCommentary?: string;
}

/**
 * Interactive pricing calculator that uses data from YAML manifests
 * Allows users to input their usage and see real cost comparisons
 */
export function PricingCalculator({
  toolsData,
  scenarios,
  showAffiliateLinks = false,
  affiliateLinks,
  customCommentary
}: PricingCalculatorProps) {
  const [inputTokens, setInputTokens] = useState(1000000);
  const [outputTokens, setOutputTokens] = useState(250000);

  const calculateCost = (toolData: typeof toolsData[0], input: number, output: number) => {
    return ((input / 1000) * toolData.pricing.input_per_1k) +
           ((output / 1000) * toolData.pricing.output_per_1k);
  };

  return (
    <div className="border rounded-lg p-6 my-8 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Cost Calculator</h3>

      {/* Input controls */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Input Tokens per Month
          </label>
          <input
            type="number"
            value={inputTokens}
            onChange={(e) => setInputTokens(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Output Tokens per Month
          </label>
          <input
            type="number"
            value={outputTokens}
            onChange={(e) => setOutputTokens(Number(e.target.value))}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* Cost comparison */}
      <div className="space-y-3 mb-6">
        {toolsData.map(tool => {
          const cost = calculateCost(tool, inputTokens, outputTokens);

          return (
            <div key={tool.id} className="flex justify-between items-center p-3 bg-white rounded border">
              <span className="font-medium">{tool.name}</span>
              <span className="text-lg font-bold">${cost.toFixed(2)}/month</span>
            </div>
          );
        })}
      </div>

      {/* Preset scenarios */}
      {scenarios && scenarios.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Common Scenarios</h4>
          <div className="space-y-2">
            {scenarios.map((scenario, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputTokens(scenario.input);
                  setOutputTokens(scenario.output);
                }}
                className="w-full text-left p-3 bg-white rounded border hover:border-blue-500 transition-colors"
              >
                <div className="font-medium">{scenario.name}</div>
                {scenario.note && (
                  <div className="text-sm text-gray-600">{scenario.note}</div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Commentary */}
      {customCommentary && (
        <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
          {customCommentary}
        </div>
      )}

      {/* Affiliate links */}
      {showAffiliateLinks && affiliateLinks && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-sm text-gray-600 mb-2">Ready to try them?</p>
          <div className="flex gap-2 flex-wrap">
            {toolsData.map(tool => {
              const link = affiliateLinks[tool.id];
              if (!link) return null;

              return (
                <a
                  key={tool.id}
                  href={link}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Try {tool.name}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
