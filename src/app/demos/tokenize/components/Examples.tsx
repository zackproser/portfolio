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

export function Examples({ onExampleSelect }: { onExampleSelect: (text: string) => void }) {
  const [selectedExample, setSelectedExample] = useState<number | null>(null);
  
  return (
    <div className="flex flex-col space-y-4">
      <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Prepared Examples:</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {examples.map((example, index) => (
          <button
            key={index}
            className={`p-3 text-left rounded-lg border transition-colors ${
              selectedExample === index 
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                : 'bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
            onClick={() => {
              setSelectedExample(index);
              onExampleSelect(example.text);
            }}
          >
            <div className="font-medium text-sm text-zinc-900 dark:text-white mb-1">
              {example.title}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              {example.explanation}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 