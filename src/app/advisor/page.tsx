import type { Metadata } from 'next'
import AdvisorExperience from '@/components/advisor/AdvisorExperience'
import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: 'AI Tool Advisor — Get a Straight Answer',
  description: 'Answer a question or two and get a practical AI tool recommendation, including the tradeoffs and articles that support it.',
})

export default function AdvisorPage() {
  return <AdvisorExperience />
}
