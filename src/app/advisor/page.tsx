import type { Metadata } from 'next'
import AdvisorExperience from '@/components/advisor/AdvisorExperience'
import { createMetadata } from '@/utils/createMetadata'

const title = 'Which AI Tool Should I Use? Ask the AI Tool Advisor'
const description = 'Ask a question or two and get an honest AI tool recommendation, tradeoffs, and supporting posts. New Granola signups get 3 months free.'
const url = 'https://zackproser.com/advisor'

const generatedMetadata = createMetadata({
  title,
  description,
  author: 'Zachary Proser',
  type: 'demo',
  slug: 'advisor',
  keywords: [
    'which ai tool should i use',
    'ai tool advisor',
    'ai meeting notes recommendation',
    'best ai note taker',
    'granola vs otter',
    'voice dictation for coding',
    'web scraping api',
  ],
})

export const metadata: Metadata = {
  ...generatedMetadata,
  alternates: { canonical: url },
  openGraph: {
    ...generatedMetadata.openGraph,
    url,
  },
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'AI Tool Advisor',
  url,
  description,
  applicationCategory: 'BusinessApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  publisher: {
    '@type': 'Person',
    name: 'Zachary Proser',
    url: 'https://zackproser.com',
  },
}

export default function AdvisorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />
      <AdvisorExperience />
    </>
  )
}
