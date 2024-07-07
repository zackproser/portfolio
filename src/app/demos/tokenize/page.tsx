'use client'

import { Container } from '@/components/Container'
import { Suspense, useState } from 'react';

const getColorForToken = (token: string) => {
  const tokenId = token.charCodeAt(0);
  const hue = (tokenId * 137.508) % 360;
  return `hsl(${hue}, 50%, 80%)`;
};

function TokenizationDemo() {
  const [inputText, setInputText] = useState('');
  const [tokens, setTokens] = useState<number[]>([]);

  const generateTokens = async () => {
    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();
      console.log(`data: %o`, data.tokens);
      setTokens(data.tokens);
    } catch (error) {
      console.error('Error generating tokens:', error);
      // Handle error state
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  return (
    <Container className="mt-16 lg:mt-32">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold mb-8">Tokenization Demo</h1>
        <p className="mb-6">This interactive demo showcases the process of tokenization, a fundamental technique used in natural language processing (NLP) and generative AI.</p>
        <p className="mb-6">Enter any text into the input field below...</p>
        <div className="mb-6">
          <input
            type="text"
            id="input-text"
            name="input-text"
            onChange={handleInputChange}
            value={inputText}
            className="mt-1 block w-full rounded-md bg-gray-400 border border-zinc-600 placeholder-gray-400 text-white focus:border-indigo-500 focus:ring focus:ring-indigo-500 focus:ring-opacity-50"
          />
        </div>

        <div className="mb-6">
          <p className=" mb-6">As you type, your sentence is split into words, the way us humans tend to see and read them:</p>
          <div className="inline-block">
            {inputText.split(' ').map((word, index) => (
              <span
                key={index}
                className="inline-block px-3 py-2 text-lg font-bold text-white text-shadow"
                style={{
                  backgroundColor: getColorForToken(word),
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  margin: '0 4px',
                }}
              >
                {word}
              </span>
            ))}
          </div>
          <br />
          <p className=" mt-6 mb-6">But how does a machine see them? Click the button below to tokenize your text, which will convert your words into token IDs for a given vocabulary.</p>
          <button
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mb-6"
            onClick={() => generateTokens()}
          >
            Tokenize text
          </button>
          <p className=" mb-6">These are the token IDs that the tiktoken library assigned to your words. This is closer to how ChatGPT and other LLMs see your text when you write a prompt in natural language:</p>
          <div>
            {Object.entries(tokens).map(([key, value]) => (
              <span
                key={key}
                className="inline-block px-3 py-2 text-lg font-bold text-white text-shadow"
                style={{
                  backgroundColor: getColorForToken(key),
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  margin: '0 4px',
                }}
              >{value} </span>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold  mb-4">What is Tokenization?</h2>
          <p className=" mb-6">
            Tokenization is the process of breaking down a piece of text into smaller units called tokens. These tokens can be individual words, subwords, or even characters, depending on the tokenization algorithm used.</p>

          <p className=" mb-6">The purpose of tokenization is to convert text into a format that can be easily processed and understood by machine learning models, particularly in the field of NLP.</p>

          <p className=" mb-6">
            In the context of the current generative AI boom, tokenization has become increasingly important. Language models like GPT (Generative Pre-trained Transformer) rely heavily on tokenization to process and generate human-like text. </p>

          <p className=" mb-6">By breaking down text into tokens, these models can learn patterns, relationships, and meanings within the language, enabling them to generate coherent and contextually relevant responses.
          </p>

          <p className=" mb-6">
            Each token is assigned a unique token ID, which is an integer value representing that specific token. These token IDs serve as a numerical representation of the text, allowing the AI models to perform mathematical operations and learn from the input data efficiently.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold  mb-4">The Tiktoken library</h2>
          <p className=" mb-6">
            In this demo, we are using the Tiktoken library for tokenization. Tiktoken is a popular tokenization library developed by OpenAI, one of the leading organizations in the field of AI research and development. It is designed to work seamlessly with OpenAI language models, such as GPT-3 and its variants.
          </p>

          <p className=" mb-6">
            Tiktoken provides a fast and efficient way to tokenize text using the same algorithm and vocabulary as OpenAI&apos;s models. It offers support for various encoding schemes, including the commonly used cl100k_base encoding, which has a vocabulary of approximately 100,000 tokens. This is the exact vocabulary used in this demo.
          </p>

          <p className=" mb-6">
            By using Tiktoken, we ensure that the tokenization process in this demo is consistent with the tokenization used by state-of-the-art language models.
          </p>
        </div>



        <div className="mb-6">
          <h2 className="text-2xl font-semibold  mb-4">Use cases and importance</h2>
          <p className=" mb-6">
            Tokenization is a critical step in various NLP tasks and applications. Here are a few examples where tokenization plays a crucial role:
          </p>
          <h3 className="text-2xl mb-6">Language translation</h3>
          <p className=" mb-6">Tokenization is used to break down sentences into individual words or subwords, which are then mapped to their corresponding translations in the target language. This enables accurate and efficient language translation systems.</p>
          <h3 className="text-2xl mb-6">Sentiment analysis</h3>
          <p className=" mb-6">By tokenizing text, sentiment analysis models can identify and extract sentiment-bearing words or phrases, allowing them to determine the overall sentiment expressed in a piece of text.</p>
          <h3 className="text-2xl mb-6">Text classification</h3>
          <p className=" mb-6">Tokenization helps in converting text into a numerical representation that can be fed into machine learning models for text classification tasks, such as spam detection, topic categorization, or genre identification.</p>
          <h3 className="text-2xl mb-6">Text generation</h3>
          <p className=" mb-6">Generation: Generative language models like GPT heavily rely on tokenization to generate human-like text. By learning patterns and relationships between tokens, these models can produce coherent and contextually relevant responses, enabling applications like chatbots, content creation, and creative writing assistance.</p>
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
