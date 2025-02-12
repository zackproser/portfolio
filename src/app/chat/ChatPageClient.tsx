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
import { BlogPostCard } from '@/components/BlogPostCard';
import { ArticleWithSlug } from '@/lib/shared-types';

// Add gtag type definition
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

const prepopulatedQuestions = [
  "What is the programming bug?",
  "Why do you love Next.js so much?",
  "What do you do at Pinecone?",
  "How can I become a better developer?",
  "What is ggshield and why is it important?",
  "How can I use AI to complete side projects more quickly?"
];

interface ChatPageClientProps {
  initialArticles: ArticleWithSlug[];
}

export default function ChatPageClient({ initialArticles }: ChatPageClientProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [articles, setArticles] = useState<ArticleWithSlug[]>([]);

  const { messages, input, setInput, handleSubmit } = useChat({
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources');
      const parsedArticles: ArticleWithSlug[] = sourcesHeader
        ? (JSON.parse(atob(sourcesHeader as string)) as ArticleWithSlug[])
        : [];
      console.log(`parsedArticle %o`, parsedArticles);
      setArticles(parsedArticles);
      setIsLoading(false);
    },
    headers: {},
    body: {
      articles: initialArticles,
    },
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
                    : "The Ghost of Zachary Proser's Writing: "}
                </span>
                {m.content}
              </div>
            ))}
          </div>
          <div className="md:w-1/3">
            {Array.isArray(articles) && (articles.length > 0) && (
              <div className="">
                <h3 className="mb-4 text-xl font-semibold">Related Posts</h3>
                <div className="space-y-4">
                  {(articles as ArticleWithSlug[]).map((article) => (
                    <BlogPostCard key={article.slug} article={article} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            onClick={() => { location.reload(); }}
            className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
          >
            Clear Chat
          </button>
        </div>
      </div>
    </Container>
  );
}
