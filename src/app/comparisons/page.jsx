import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { getAllComparisons } from '@/lib/comparisons'
import { createMetadata } from '@/utils/createMetadata'
import  ComparisonSearch  from '@/components/ComparisonSearch'

export const metadata = createMetadata({
  title: "Vector Database Comparisons",
  description: "Compare different vector databases side by side"
});

export default async function ComparisonsIndex() {
  let comparisons = await getAllComparisons()

  return (
    <SimpleLayout
      title="Vector Database and Dev tools compared"
      intro="Compare different vector databases and devtools to find the best fit for your needs"
    >
      <ComparisonSearch comparisons={JSON.parse(JSON.stringify(comparisons))} />
    </SimpleLayout>
  )
}