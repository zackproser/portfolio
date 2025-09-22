import { SimpleLayout } from '@/components/SimpleLayout'
import { createMetadata } from '@/utils/createMetadata'
import { DecisionIndex } from '@/components/DecisionIndex'
import { decisionEngineLoader } from '@/lib/decision-engine/loader'

export const metadata = createMetadata({
  title: "AI Tool Comparisons - Find the Best Developer Tools",
  description: "Compare AI coding assistants, LLM APIs, vector databases, and frameworks. Find the perfect tool for your development needs with detailed comparisons."
});

export default async function ComparisonsIndex() {
  const tools = await decisionEngineLoader.loadAllTools();
  const featuredComparisons = await decisionEngineLoader.getFeaturedComparisons();

  return (
    <SimpleLayout
      intro="Compare AI coding assistants, LLM APIs, vector databases, and frameworks side by side. Find the perfect tool for your development needs with meaningful, category-based comparisons."
    >
      <DecisionIndex tools={tools} featuredComparisons={featuredComparisons} />
    </SimpleLayout>
  )
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600