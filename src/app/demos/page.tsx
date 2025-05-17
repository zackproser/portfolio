import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Demo, Content } from '@/types'
import { ContentCard } from '@/components/ContentCard'
import { createMetadata } from '@/utils/createMetadata'

import embeddingsDemoHero from '@/images/embeddings-demo-hero.webp'
import tokenizationDemoHero from '@/images/tokenization-demo-hero.webp'
import chatbotDemoHero from '@/images/chatbot-demo-hero.webp'
import vectorDatabaseDemoHero from '@/images/pinecone-vector-databases.webp'

export const metadata: Metadata = createMetadata({
  title: "NLP, ML and AI interactive Demos",
  description: "Learn the latest techniques through interactive demos"
});

// Hardcoded demo data since these are React components, not MDX files
const demos: Content[] = [
  {
    slug: '/chat',
    title: 'AI Chatbot Experience',
    description: 'Try out a live AI chatbot powered by large language models. Experience firsthand how modern AI can understand and respond to your questions in real-time.',
    author: 'Zachary Proser',
    date: '2024-01-01',
    type: 'demo',
    image: chatbotDemoHero
  },
  {
    slug: '/demos/embeddings',
    title: 'Embeddings Demo',
    description: 'Interactive demo of converting natural language into vectors or embeddings, a fundamental technique used in natural language processing (NLP) and generative AI.',
    author: 'Zachary Proser',
    date: '2024-01-01',
    type: 'demo',
    image: embeddingsDemoHero
  },
  {
    slug: '/demos/tokenize',
    title: 'Tokenizer Demo',
    description: 'Interactive demo of how text is broken down into tokens for processing by language models.',
    author: 'Zachary Proser',
    date: '2024-01-01',
    type: 'demo',
    image: tokenizationDemoHero
  },
  {
    slug: '/demos/vectordatabase',
    title: 'Vector Database Demo',
    description: 'Step through the basics of namespaces, upserts, and similarity search.',
    author: 'Zachary Proser',
    date: '2024-01-01',
    type: 'demo',
    image: vectorDatabaseDemoHero
  }
];

export default async function Demos() {
  return (
    <SimpleLayout
      title="Interactive AI & ML Demos"
      intro="Explore cutting-edge AI techniques through hands-on interactive experiences."
    >
      <section className="md:border-l md:border-zinc-100 md:pl-6 md:dark:border-zinc-700/40 pb-24">
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {demos.map((demo) => (
            <ContentCard key={demo.slug} article={demo} />
          ))}
        </div>
      </section>
    </SimpleLayout>
  )
}
