import { Metadata } from 'next'
import { SimpleLayout } from '@/components/SimpleLayout'
import { Demo, Content } from '@/types'
import { ContentCard } from '@/components/ContentCard'
import { createMetadata } from '@/utils/createMetadata'

const embeddingsDemoHero = 'https://zackproser.b-cdn.net/images/embeddings-demo-hero.webp'
const tokenizationDemoHero = 'https://zackproser.b-cdn.net/images/tokenization-demo-hero.webp'
const chatbotDemoHero = 'https://zackproser.b-cdn.net/images/chatbot-demo-hero.webp'

export const metadata: Metadata = createMetadata({
  title: "Interactive Machine Learning Playground",
  description: "Build real intuition for modern ML concepts through guided, hands-on demos."
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
  }
];

export default async function Demos() {
  return (
    <SimpleLayout
      title="Master Machine Learning Concepts Through Play"
      intro="Work backwards from real-world AI challenges and experiment with the building blocks that solve them."
    >
      <div className="mt-10 space-y-6 text-base text-zinc-600 dark:text-zinc-400">
        <p>
          Each interactive walkthrough is crafted to make abstract ideas tangible. You will manipulate real data,
          see the math come alive, and understand exactly when to reach for each technique in your own products.
        </p>
        <ul className="space-y-3">
          <li className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-zinc-900 dark:text-zinc-100">
              Hands-on explorations that build intuition for embeddings, tokenization, and conversational AI.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-zinc-900 dark:text-zinc-100">
              Guided explanations connecting every interaction to the ML theory and product outcomes behind it.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="text-zinc-900 dark:text-zinc-100">
              Production-ready patterns you can adapt immediately to elevate your own machine learning experiences.
            </span>
          </li>
        </ul>
        <p>
          Start with the demo that matches the problem you are solving and follow the prompts to turn new knowledge into
          working intuition.
        </p>
      </div>
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
