'use client'

import { ENCODING_EXPLANATIONS, characterTokenize, wordTokenize, simpleBpeTokenize, tiktokenTokenize } from '../utils';

type TokenizationComparisonProps = {
  text: string;
}

export function TokenizationComparison({ text }: TokenizationComparisonProps) {
  const methods = ['character', 'word', 'bpe', 'tiktoken'] as const;
  
  // Get token counts for each method
  const getTokenCount = (text: string, method: typeof methods[number]) => {
    switch (method) {
      case 'character':
        return characterTokenize(text).length;
      case 'word':
        return wordTokenize(text).length;
      case 'bpe':
        return simpleBpeTokenize(text).length;
      case 'tiktoken':
        return tiktokenTokenize(text).length;
      default:
        return 0;
    }
  };
  
  const tokenCounts = methods.map(method => getTokenCount(text, method));
  const maxCount = Math.max(...tokenCounts);
  
  return (
    <div className="mb-8 p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <h3 className="text-lg font-bold mb-4 text-zinc-800 dark:text-white">Tokenization Method Comparison</h3>
      
      {methods.map((method, i) => (
        <div key={method} className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-zinc-800 dark:text-white">{ENCODING_EXPLANATIONS[method].title}</span>
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{tokenCounts[i]} tokens</span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-4">
            <div 
              className="h-full rounded-full"
              style={{ 
                width: `${(tokenCounts[i] / maxCount) * 100}%`,
                backgroundColor: method === 'tiktoken' ? '#10b981' : '#3b82f6',
              }}
            ></div>
          </div>
        </div>
      ))}
      
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-4">
        The length of each bar represents the relative number of tokens created by each method. 
        More efficient methods create fewer tokens for the same text.
      </p>
    </div>
  );
} 