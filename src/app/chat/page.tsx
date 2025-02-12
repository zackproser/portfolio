import { Metadata } from 'next'
import ChatPageClient from './ChatPageClient'
import { createMetadata } from '@/utils/createMetadata'
import { getAllArticles } from '@/lib/articles'

export const metadata: Metadata = createMetadata({
  title: 'Chat with my writing',
  description: 'Chat with a custom RAG pipeline of my blog content using Pinecone, OpenAI, and LangChain.',
})

export default async function ChatPage() {
  // Pre-fetch all articles on the server side
  const articles = await getAllArticles()
  
  // Pass articles as props to client component
  return <ChatPageClient initialArticles={articles} />
}