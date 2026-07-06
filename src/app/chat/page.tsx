import { Metadata } from 'next'
import ChatPageClient from './ChatPageClient'
import { createMetadata } from '@/utils/createMetadata'

export const metadata: Metadata = createMetadata({
  title: 'Chat With My Writing — RAG Q&A on My Blog',
  description: 'Chat with a custom RAG pipeline built over my blog content using Pinecone, OpenAI, and LangChain. Ask questions and get grounded answers from my writing.',
})

export default async function ChatPage() {
  return <ChatPageClient />
}