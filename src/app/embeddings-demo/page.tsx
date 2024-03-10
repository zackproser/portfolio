'use client'

import { ArticleLayout } from '@/components/ArticleLayout';
import { useState } from 'react';
import { getEncoding } from 'js-tiktoken';

const enc = getEncoding('gpt2');

const metadata = {
  title: 'Embeddings Demo',
  description: 'Embeddings Demo',
  keywords: ['Embeddings Demo'],
  date: '2024-03-10',
}

const getColorForToken = (token: number) => {
  const tokenId = token;
  const hue = (tokenId * 137.508) % 360;
  return `hsl(${hue}, 50%, 80%)`;
};

export default function EmbeddingsDemo() {
  const [inputText, setInputText] = useState('');
  const [tokens, setTokens] = useState<Uint32Array>(() => new Uint32Array());
  const [embeddings, setEmbeddings] = useState<Uint32Array>(() => new Uint32Array());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    setTokens(new Uint32Array(enc.encode(e.target.value)));
  };

  const generateEmbeddings = async () => {
    try {
      const response = await fetch('/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();
      setEmbeddings(new Uint32Array(data.embeddings));
    } catch (error) {
      console.error('Error generating embeddings:', error);
      // Handle error state
    }
  };

  return (
    <ArticleLayout metadata={metadata}>
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
            <div className="max-w-md mx-auto">
              <div>
                <h1 className="text-2xl font-semibold">Embeddings Demo</h1>
              </div>
              <div className="divide-y divide-gray-200">
                <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                  <div className="relative">
                    <input
                      autoComplete="off"
                      id="input-text"
                      name="input-text"
                      type="text"
                      className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                      placeholder="Enter text"
                      value={inputText}
                      onChange={handleInputChange}
                    />
                    <label
                      htmlFor="input-text"
                      className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                    >
                      Input Text
                    </label>
                  </div>
                  <div className="relative">
                    <div className="flex flex-wrap">
                      {Array.from(tokens).map((token, index) => (
                        <span
                          key={index}
                          className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                          style={{ backgroundColor: getColorForToken(token) }}
                        >
                          {String.fromCharCode(token)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                      onClick={generateEmbeddings}
                    >
                      Generate Embeddings
                    </button>
                  </div>
                  {embeddings.length > 0 && (
                    <div className="relative">
                      <h3 className="text-lg font-semibold mb-2">Embeddings:</h3>
                      <pre className="bg-gray-100 rounded-md p-4 text-sm overflow-x-auto">
                        {JSON.stringify(Array.from(embeddings), null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ArticleLayout>
  );
}
