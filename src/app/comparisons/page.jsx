import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllTools } from '@/actions/tool-actions'
import { createMetadata } from '@/utils/createMetadata'
import { DynamicComparisonSearch } from '@/components/dynamic-comparison-search'
import { AskAdvisorCTA } from '@/components/advisor/AskAdvisorCTA'

export const metadata = createMetadata({
  title: "Developer Tool Comparisons — Compare Tools Side by Side",
  description: "Compare developer and AI tools side by side — features, pricing, and trade-offs — to find the best fit for your stack and your team's needs."
});

export default async function ComparisonsIndex() {
  const tools = await getAllTools()

  return (
    <SimpleLayout
      title="Developer Tools Compared"
      intro="Compare developer tools side by side to find the perfect fit for your project needs. All comparisons are generated dynamically from our comprehensive database."
    >
      <DynamicComparisonSearch tools={tools} />
      <AskAdvisorCTA
        from="comparisons"
        variant="compact"
        className="mt-6"
      />
    </SimpleLayout>
  )
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600
