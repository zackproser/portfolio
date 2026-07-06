import { Metadata } from 'next'
import ChatPageClient from './ChatPageClient'
import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: 'Chat With My Writing — RAG-Powered AI Assistant',
  description: 'Chat with a custom RAG pipeline built on my blog content using Pinecone, OpenAI, and LangChain, and get answers grounded in my writing.',
})

export default async function ChatPage() {
  return <ChatPageClient />
}