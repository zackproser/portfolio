'use client'

import Link from 'next/link';
import { Container } from '@/components/Container';
import { useState, Suspense } from 'react';
import { useChat } from 'ai/react';
import { track } from '@vercel/analytics';
import { clsx } from 'clsx';
import RandomPortrait from '@/components/RandomPortrait';
import SearchForm from '@/components/SearchForm';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import { ContentCard } from '@/components/ContentCard';
import { BlogWithSlug } from '@/types';

// Add gtag type definition
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

// Add tutorial advertisement component
const RagTutorialAd = ({ compact = false }) => {
  return (
    <div className={`w-full ${compact ? 'my-0' : 'my-8'} rounded-2xl bg-gradient-to-br from-emerald-900 to-blue-900 p-4 sm:p-6 shadow-2xl border-t-4 border-emerald-500/30`}>
      <div className={`flex flex-col ${compact ? '' : 'md:flex-row'} items-start gap-6`}>
        <div className="flex-1">
          <h2 className={`${compact ? 'text-xl' : 'text-2xl sm:text-3xl'} font-bold text-white`}>
            Want to build this for your business?
          </h2>
          <p className="mt-3 text-slate-200">
            This live demo is powered by the <strong className="text-emerald-300">exact RAG pipeline</strong> from my premium tutorial.
          </p>
          
          {!compact && (
            <div className="mt-4 grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-200"><strong>No more hallucinations</strong> (real doc-based answers)</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-200"><strong>Top-tier performance</strong> Using the highly optimized Vercel AI SDK</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-200"><strong>A foundational skill for the AI era</strong></span>
              </div>
            </div>
          )}
        </div>
        
        <div className={`${compact ? 'w-full mt-4' : 'md:w-auto self-center md:self-end'}`}>
          <Link 
            href="/checkout?product=rag-pipeline-tutorial&type=blog"
            className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors ${compact ? 'w-full mb-2' : 'mr-3'}`}
            onClick={() => {
              track("tutorial_banner_click", {
                location: "chat_page",
                product: "rag_tutorial"
              })
            }}
          >
            Get the $49 Tutorial →
          </Link>
          <Link 
            href="/products/rag-pipeline-tutorial"
            className={`inline-flex items-center justify-center px-6 py-3 text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors ${compact ? 'w-full' : ''}`}
            onClick={() => {
              track("tutorial_learn_more_click", {
                location: "chat_page",
                product: "rag_tutorial"
              })
            }}
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

const prepopulatedQuestions = [
  "What is the programming bug?",
  "Why do you love Next.js so much?",
  "What do you do at Pinecone?",
  "How can I become a better developer?",
  "What is ggshield and why is it important?",
  "How can I use AI to complete side projects more quickly?"
];

export default function ChatPageClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<BlogWithSlug[]>([]);

  const { messages, input, setInput, handleSubmit, reload: resetChat } = useChat({
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources');
      const parsedArticles: BlogWithSlug[] = sourcesHeader
        ? (JSON.parse(atob(sourcesHeader as string)) as BlogWithSlug[])
        : [];
      console.log(`parsedArticle %o`, parsedArticles);
      setArticles(parsedArticles);
      setIsLoading(false);
    },
    headers: {},
    onFinish() {
      // Make gtag calls safe
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag("event", "chat_question", {
          event_category: "chat",
          event_label: input,
        });
      }
      track("chat", { question: input });
    },
    onError() {
      setIsLoading(false);
    }
  });

  const handleSearch = async (query: string) => {
    setInput(query);

    // Make gtag calls safe
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag("event", "chat_use_precanned_question", {
        event_category: "chat",
        event_label: query,
      });
    }

    track("chat-precanned", { question: query });

    const customSubmitEvent = {
      preventDefault: () => { },
    } as unknown as React.FormEvent<HTMLFormElement>;

    await handleSubmit(customSubmitEvent);
  };

  return (
    <Container>
      <div className="max-w-7xl mx-auto mt-16 sm:mt-32">
        <div className="flex flex-col md:flex-row items-start mb-12">
          <div className="flex-1 pl-8">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl mb-6">
              Chat with me
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 mb-4">
              This experience uses Pinecone, OpenAI and LangChain...
            </p>
            <p className="prose dark:text-white">
              Learn how to build this <Link href="/blog/langchain-pinecone-chat-with-my-blog" className="text-emerald-500 hover:text-emerald-600">with my tutorial</Link>
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
            onClearChat={() => { 
              resetChat();
              setInput("");
              setArticles([]);
            }}
            showClearButton={messages.length > 0}
          />
        </div>

        {/* Add the RAG Tutorial advertisement before the chat starts */}
        {!messages.length && (
          <RagTutorialAd />
        )}

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
                    : "The Ghost of Zachary Proser's Writing: "}
                </span>
                {m.content}
              </div>
            ))}
          </div>
          <div className="md:w-1/3">
            {/* Show compact ad at top of sidebar for active chats */}
            {messages.length > 0 && (
              <div className="mb-6">
                <RagTutorialAd compact />
              </div>
            )}
            
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
        
        {/* Add the RAG Tutorial advertisement after chat has started */}
        {messages.length > 0 && (
          <RagTutorialAd />
        )}
      </div>
    </Container>
  );
}
