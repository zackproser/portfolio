import { Metadata } from 'next'
import { Content } from '@/types'
import { createMetadata } from '@/utils/createMetadata'
import DemosClient from './demos-client'

const embeddingsDemoHero = 'https://zackproser.b-cdn.net/images/embeddings-demo-hero.webp'
const tokenizationDemoHero = 'https://zackproser.b-cdn.net/images/tokenization-demo-hero.webp'
const chatbotDemoHero = 'https://zackproser.b-cdn.net/images/chatbot-demo-hero.webp'
const ragVisualizedHero = 'https://zackproser.b-cdn.net/images/rag-demo-hero.webp'
const voiceAIDemoHero = 'https://zackproser.b-cdn.net/images/voice-ai-hero.webp'
const realtorDemoHero = 'https://zackproser.b-cdn.net/images/wisprflow.webp'
const lawyerDemoHero = 'https://zackproser.b-cdn.net/images/voice-ai-hero.webp'
const firecrawlDemoHero = 'https://zackproser.b-cdn.net/images/firecrawl-hero.webp'

export const metadata: Metadata = createMetadata({
  title: "NLP, ML and AI interactive Demos",
  description: "Learn the latest techniques through interactive demos"
});

// Featured voice demo (generic)
const featuredVoiceDemo: Content = {
  slug: '/demos/voice-ai',
  title: 'Voice-First AI Experience',
  description: 'Interactive demo of voice-driven development with WisprFlow and Granola. See how speaking at 170+ WPM enables multi-agent orchestration and transforms productivity.',
  author: 'Zachary Proser',
  date: '2025-11-25',
  type: 'demo',
  image: voiceAIDemoHero
};

// Vertical-specific voice demos
const verticalVoiceDemos: Content[] = [
  {
    slug: '/demos/voice-ai-lawyers',
    title: 'Voice AI for Legal Professionals',
    description: 'See how attorneys dictate motions, capture client consultations, and draft documents faster with voice AI. Interactive demo with real legal scenarios.',
    author: 'Zachary Proser',
    date: '2026-02-09',
    type: 'demo',
    image: lawyerDemoHero
  },
  {
    slug: '/demos/voice-ai-realtors',
    title: 'Voice AI for Real Estate Agents',
    description: 'See how top-producing agents dictate MLS listings in 2 minutes, capture buyer consultations automatically, and save 11+ hours per week with voice AI.',
    author: 'Zachary Proser',
    date: '2026-02-09',
    type: 'demo',
    image: realtorDemoHero
  },
];

// All other demos
const otherDemos: Content[] = [
  {
    slug: '/demos/firecrawl',
    title: 'Web Scraping for AI',
    description: 'See how Firecrawl turns any website into clean, structured data for AI agents, RAG pipelines, and LLM applications. Interactive crawling pipeline demo.',
    author: 'Zachary Proser',
    date: '2026-02-09',
    type: 'demo',
    image: firecrawlDemoHero
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

// Combined for the client component
const demos: Content[] = [featuredVoiceDemo, ...verticalVoiceDemos, ...otherDemos];

export default function Demos() {
  return <DemosClient demos={demos} featuredVoiceDemo={featuredVoiceDemo} verticalVoiceDemos={verticalVoiceDemos} otherDemos={otherDemos} />
}
