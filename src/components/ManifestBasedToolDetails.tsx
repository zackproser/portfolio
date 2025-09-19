import type { ToolManifest } from "@/lib/manifests/types/base";
import type { LlmApiFacts } from "@/lib/manifests/types/llm_api";
import { FactWithCitation, ComparisonFactCell } from "./FactWithCitation";
import Link from "next/link";

interface ManifestBasedToolDetailsProps {
  manifest: ToolManifest<LlmApiFacts>;
}

export function ManifestBasedToolDetails({ manifest }: ManifestBasedToolDetailsProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{manifest.name}</h1>
            <p className="text-gray-600 mb-4 capitalize">{manifest.category.replace('_', ' ')}</p>
            <div className="flex gap-4">
              <a 
                href={manifest.homepage_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Visit Official Site
              </a>
              {manifest.docs_url && (
                <a 
                  href={manifest.docs_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Documentation
                </a>
              )}
              {manifest.github_repo && (
                <a 
                  href={`https://github.com/${manifest.github_repo}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Last verified: {new Date(manifest.as_of).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Models */}
      <div className="bg-white rounded-lg shadow-sm border mb-8">
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">Available Models</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {manifest.facts.models.map((model, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    <FactWithCitation
                      value={model.name}
                      jsonPointer={`/facts/models/${index}/name`}
                      provenance={manifest.provenance}
                    />
                  </h3>
                  <span className="text-sm text-gray-500 capitalize">{model.availability}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Capabilities</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Modalities:</span>
                        <span>{model.modality.join(", ")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Context:</span>
                        <ComparisonFactCell
                          value={model.context_tokens_max ? `${model.context_tokens_max.toLocaleString()} tokens` : null}
                          jsonPointer={`/facts/models/${index}/context_tokens_max`}
                          provenance={manifest.provenance}
                          fallback="Not specified"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Pricing (per 1K tokens)</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Input:</span>
                        <ComparisonFactCell
                          value={model.pricing.input_per_1k ? `$${model.pricing.input_per_1k.toFixed(4)}` : null}
                          jsonPointer={`/facts/models/${index}/pricing/input_per_1k`}
                          provenance={manifest.provenance}
                          fallback="Not published"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Output:</span>
                        <ComparisonFactCell
                          value={model.pricing.output_per_1k ? `$${model.pricing.output_per_1k.toFixed(4)}` : null}
                          jsonPointer={`/facts/models/${index}/pricing/output_per_1k`}
                          provenance={manifest.provenance}
                          fallback="Not published"
                        />
                      </div>
                      {model.pricing.embeddings_per_1k && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Embeddings:</span>
                          <FactWithCitation
                            value={`$${model.pricing.embeddings_per_1k.toFixed(4)}`}
                            jsonPointer={`/facts/models/${index}/pricing/embeddings_per_1k`}
                            provenance={manifest.provenance}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Rate Limits</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">RPM:</span>
                        <ComparisonFactCell
                          value={model.rate_limits?.rpm ? `${model.rate_limits.rpm.toLocaleString()}` : null}
                          jsonPointer={`/facts/models/${index}/rate_limits/rpm`}
                          provenance={manifest.provenance}
                          fallback="Varies by tier"
                        />
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">TPM:</span>
                        <ComparisonFactCell
                          value={model.rate_limits?.tpm ? `${model.rate_limits.tpm.toLocaleString()}` : null}
                          jsonPointer={`/facts/models/${index}/rate_limits/tpm`}
                          provenance={manifest.provenance}
                          fallback="Varies by tier"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(model.supports).map(([feature, supported]) => (
                      <span 
                        key={feature}
                        className={`px-2 py-1 rounded text-xs ${
                          supported 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {feature.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SDKs and Terms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">SDK Support</h2>
          </div>
          <div className="p-6">
            <div className="mb-4">
              <h3 className="font-medium text-gray-900 mb-2">Official SDKs</h3>
              <FactWithCitation
                value={manifest.facts.sdks.official.join(", ")}
                jsonPointer="/facts/sdks/official"
                provenance={manifest.provenance}
              />
            </div>
            {manifest.facts.sdks.community && manifest.facts.sdks.community.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Community SDKs</h3>
                <FactWithCitation
                  value={manifest.facts.sdks.community.join(", ")}
                  jsonPointer="/facts/sdks/community"
                  provenance={manifest.provenance}
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold">Terms & Policies</h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Production Use:</span>
                <FactWithCitation
                  value={manifest.facts.terms?.allowed_prod_use ? "Allowed" : "Restricted"}
                  jsonPointer="/facts/terms/allowed_prod_use"
                  provenance={manifest.provenance}
                />
              </div>
              {manifest.facts.terms?.pii_restrictions && (
                <div className="flex justify-between">
                  <span className="text-gray-600">PII Restrictions:</span>
                  <FactWithCitation
                    value={manifest.facts.terms.pii_restrictions}
                    jsonPointer="/facts/terms/pii_restrictions"
                    provenance={manifest.provenance}
                  />
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Data Retention:</span>
                <ComparisonFactCell
                  value={manifest.facts.terms?.data_retention_days ? `${manifest.facts.terms.data_retention_days} days` : null}
                  jsonPointer="/facts/terms/data_retention_days"
                  provenance={manifest.provenance}
                  fallback="Not specified"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
