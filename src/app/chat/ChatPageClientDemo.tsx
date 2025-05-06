'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { Container } from '@/components/Container';
import { useChat } from 'ai/react';
import { clsx } from 'clsx';
import RandomPortrait from '@/components/RandomPortrait';
import SearchForm from '@/components/SearchForm';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { ContentCard } from '@/components/ContentCard';
import { BlogWithSlug } from '@/types';

const prepopulatedQuestions = [
  "What is the programming bug?",
  "Why do you love Next.js so much?",
  "What do you do at Pinecone?",
  "How can I become a better developer?",
  "What is ggshield and why is it important?",
  "How can I use AI to complete side projects more quickly?"
];

export default function ChatPageClientDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<BlogWithSlug[]>([]);
  const [isClient, setIsClient] = useState(false);

  const { messages, input, setInput, handleSubmit, reload: resetChat } = useChat({
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources');
      const parsedArticles: BlogWithSlug[] = sourcesHeader
        ? (JSON.parse(atob(sourcesHeader as string)) as BlogWithSlug[])
        : [];
      setArticles(parsedArticles);
      setIsLoading(false);
    },
    headers: {},
    onFinish() {},
    onError() {
      setIsLoading(false);
    }
  });

  const handleSearch = async (query: string) => {
    setInput(query);
    const customSubmitEvent = {
      preventDefault: () => { },
    } as unknown as React.FormEvent<HTMLFormElement>;
    await handleSubmit(customSubmitEvent);
  };

  const clearChatState = () => {
    resetChat();
    setArticles([]);
    setInput("");
    const currentMessages = messages.length;
    setTimeout(() => {
      if (messages.length === currentMessages) {
        resetChat();
      }
    }, 100);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <Container>
      <div className="max-w-7xl mx-auto mt-16 sm:mt-32">
        <div className="flex flex-col md:flex-row items-start mb-12">
          <div className="flex-1 pl-8">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl mb-6">
              Internal RAG Chatbot Demo
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 mb-6">
              This is a demonstration of a Retrieval-Augmented Generation (RAG) chatbot. Enter your question below to see how it responds using internal documentation.
            </p>
          </div>
          <div className="mt-6 md:mt-0 w-full md:w-80 h-80">
            <Suspense fallback={<div className="w-full h-full bg-gray-200 rounded-lg pr-8 mr-8"></div>}>
              <RandomPortrait width={300} height={300} />
            </Suspense>
          </div>
        </div>

        {/* Chat interface */}
        <div className="mb-8">
          <SearchForm
            suggestedSearches={prepopulatedQuestions}
            onSearch={handleSearch}
            setIsLoading={setIsLoading}
            buttonText="Ask question"
            onClearChat={clearChatState}
            showClearButton={messages.length > 0}
          />
        </div>

        {isLoading && messages?.length > 0 && <LoadingAnimation />}

        {/* Chat messages and related posts */}
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 pr-0 md:pr-6 mb-6 md:mb-0">
            {messages.map((m) => (
              <div
                key={m.id}
                className="mb-4 whitespace-pre-wrap text-lg leading-relaxed"
              >
                <span
                  className={clsx('font-bold', {
                    'text-blue-700': m.role === 'user',
                    'text-green-700': m.role !== 'user',
                  })}
                >
                  {m.role === 'user'
                    ? 'You: '
                    : "Chatbot: "}
                </span>
                {m.content}
              </div>
            ))}
          </div>
          <div className="md:w-1/3">
            {Array.isArray(articles) && (articles.length > 0) && (
              <div className="mt-8">
                <h3 className="mb-4 text-xl font-semibold">Related Posts</h3>
                <div className="space-y-4">
                  {(articles as BlogWithSlug[]).map((article) => (
                    <ContentCard key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Container>
  );
} 