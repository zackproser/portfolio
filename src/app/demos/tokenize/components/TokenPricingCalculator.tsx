'use client'

import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

// Mock implementation for token pricing calculation
const calculateTokenPrice = (
  tokenCount: number, 
  model: string, 
  inputOrOutput: 'input' | 'output'
) => {
  // Pricing approximations based on OpenAI's pricing (as of 2023)
  const pricing = {
    'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-4-32k': { input: 0.06, output: 0.12 },
  } as const;
  
  const pricePerMillion = pricing[model as keyof typeof pricing][inputOrOutput];
  return (tokenCount / 1000000) * pricePerMillion;
};

export function TokenPricingCalculator() {
  const [text, setText] = useState('');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [tokenCount, setTokenCount] = useState(0);
  
  useEffect(() => {
    // Simulate token count estimation using a simplified approach
    // In reality, you'd use the actual tokenizer
    const estimatedTokens = text.split(/\s+/).filter(Boolean).length * 1.3;
    setTokenCount(Math.ceil(estimatedTokens));
  }, [text]);
  
  const inputPrice = calculateTokenPrice(tokenCount, model, 'input');
  const outputPrice = calculateTokenPrice(tokenCount, model, 'output');
  
  return (
    <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg mb-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-zinc-800 dark:text-white">
        <Zap size={20} className="text-yellow-500" />
        Token Pricing Calculator
      </h3>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-zinc-800 dark:text-white">Enter some text:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md text-zinc-900 dark:text-white"
          rows={3}
          placeholder="Enter your prompt or expected response here..."
        />
      </div>
      
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-zinc-800 dark:text-white">Select model:</label>
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="p-2 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 rounded-md text-zinc-900 dark:text-white"
        >
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
          <option value="gpt-4-32k">GPT-4 32k</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
        <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold text-zinc-800 dark:text-white">{tokenCount}</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Estimated Tokens</div>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold text-zinc-800 dark:text-white">${inputPrice.toFixed(6)}</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Input Cost</div>
        </div>
        <div className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-lg">
          <div className="text-xl font-bold text-zinc-800 dark:text-white">${outputPrice.toFixed(6)}</div>
          <div className="text-sm text-zinc-600 dark:text-zinc-400">Output Cost</div>
        </div>
      </div>
      
      <p className="mt-4 text-xs text-zinc-600 dark:text-zinc-400">
        Note: This is an approximate calculation based on OpenAI's pricing. Actual token counts may vary slightly when using the official tokenizer.
      </p>
    </div>
  );
} 