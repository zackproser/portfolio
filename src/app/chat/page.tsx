'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { SimpleLayout } from '@/components/SimpleLayout';
import { BlogPostCard } from '@/components/BlogPostCard';
import { ArticleWithSlug } from '@/lib/shared-types';
import { LoadingAnimation } from '@/components/LoadingAnimation';

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

  const { messages, input, setInput, handleInputChange, handleSubmit } = useChat({
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
      // Log the user's question
      gtag("event", "chat_question", {
        event_category: "chat",
        event_label: input,
      });
    }
  });

  const userFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true); // Set loading state here
    handleSubmit(e);
  };

  const handlePrepopulatedQuestion = (question: string) => {
    handleInputChange({
      target: {
        value: question,
      },
    } as React.ChangeEvent<HTMLInputElement>);

    gtag("event", "chat_use_precanned_question", {
      event_category: "chat",
      event_label: question,
    });

    setIsLoading(true); // Set loading state here to indicate submission is processing

    const customSubmitEvent = {
      preventDefault: () => { },
    } as unknown as React.FormEvent<HTMLFormElement>;

    // Submit immediately after updating the input
    handleSubmit(customSubmitEvent);
  };

  return (
    <SimpleLayout
      title="Chat with my writing!"
      intro="This experience uses Pinecone, OpenAI and LangChain..."
    >
      {isLoading && (<LoadingAnimation />)}
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
      <div className="mt-4 px-6">
        <h3 className="mb-2 text-lg font-semibold">Example Questions:</h3>
        <p>Double-click to ask one of these questions, or type your own below and hit enter.</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {prepopulatedQuestions.map((question, index) => (
            <button
              key={index}
              className="px-3 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50"
              onClick={() => handlePrepopulatedQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={userFormSubmit} className="mt-4 mb-8 px-6">
        <input
          className="w-full p-2 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Ask the Ghost of Zachary Proser's Writing something..."
          onChange={handleInputChange}
        />
      </form>
    </SimpleLayout>
  );
}
