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
  }, 250);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    debouncedGenerateTokens();
  };

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Tokenization Demo</h1>
        <p className="mb-6">Welcome to my Tokenization Demo! </p>
        <p className="mb-6">This interactive demo showcases the process of tokenization, a fundamental technique used in natural language processing (NLP) and generative AI.</p>
        <p className="mb-6">In this demo, you can enter any text into the input field below and see how it is broken down into individual tokens, along with their corresponding token IDs.</p>
        <h2 className="text-2xl font-semibold text-zinc-200 mb-4"><span className="text-green-400">Try it out!</span> Type in some text</h2>
        <div className="mb-6">
          <label htmlFor="input-text" className="block text-lg font-medium text-zinc-200">
            Type any text to see how it is tokenized
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
                className="inline-block px-3 py-2 text-lg font-bold text-white text-shadow"
                style={{
                  backgroundColor: getColorForToken(token),
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  margin: '0 4px',
                }}
              >
                {word}
                <div className="text-sm font-semibold text-zinc-300">{token}</div>
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-200 mb-4">What is Tokenization?</h2>
          <p className="text-zinc-200 mb-6">
            Tokenization is the process of breaking down a piece of text into smaller units called tokens. These tokens can be individual words, subwords, or even characters, depending on the tokenization algorithm used.</p>

          <p className="text-zinc-200 mb-6">The purpose of tokenization is to convert text into a format that can be easily processed and understood by machine learning models, particularly in the field of NLP.</p>

          <p className="text-zinc-200 mb-6">
            In the context of the current generative AI boom, tokenization has become increasingly important. Language models like GPT (Generative Pre-trained Transformer) rely heavily on tokenization to process and generate human-like text. </p>

          <p className="text-zinc-200 mb-6">By breaking down text into tokens, these models can learn patterns, relationships, and meanings within the language, enabling them to generate coherent and contextually relevant responses.
          </p>

          <p className="text-zinc-200 mb-6">
            Each token is assigned a unique token ID, which is an integer value representing that specific token. These token IDs serve as a numerical representation of the text, allowing the AI models to perform mathematical operations and learn from the input data efficiently.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-200 mb-4">The Tiktoken library</h2>
          <p className="text-zinc-200 mb-6">
            In this demo, we are using the Tiktoken library for tokenization. Tiktoken is a popular tokenization library developed by OpenAI, one of the leading organizations in the field of AI research and development. It is designed to work seamlessly with OpenAI's language models, such as GPT-3 and its variants.
          </p>

          <p className="text-zinc-200 mb-6">
            Tiktoken provides a fast and efficient way to tokenize text using the same algorithm and vocabulary as OpenAI's models. It offers support for various encoding schemes, including the commonly used "cl100k_base" encoding, which has a vocabulary of approximately 100,000 tokens.
          </p>

          <p className="text-zinc-200 mb-6">
            By using Tiktoken, we ensure that the tokenization process in this demo is consistent with the tokenization used by state-of-the-art language models.
          </p>
        </div>



        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-200 mb-4">Use cases and importance</h2>
          <p className="text-zinc-200 mb-6">
            Tokenization is a critical step in various NLP tasks and applications. Here are a few examples where tokenization plays a crucial role:
          </p>
          <h3 className="text-2xl mb-6">Language translation</h3>
          <p className="text-zinc-200 mb-6">Tokenization is used to break down sentences into individual words or subwords, which are then mapped to their corresponding translations in the target language. This enables accurate and efficient language translation systems.</p>
          <h3 className="text-2xl mb-6">Sentiment analysis</h3>
          <p className="text-zinc-200 mb-6">By tokenizing text, sentiment analysis models can identify and extract sentiment-bearing words or phrases, allowing them to determine the overall sentiment expressed in a piece of text.</p>
          <h3 className="text-2xl mb-6">Text classification</h3>
          <p className="text-zinc-200 mb-6">Tokenization helps in converting text into a numerical representation that can be fed into machine learning models for text classification tasks, such as spam detection, topic categorization, or genre identification.</p>
          <h3 className="text-2xl mb-6">Text generation</h3>
          <p className="text-zinc-200 mb-6">Generation: Generative language models like GPT heavily rely on tokenization to generate human-like text. By learning patterns and relationships between tokens, these models can produce coherent and contextually relevant responses, enabling applications like chatbots, content creation, and creative writing assistance.</p>
        </div >
      </div >
    </Container >
  );
}

export default function TokenizationDemoWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TokenizationDemo />
    </Suspense>
  );
}
