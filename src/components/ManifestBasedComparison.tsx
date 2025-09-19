import type { ToolManifest } from "@/lib/manifests/types/base";
import type { LlmApiFacts } from "@/lib/manifests/types/llm_api";
import { FactWithCitation, ComparisonFactCell } from "./FactWithCitation";

interface ManifestBasedComparisonProps {
  tool1: ToolManifest<LlmApiFacts>;
  tool2: ToolManifest<LlmApiFacts>;
}

export function ManifestBasedComparison({ tool1, tool2 }: ManifestBasedComparisonProps) {
  // Generate editorial verdict
  const verdict = generateVerdict(tool1, tool2);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Editorial Verdict */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">Our Verdict</h2>
        <p className="text-blue-800">{verdict}</p>
      </div>

      {/* Facts Comparison Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Technical Comparison</h2>
          <p className="text-gray-600 text-sm">All facts verified from official sources</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tool1.name}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {tool2.name}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {/* Models */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Models</td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {tool1.facts.models.map((model, index) => (
                      <div key={index} className="text-sm">
                        <FactWithCitation
                          value={model.name}
                          jsonPointer={`/facts/models/${index}/name`}
                          provenance={tool1.provenance}
                        />
                        <div className="text-gray-600 text-xs ml-2">
                          {model.modality.join(", ")} • {model.context_tokens_max?.toLocaleString()} tokens
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    {tool2.facts.models.map((model, index) => (
                      <div key={index} className="text-sm">
                        <FactWithCitation
                          value={model.name}
                          jsonPointer={`/facts/models/${index}/name`}
                          provenance={tool2.provenance}
                        />
                        <div className="text-gray-600 text-xs ml-2">
                          {model.modality.join(", ")} • {model.context_tokens_max?.toLocaleString()} tokens
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Pricing - Input */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Input Pricing (per 1K tokens)</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {tool1.facts.models.map((model, index) => (
                      <div key={index} className="text-sm">
                        <FactWithCitation
                          value={model.name}
                          jsonPointer={`/facts/models/${index}/name`}
                          provenance={tool1.provenance}
                        />
                        <span className="ml-2">
                          <ComparisonFactCell
                            value={model.pricing.input_per_1k ? `$${model.pricing.input_per_1k.toFixed(4)}` : null}
                            jsonPointer={`/facts/models/${index}/pricing/input_per_1k`}
                            provenance={tool1.provenance}
                            fallback="Not published"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {tool2.facts.models.map((model, index) => (
                      <div key={index} className="text-sm">
                        <FactWithCitation
                          value={model.name}
                          jsonPointer={`/facts/models/${index}/name`}
                          provenance={tool2.provenance}
                        />
                        <span className="ml-2">
                          <ComparisonFactCell
                            value={model.pricing.input_per_1k ? `$${model.pricing.input_per_1k.toFixed(4)}` : null}
                            jsonPointer={`/facts/models/${index}/pricing/input_per_1k`}
                            provenance={tool2.provenance}
                            fallback="Not published"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Pricing - Output */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Output Pricing (per 1K tokens)</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {tool1.facts.models.map((model, index) => (
                      <div key={index} className="text-sm">
                        <FactWithCitation
                          value={model.name}
                          jsonPointer={`/facts/models/${index}/name`}
                          provenance={tool1.provenance}
                        />
                        <span className="ml-2">
                          <ComparisonFactCell
                            value={model.pricing.output_per_1k ? `$${model.pricing.output_per_1k.toFixed(4)}` : null}
                            jsonPointer={`/facts/models/${index}/pricing/output_per_1k`}
                            provenance={tool1.provenance}
                            fallback="Not published"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {tool2.facts.models.map((model, index) => (
                      <div key={index} className="text-sm">
                        <FactWithCitation
                          value={model.name}
                          jsonPointer={`/facts/models/${index}/name`}
                          provenance={tool2.provenance}
                        />
                        <span className="ml-2">
                          <ComparisonFactCell
                            value={model.pricing.output_per_1k ? `$${model.pricing.output_per_1k.toFixed(4)}` : null}
                            jsonPointer={`/facts/models/${index}/pricing/output_per_1k`}
                            provenance={tool2.provenance}
                            fallback="Not published"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>

              {/* Rate Limits */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Rate Limits</td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {tool1.facts.models.map((model, index) => (
                      <div key={index} className="text-sm">
                        <FactWithCitation
                          value={model.name}
                          jsonPointer={`/facts/models/${index}/name`}
                          provenance={tool1.provenance}
                        />
                        <div className="ml-2 text-gray-600">
                          <ComparisonFactCell
                            value={model.rate_limits?.rpm ? `${model.rate_limits.rpm.toLocaleString()} RPM` : null}
                            jsonPointer={`/facts/models/${index}/rate_limits/rpm`}
                            provenance={tool1.provenance}
                            fallback="Varies by tier"
                          />
                          {" • "}
                          <ComparisonFactCell
                            value={model.rate_limits?.tpm ? `${model.rate_limits.tpm.toLocaleString()} TPM` : null}
                            jsonPointer={`/facts/models/${index}/rate_limits/tpm`}
                            provenance={tool1.provenance}
                            fallback="Varies by tier"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    {tool2.facts.models.map((model, index) => (
                      <div key={index} className="text-sm">
                        <FactWithCitation
                          value={model.name}
                          jsonPointer={`/facts/models/${index}/name`}
                          provenance={tool2.provenance}
                        />
                        <div className="ml-2 text-gray-600">
                          <ComparisonFactCell
                            value={model.rate_limits?.rpm ? `${model.rate_limits.rpm.toLocaleString()} RPM` : null}
                            jsonPointer={`/facts/models/${index}/rate_limits/rpm`}
                            provenance={tool2.provenance}
                            fallback="Varies by tier"
                          />
                          {" • "}
                          <ComparisonFactCell
                            value={model.rate_limits?.tpm ? `${model.rate_limits.tpm.toLocaleString()} TPM` : null}
                            jsonPointer={`/facts/models/${index}/rate_limits/tpm`}
                            provenance={tool2.provenance}
                            fallback="Varies by tier"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>

              {/* SDKs */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Official SDKs</td>
                <td className="px-6 py-4">
                  <FactWithCitation
                    value={tool1.facts.sdks.official.join(", ")}
                    jsonPointer="/facts/sdks/official"
                    provenance={tool1.provenance}
                  />
                </td>
                <td className="px-6 py-4">
                  <FactWithCitation
                    value={tool2.facts.sdks.official.join(", ")}
                    jsonPointer="/facts/sdks/official"
                    provenance={tool2.provenance}
                  />
                </td>
              </tr>

              {/* Terms */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Production Use</td>
                <td className="px-6 py-4">
                  <FactWithCitation
                    value={tool1.facts.terms?.allowed_prod_use ? "Allowed" : "Restricted"}
                    jsonPointer="/facts/terms/allowed_prod_use"
                    provenance={tool1.provenance}
                  />
                </td>
                <td className="px-6 py-4">
                  <FactWithCitation
                    value={tool2.facts.terms?.allowed_prod_use ? "Allowed" : "Restricted"}
                    jsonPointer="/facts/terms/allowed_prod_use"
                    provenance={tool2.provenance}
                  />
                </td>
              </tr>

              {/* Data Retention */}
              <tr>
                <td className="px-6 py-4 font-medium text-gray-900">Data Retention</td>
                <td className="px-6 py-4">
                  <ComparisonFactCell
                    value={tool1.facts.terms?.data_retention_days ? `${tool1.facts.terms.data_retention_days} days` : null}
                    jsonPointer="/facts/terms/data_retention_days"
                    provenance={tool1.provenance}
                    fallback="Not specified"
                  />
                </td>
                <td className="px-6 py-4">
                  <ComparisonFactCell
                    value={tool2.facts.terms?.data_retention_days ? `${tool2.facts.terms.data_retention_days} days` : null}
                    jsonPointer="/facts/terms/data_retention_days"
                    provenance={tool2.provenance}
                    fallback="Not specified"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function generateVerdict(tool1: ToolManifest<LlmApiFacts>, tool2: ToolManifest<LlmApiFacts>): string {
  // Simple editorial logic based on facts
  const tool1HasLowerPricing = tool1.facts.models.some(m => 
    m.pricing.input_per_1k && m.pricing.input_per_1k < 0.001
  );
  const tool2HasLowerPricing = tool2.facts.models.some(m => 
    m.pricing.input_per_1k && m.pricing.input_per_1k < 0.001
  );
  
  const tool1HasMoreModels = tool1.facts.models.length > tool2.facts.models.length;
  const tool2HasMoreModels = tool2.facts.models.length > tool1.facts.models.length;
  
  if (tool1HasLowerPricing && tool1HasMoreModels) {
    return `Choose ${tool1.name} for cost-effective development with a wide range of models. Choose ${tool2.name} for specific use cases that benefit from its specialized capabilities.`;
  } else if (tool2HasLowerPricing && tool2HasMoreModels) {
    return `Choose ${tool2.name} for cost-effective development with a wide range of models. Choose ${tool1.name} for specific use cases that benefit from its specialized capabilities.`;
  } else {
    return `Both ${tool1.name} and ${tool2.name} offer competitive features. Choose based on your specific requirements for pricing, model capabilities, and SDK support.`;
  }
}
