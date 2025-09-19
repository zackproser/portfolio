import Link from 'next/link';
import { loadLlmApiManifest, createManifestProvider } from '@/lib/manifests/loader';

interface ManifestBasedComparisonLandingProps {
  manifestSlugs: string[];
}

export async function ManifestBasedComparisonLanding({ manifestSlugs }: ManifestBasedComparisonLandingProps) {
  const provider = createManifestProvider();
  
  // Load all manifests
  const manifests = await Promise.all(
    manifestSlugs.map(async (slug) => {
      try {
        return await loadLlmApiManifest(slug, provider);
      } catch (error) {
        console.error(`Failed to load manifest ${slug}:`, error);
        return null;
      }
    })
  ).then(results => results.filter(Boolean));

  // Group by category
  const manifestsByCategory = manifests.reduce((acc, manifest) => {
    if (manifest && !acc[manifest.category]) {
      acc[manifest.category] = [];
    }
    if (manifest) {
      acc[manifest.category].push(manifest);
    }
    return acc;
  }, {} as Record<string, typeof manifests>);

  return (
    <div className="space-y-12">
      {/* Featured Comparisons */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Comparisons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {manifests.slice(0, 6).map((manifest, index) => manifest ? (
            <div key={manifest.slug} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{manifest.name}</h3>
                <span className="text-sm text-gray-500 capitalize">{manifest.category.replace('_', ' ')}</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                {manifest.facts.models.length} model{manifest.facts.models.length !== 1 ? 's' : ''} available
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Starting price:</span>
                  <span className="font-medium">
                    {manifest.facts.models[0]?.pricing?.input_per_1k 
                      ? `$${manifest.facts.models[0].pricing.input_per_1k.toFixed(4)}/1K tokens`
                      : 'Contact for pricing'
                    }
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Context window:</span>
                  <span className="font-medium">
                    {manifest.facts.models[0]?.context_tokens_max?.toLocaleString() || 'Not specified'} tokens
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">SDKs:</span>
                  <span className="font-medium">{manifest.facts.sdks.official.length} official</span>
                </div>
              </div>
            </div>
          ) : null)}
        </div>
      </section>

      {/* Category-based Comparisons */}
      {Object.entries(manifestsByCategory).map(([category, categoryManifests]) => (
        <section key={category}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 capitalize">
            {category.replace('_', ' ')} Comparisons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryManifests.map((manifest) => manifest ? (
              <div key={manifest.slug} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{manifest.name}</h3>
                  <a 
                    href={manifest.homepage_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Visit Site →
                  </a>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  {manifest.facts.models.length} model{manifest.facts.models.length !== 1 ? 's' : ''} available
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Starting price:</span>
                    <span className="font-medium">
                      {manifest.facts.models[0]?.pricing?.input_per_1k 
                        ? `$${manifest.facts.models[0].pricing.input_per_1k.toFixed(4)}/1K tokens`
                        : 'Contact for pricing'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Context window:</span>
                    <span className="font-medium">
                      {manifest.facts.models[0]?.context_tokens_max?.toLocaleString() || 'Not specified'} tokens
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">SDKs:</span>
                    <span className="font-medium">{manifest.facts.sdks.official.length} official</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link 
                    href={`/comparisons/${manifest.slug}`}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ) : null)}
          </div>
        </section>
      ))}

      {/* Quick Comparison Links */}
      {manifests.length >= 2 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Comparisons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {manifests.slice(0, 6).map((manifest1, index) => 
              manifest1 ? manifests.slice(index + 1, 6).map((manifest2) => 
                manifest2 ? (
                <Link
                  key={`${manifest1.slug}-vs-${manifest2.slug}`}
                  href={`/comparisons/${manifest1.slug}/vs/${manifest2.slug}`}
                  className="block bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {manifest1.name} vs {manifest2.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Compare pricing, features, and capabilities
                      </p>
                    </div>
                    <div className="text-blue-600 text-sm font-medium">
                      Compare →
                    </div>
                  </div>
                </Link>
                ) : null
              ) : null
            )}
          </div>
        </section>
      )}
    </div>
  );
}
