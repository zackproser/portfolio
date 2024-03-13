'use client'

import { Container } from '@/components/Container'
import { Suspense, useState } from 'react';

const getColorForToken = (token: string) => {
  const tokenId = token.charCodeAt(0);
  const hue = (tokenId * 137.508) % 360;
  return `hsl(${hue}, 50%, 80%)`;
};

function EmbeddingsDemo() {
  const [inputText, setInputText] = useState('');
  const [embeddings, setEmbeddings] = useState<number[]>([]);

  const generateTokens = async () => {

    try {
      const response = await fetch('/api/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      const data = await response.json();
      console.log(`data: %o`, data.embeddings);
      setEmbeddings(data.embeddings);
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
        <h1 className="text-4xl font-bold mb-8">Embeddings Demo</h1>
        <p className="mb-6">This interactive demo showcases the process of converting natural language into vectors or embeddings, a fundamental technique used in natural language processing (NLP) and generative AI.</p>
        <p className="mb-6">This interactive demo lets you type in any text you like and instantly convert it to embeddings. Click the button below to see how your text gets mapped to a numerical representation that captures its semantic meaning.</p>
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
          <p className="text-zinc-200 mb-6">As you type, your sentence is split into words, the way us humans tend to see and read them:</p>
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
          <p className="text-zinc-200 mt-6 mb-6">But how does a machine understand the defining features of your text? Click the button below to convert your text to embeddings.</p>
          <button
            className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 rounded mb-6"
            onClick={() => generateTokens()}
          >
            Convert text to embeddings
          </button>
          <p className="text-zinc-200 mb-6">These are the token IDs that the tiktoken library assigned to your words. This is closer to how ChatGPT and other LLMs see your text when you write a prompt in natural language:</p>
          <div className="overflow-y-scroll h-64">
            {embeddings}
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-200 mb-4">What are embeddings or vectors?</h2>
          <p className="text-zinc-200 mb-6">
            Embeddings are a powerful machine learning technique that allow computers to understand and represent the meaning and relationships between words and phrases. With embeddings, each word or chunk of text is mapped to a vector of numbers in a high-dimensional space, such that words with similar meanings are located close together.</p>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-200 mb-4">How embeddings models work</h2>
          <p className="text-zinc-200 mb-6">
            Under the hood, embeddings models like word2vec or GloVe are trained on massive amounts of text data, like all the articles on Wikipedia. The model learns the patterns of which words tend to appear in similar contexts.
          </p>

          <p className="text-zinc-200 mb-6">
            For example, the model might frequently see phrases like &lquot;the king sits on his throne&rquot; and &lquot;the queen sits on her throne&rquot. From many examples like this, it learns that king and queen have similar meanings and usage patterns. The model represents this similarity by assigning king and queen vectors that are close together in the embedding space.
          </p>

          <p className="text-zinc-200 mb-6">
            By doing this for all words across a huge corpus, the model builds up a rich understanding of the relationships between words based on the contexts they appear in. The resulting embedding vectors miraculously seem to capture analogies and hierarchical relationships.
          </p>
        </div>



        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-zinc-200 mb-4">Why embeddings are powerful and having a moment</h2>
          <p className="text-zinc-200 mb-6">
            Embeddings are incredibly powerful because they allow machine learning models to understand language in a more flexible, nuanced way than just memorizing specific words and phrases. By capturing the semantic relationships between words, embeddings enable all sorts of natural language tasks like analogical reasoning, sentiment analysis, named entity recognition, and more.
          </p>
          <p className="text-zinc-200 mb-6">We&apos;re seeing a boom in embeddings and their applications right now due to several factors:</p>

          <p className="text-zinc-200 mb-6"> 1. The rise of transformers and attention-based language models like BERT that generate even richer, more contextual embeddings</p>
          <p className="text-zinc-200 mb-6"> 2. Ever-increasing amounts of text data to train huge embeddings models</p>
          <p className="text-zinc-200 mb-6"> 3. More powerful hardware and techniques for training massive models</p>
          <p className="text-zinc-200 mb-6"> 4. Creative new applications for embeddings, like using them for semantic search, knowledge retrieval, multi-modal learning, and more</p>

          <p className="text-zinc-200 mb-6">Embeddings are quickly becoming an essential tool that will power the next wave of natural language AI systems. They&apos;re a core reason behind the rapid progress in natural language processing and the explosion of generative AI tools we are seeing today.</p>
        </div >
      </div >
    </Container >
  );
}

export default function TokenizationDemoWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmbeddingsDemo />
    </Suspense>
  );
}
