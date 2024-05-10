'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';
import { clsx } from 'clsx';
import { SimpleLayout } from '@/components/SimpleLayout';
import Image from 'next/image';
import { BlogPostCard } from '@/components/BlogPostCard';
import { ArticleWithSlug } from '@/lib/shared-types';

export default function Chat() {
  const [article, setArticle] = useState<ArticleWithSlug | null>(null);
  const [heroImage, setHeroImage] = useState('');

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    onResponse(response) {
      const sourcesHeader = response.headers.get('x-sources');
      const parsedArticle: ArticleWithSlug | null = sourcesHeader
        ? (JSON.parse(atob(sourcesHeader as string)) as ArticleWithSlug)
        : null;
      console.log(`parsedArticle: %o`, parsedArticle);
      setArticle(parsedArticle);
    },
    headers: {},
  });

  return (
    <SimpleLayout
      title="Chat with my writing!"
      intro="This experience uses Pinecone, OpenAI and LangChain..."
    >
      <div className="flex flex-col flex-1 w-full max-w-3xl mx-auto">
        <div className="flex-1 px-6 py-4 overflow-y-scroll">
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
          {heroImage && (
            <Image src={heroImage} width={300} height={300} alt="Hero Image" />
          )}
          {article && <BlogPostCard key={article.slug} article={article} />}
        </div>
        <form onSubmit={handleSubmit} className="mt-auto mb-8">
          <input
            className="w-full p-2 border border-gray-300 rounded shadow-xl"
            value={input}
            placeholder="Ask the Ghost of Zachary Proser's Writing something..."
            onChange={handleInputChange}
          />
        </form>
      </div>
    </SimpleLayout>
  );
}
