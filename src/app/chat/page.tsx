'use client';

import Link from 'next/link';
import { useChat } from 'ai/react';
import { useState, Suspense } from 'react';
import { clsx } from 'clsx';
import { track } from '@vercel/analytics';
import { SimpleLayout } from '@/components/SimpleLayout';
import { BlogPostCard } from '@/components/BlogPostCard';
import { ArticleWithSlug } from '@/lib/shared-types';
import { LoadingAnimation } from '@/components/LoadingAnimation';
import SearchForm from '@/components/SearchForm';
import RandomImage from '@/components/RandomImage';

const prepopulatedQuestions = [
  "What is the programming bug?",
  "Why do you love Next.js so much?",
  "What do you do at Pinecone?",
  "How can I become a better developer?",
  "What is ggshield and why is it important?",
  "How can I use AI to complete side projects more quickly?"
];

export default function Chat() {
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
    onFinish() {
      gtag("event", "chat_question", {
        event_category: "chat",
        event_label: input,
      });
      track("chat", { question: input });
    },
    onError() {
      setIsLoading(false);
    }
  });

  const handleSearch = async (query: string) => {
    setInput(query);

    gtag("event", "chat_use_precanned_question", {
      event_category: "chat",
      event_label: query,
    });

    track("chat-precanned", { question: query });

    const customSubmitEvent = {
      preventDefault: () => { },
    } as unknown as React.FormEvent<HTMLFormElement>;

    await handleSubmit(customSubmitEvent);
  };


  return (
    <SimpleLayout
      title="Chat with me"
      intro="This experience uses Pinecone, OpenAI and LangChain..."
    >
      <p className="m-4 p-4 prose dark:text-white">Learn how to build this <Link href="/blog/langchain-pinecone-chat-with-my-blog">with my tutorial</Link></p>
      <div className="max-w-xs max-w-sm px-2.5 mb-8">
        <Suspense>
          <RandomImage />
        </Suspense>
      </div>
      {isLoading && messages?.length > 0 && (<LoadingAnimation />)}
      <div className="flex flex-col md:flex-row flex-1 w-full max-w-5xl mx-auto">
        <div className="flex-1 px-6">
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
        <div className="md:w-1/3 px-6 py-4">
          {Array.isArray(articles) && (articles.length > 0) && (
            <div className="">
              <h3 className="mb-4 text-xl font-semibold">Related Posts</h3>
              {(articles as ArticleWithSlug[]).map((article) => (
                <BlogPostCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="m-4 pb-8 p-6">
        <SearchForm
          suggestedSearches={prepopulatedQuestions}
          onSearch={handleSearch}
          setIsLoading={setIsLoading}
        />
      </div>
      <div className="mt-4 px-6 flex justify-end">
        <button
          onClick={() => {
            location.reload();
          }}
          className="px-3 py-2 bg-green-500 text-white rounded shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50"
        >
          Clear Chat
        </button>
      </div>
    </SimpleLayout>
  );
}

