'use client'

import { useState } from 'react';
import { TokenizationComparison } from './TokenizationComparison';
import { TokenExplorer } from './TokenExplorer';

const examples = [
  {
    title: "Common English Text",
    text: "The quick brown fox jumps over the lazy dog.",
    explanation: "A simple English sentence using common words. Most tokenizers handle this efficiently."
  },
  {
    title: "Uncommon Words",
    text: "Supercalifragilisticexpialidocious is antidisestablishmentarianism.",
    explanation: "Long, rare words demonstrate how subword tokenizers break unfamiliar terms into smaller pieces."
  },
  {
    title: "Numbers & Symbols",
    text: "Call me at +1 (555) 123-4567 or email john.doe@example.com!",
    explanation: "Numbers, punctuation, and special patterns like email addresses pose unique challenges for tokenizers."
  },
  {
    title: "Non-English Text",
    text: "こんにちは世界! Hola Mundo! Привет мир!",
    explanation: "Different languages and scripts show how tokenizers handle multilingual content."
  },
  {
    title: "Code Snippet",
    text: "function addNumbers(a, b) { return a + b; } // Adds two numbers",
    explanation: "Programming code has special syntax patterns that tokenizers process differently than natural language."
  }
];

export function Examples() {
  const [selectedExample, setSelectedExample] = useState(0);
  
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {examples.map((example, index) => (
          <button
            key={index}
            className={`px-3 py-1 text-sm rounded-md ${
              selectedExample === index 
                ? 'bg-green-600 text-white' 
                : 'bg-zinc-700 hover:bg-zinc-600'
            }`}
            onClick={() => setSelectedExample(index)}
          >
            {example.title}
          </button>
        ))}
      </div>
      
      <div className="p-4 bg-zinc-800 rounded-lg mb-6">
        <p className="mb-2 text-green-400 italic">"{examples[selectedExample].text}"</p>
        <p className="text-sm text-zinc-400">{examples[selectedExample].explanation}</p>
      </div>
      
      <TokenizationComparison text={examples[selectedExample].text} />
      <TokenExplorer text={examples[selectedExample].text} />
    </div>
  );
} 