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

export function TokenPricingCalculator({ 
  text, 
  model 
}: { 
  text: string;
  model: string;
}) {
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
    <div className="flex items-center space-x-4 text-sm">
      <div className="text-zinc-600 dark:text-zinc-400">
        ~{tokenCount} tokens
      </div>
      <div className="text-zinc-600 dark:text-zinc-400">
        Input cost: ${inputPrice.toFixed(6)}
      </div>
      <div className="text-zinc-600 dark:text-zinc-400">
        Output cost: ${outputPrice.toFixed(6)}
      </div>
    </div>
  );
} 