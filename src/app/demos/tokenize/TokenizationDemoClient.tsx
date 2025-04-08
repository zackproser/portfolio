'use client'

import { useState, useEffect } from 'react';
import {
  Examples,
  TokenExplorer,
  TokenizationComparison,
  TokenPricingCalculator,
  TokenApplications,
  TokenizationQuiz
} from './components';

export default function TokenizationDemoClient() {
  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Debounce text changes to prevent excessive re-renders
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnalysis(!!inputText);
    }, 300);
    return () => clearTimeout(timer);
  }, [inputText]);

  const handleExampleSelect = (text: string) => {
    setInputText(text);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 space-y-8">
      {/* Input Area */}
      <div className="space-y-4">
        <div className="flex items-start space-x-4">
          <div className="flex-grow">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white resize-none"
              rows={2}
              placeholder="Type or paste any text to see instant tokenization..."
            />
          </div>
          {showAnalysis && (
            <div className="flex-shrink-0">
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md text-sm"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-4-32k">GPT-4 32K</option>
              </select>
            </div>
          )}
        </div>

        {/* Examples Section - Simplified */}
        <div className="mt-2">
          <div className="flex flex-wrap gap-2">
            {["Common English Text", "Uncommon Words", "Numbers & Symbols", "Non-English Text", "Code Snippet"].map((title, index) => (
              <button
                key={index}
                className="px-3 py-1 text-xs bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 rounded-md"
                onClick={() => {
                  const examples = {
                    "Common English Text": "The quick brown fox jumps over the lazy dog.",
                    "Uncommon Words": "Supercalifragilisticexpialidocious is antidisestablishmentarianism.",
                    "Numbers & Symbols": "Call me at +1 (555) 123-4567 or email john.doe@example.com!",
                    "Non-English Text": "こんにちは世界! Hola Mundo! Привет мир!",
                    "Code Snippet": "function addNumbers(a, b) { return a + b; } // Adds two numbers"
                  };
                  handleExampleSelect(examples[title as keyof typeof examples]);
                }}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tokenized Content Visualization */}
      <div className="space-y-4">
        <TokenExplorer text={inputText || "Type something to see tokenization in action..."} showExample={!inputText} />
      </div>

      {showAnalysis && (
        <div className="flex items-center justify-between">
          <TokenPricingCalculator text={inputText} model={selectedModel} />
        </div>
      )}

      {showAnalysis && (
        <>
          {/* Comparison Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">
                Tokenization Methods Compared
              </h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                Different tokenization methods have varying trade-offs. Character-based methods are simple but inefficient, 
                while advanced methods like BPE and tiktoken balance efficiency with accuracy.
              </p>
            </div>
            <TokenizationComparison text={inputText} />
          </div>
        </>
      )}
    </div>
  );
}