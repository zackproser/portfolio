'use client'

import { Container } from '@/components/Container'
import { Suspense, useState } from 'react';
import debounce from 'lodash/debounce';

const getColorForToken = (token: number) => {
  const tokenId = token;
  const hue = (tokenId * 137.508) % 360;
  return `hsl(${hue}, 50%, 80%)`;
};

function TokenizationDemo() {
  const [inputText, setInputText] = useState('');
  const [tokenData, setTokenData] = useState<{ word: string; token: number }[]>([]);

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
      setTokenData(data.tokenData);
    } catch (error) {
      console.error('Error generating tokens:', error);
      // Handle error state
    }
  }, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    debouncedGenerateTokens();
  };

  return (
    <Container>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Tokenization Demo</h1>
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
          <h2 className="text-2xl font-semibold text-zinc-200 mb-4">Tokenized Output:</h2>
          <div className="inline-block">
            {tokenData.map(({ word, token }, index) => (
              <span
                key={index}
                className="inline-block px-2 py-1 text-sm font-semibold text-zinc-200"
                style={{ backgroundColor: getColorForToken(token) }}
              >
                {word}
                <div className="text-xs text-zinc-400">{token}</div>
              </span>
            ))}
          </div>
        </div>
        {/* Add narrative text and images/diagrams */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-200 mb-4">How Tokenization Works</h2>
          <p className="text-zinc-200">
            {/* Add your narrative text here */}
          </p>
          {/* Add images or diagrams */}
        </div>
      </div>
    </Container>
  );
}

export default function TokenizationDemoWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TokenizationDemo />
    </Suspense>
  );
}
