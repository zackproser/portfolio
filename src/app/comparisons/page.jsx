import { SimpleLayout } from '@/components/SimpleLayout'
import { createManifestProvider } from '@/lib/manifests/loader'
import { createMetadata } from '@/utils/createMetadata'
import { ManifestBasedComparisonLanding } from '@/components/ManifestBasedComparisonLanding'

export const metadata = createMetadata({
  title: "AI Tool Comparisons - Find the Best Developer Tools",
  description: "Compare AI coding assistants, LLM APIs, vector databases, and frameworks. Find the perfect tool for your development needs with detailed comparisons."
});

export default async function ComparisonsIndex() {
  const provider = createManifestProvider();
  const manifestSlugs = await provider.list();

  return (
    <SimpleLayout
      intro="Compare AI coding assistants, LLM APIs, vector databases, and frameworks side by side. Find the perfect tool for your development needs with meaningful, category-based comparisons."
    >
      <ManifestBasedComparisonLanding manifestSlugs={manifestSlugs} />
    </SimpleLayout>
  )
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600