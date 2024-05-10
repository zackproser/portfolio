'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { SimpleLayout } from '@/components/SimpleLayout';
import { BlogPostCard } from '@/components/BlogPostCard';
import { ArticleWithSlug } from '@/lib/shared-types';

const prepopulatedQuestions = [
  "What is the programming bug?",
  "Why do you love Next.js so much?",
  "What do you do at Pinecone?",
];

export default function Chat() {
  const [article, setArticle] = useState<ArticleWithSlug | null>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources');
      const parsedArticle: ArticleWithSlug | null = sourcesHeader
        ? (JSON.parse(atob(sourcesHeader as string)) as ArticleWithSlug)
        : null;
      console.log(`parsedArticle %o`, parsedArticle);
      setArticle(parsedArticle);
    },
    headers: {},
  });

  const handlePrepopulatedQuestion = (question: string) => {
    handleInputChange({
      target: {
        value: question,
      },
    } as React.ChangeEvent<HTMLInputElement>);

    const customSubmitEvent = {
      preventDefault: () => { },
    } as unknown as React.FormEvent<HTMLFormElement>;
    setTimeout(() => {
      handleSubmit(customSubmitEvent);
    }, 0);
  };

  return (
    <SimpleLayout
      title="Chat with my writing!"
      intro="This experience uses Pinecone, OpenAI and LangChain..."
    >
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
          {article && (
            <div>
              <h3 className="mb-4 text-xl font-semibold">Related Posts</h3>
              <BlogPostCard key={article.slug} article={article} />
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 px-6">
        <h3 className="mb-2 text-lg font-semibold">Example Questions:</h3>
        <p>Double-click to ask one of these questions, or type your own below and hit enter.</p>
        <div className="space-x-2 mb-4">
          {prepopulatedQuestions.map((question, index) => (
            <button
              key={index}
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={() => handlePrepopulatedQuestion(question)}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 mb-8 px-6">
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
