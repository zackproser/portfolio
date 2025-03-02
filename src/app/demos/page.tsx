import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Demo, Content } from '@/types'
import { ContentCard } from '@/components/ContentCard'
import { createMetadata } from '@/utils/createMetadata'

import vectorDatabasesExamined from '@/images/vector-databases-examined.webp'
import tokenizationDemo from '@/images/tokenization-demo.webp'

export const metadata: Metadata = createMetadata({
  title: "NLP, ML and AI interactive Demos",
  description: "Learn the latest techniques through interactive demos"
});

// Hardcoded demo data since these are React components, not MDX files
const demos: Content[] = [
  {
    slug: 'embeddings',
    title: 'Embeddings Demo',
    description: 'Interactive demo of converting natural language into vectors or embeddings, a fundamental technique used in natural language processing (NLP) and generative AI.',
    author: 'Zachary Proser',
    date: '2024-01-01',
    type: 'demo',
    image: vectorDatabasesExamined
  },
  {
    slug: 'tokenize',
    title: 'Tokenizer Demo',
    description: 'Interactive demo of how text is broken down into tokens for processing by language models.',
    author: 'Zachary Proser',
    date: '2024-01-01',
    type: 'demo',
    image: tokenizationDemo
  }
];

export default async function Demos() {
  return (
    <SimpleLayout
      title="NLP, ML and AI interactive Demos"
      intro="Learn the latest techniques through interactive demos."
    >
      <div className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40">
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {demos.map((demo) => (
            <ContentCard key={demo.slug} article={demo} />
          ))}
        </div>
      </div>
    </SimpleLayout>
  )
}
