import { Metadata } from 'next'
import { Content } from '@/types'
import { createMetadata } from '@/utils/createMetadata'
import DemosClient from './demos-client'

const embeddingsDemoHero = 'https://zackproser.b-cdn.net/images/embeddings-demo-hero.webp'
const tokenizationDemoHero = 'https://zackproser.b-cdn.net/images/tokenization-demo-hero.webp'
const chatbotDemoHero = 'https://zackproser.b-cdn.net/images/chatbot-demo-hero.webp'
const ragVisualizedHero = 'https://zackproser.b-cdn.net/images/rag-demo-hero.webp'
const voiceAIDemoHero = 'https://zackproser.b-cdn.net/images/voice-ai-hero.webp'

export const metadata: Metadata = createMetadata({
  title: "NLP, ML and AI interactive Demos",
  description: "Learn the latest techniques through interactive demos"
});

// Hardcoded demo data since these are React components, not MDX files
const demos: Content[] = [
  {
    slug: '/demos/voice-ai',
    title: 'Voice-First AI Experience',
    description: 'Interactive demo of voice-driven development with WisprFlow and Granola. See how speaking at 170+ WPM enables multi-agent orchestration and transforms productivity.',
    author: 'Zachary Proser',
    date: '2025-11-25',
    type: 'demo',
    image: voiceAIDemoHero
  },
  {
    slug: '/demos/rag-visualized',
    title: 'RAG Visualized Experience',
    description: 'Interactive RAG walkthrough that shows why retrieval reduces hallucinations, trims cost, and lets experienced engineers ship grounded copilots fast.',
    author: 'Zachary Proser',
    date: '2025-11-01',
    type: 'demo',
    image: ragVisualizedHero
  },
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

export default function Demos() {
  return <DemosClient demos={demos} />
}
