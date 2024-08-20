import { Metadata } from 'next'
import ChatPageClient from './ChatPageClient'
import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: 'Chat with my writing',
  description: 'Chat with a custom RAG pipeline of my blog content using Pinecone, OpenAI, and LangChain.',
})

export default function ChatPage() {
  return <ChatPageClient />
}