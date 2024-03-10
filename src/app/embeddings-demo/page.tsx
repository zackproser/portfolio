'use client'

import { Container } from '@/components/Container'
import { Suspense, useState } from 'react';
import debounce from 'lodash/debounce';

const getColorForToken = (token: number) => {
  const tokenId = token;
  const hue = (tokenId * 137.508) % 360;
  return `hsl(${hue}, 50%, 80%)`;
};

function EmbeddingsDemo() {
  const [inputText, setInputText] = useState('');
  const [tokens, setTokens] = useState<Uint32Array>(() => new Uint32Array());
  const [embeddings, setEmbeddings] = useState<Float32Array>(() => new Float32Array());

  const debouncedGenerateTokens = debounce(async () => {
    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();
      setTokens(new Uint32Array(data.tokens));
    } catch (error) {
      console.error('Error generating tokens:', error);
      // Handle error state
    }
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    debouncedGenerateTokens();
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
      setEmbeddings(new Float32Array(data.embeddings));
    } catch (error) {
      console.error('Error generating embeddings:', error);
      // Handle error state
    }
  };

  return (
    <Container>
      <div className="mx-auto max-w-2xl">
        <div className="mt-8">
          <div className="mb-6">
            <label htmlFor="input-text" className="block text-sm font-medium text-zinc-200">
              Input Text
            </label>
            <input
              type="text"
              id="input-text"
              name="input-text"
              value={inputText}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-zinc-600 bg-zinc-800 text-zinc-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-zinc-200 mb-2">Tokens:</h3>
            <div className="flex flex-wrap">
              {Array.from(tokens).map((token, index) => (
                <span
                  key={index}
                  className="inline-block bg-zinc-700 rounded-full px-3 py-1 text-sm font-semibold text-zinc-200 mr-2 mb-2"
                  style={{ backgroundColor: getColorForToken(token) }}
                >
                  {String.fromCharCode(token)}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={generateEmbeddings}
            >
              Generate Embeddings
            </button>
          </div>
          {embeddings.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-zinc-200 mb-2">Embeddings:</h3>
              <pre className="bg-zinc-800 rounded-md p-4 text-sm overflow-auto text-zinc-200 max-h-80">
                {JSON.stringify(Array.from(embeddings), null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}

export default function EmbeddingsDemoWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbeddingsDemo />
    </Suspense>
  );
}
