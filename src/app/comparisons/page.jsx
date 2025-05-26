import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllTools } from '@/actions/tool-actions'
import { createMetadata } from '@/utils/createMetadata'
import { DynamicComparisonSearch } from '@/components/dynamic-comparison-search'

export const metadata = createMetadata({
  title: "Developer Tool Comparisons",
  description: "Compare developer tools side by side to find the best fit for your needs"
});

export default async function ComparisonsIndex() {
  const tools = await getAllTools()

  return (
    <SimpleLayout
      title="Developer Tools Compared"
      intro="Compare developer tools side by side to find the perfect fit for your project needs. All comparisons are generated dynamically from our comprehensive database."
    >
      <DynamicComparisonSearch tools={tools} />
    </SimpleLayout>
  )
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600