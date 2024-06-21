import { ReactNode, Suspense } from 'react';
import Link from 'next/link';
import RandomImage from './RandomImage';

function ChatLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-16 sm:mt-32">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start mb-8">
          <div className="flex-grow pr-6">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
              Chat with me
            </h1>
            <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
              This experience uses Pinecone, OpenAI and LangChain...
            </p>
            <p className="mt-4 prose dark:text-white">
              Learn how to build this <Link href="/blog/langchain-pinecone-chat-with-my-blog">with my tutorial</Link>
            </p>
          </div>
          <div className="flex-shrink-0 w-64">
            <Suspense fallback={<div className="w-64 h-64 bg-gray-200 rounded-lg"></div>}>
              <RandomImage />
            </Suspense>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

export default ChatLayout;
