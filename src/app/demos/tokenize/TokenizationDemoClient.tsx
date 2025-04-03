'use client'

import { useState } from 'react';
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

  return (
    <div className="space-y-8 mt-8">
      <div className="mb-8">
        <label className="block text-lg font-medium mb-2 text-zinc-800 dark:text-zinc-200">Try your own text:</label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="w-full p-4 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-zinc-900 dark:text-white resize-none"
          rows={4}
          placeholder="Enter any text to see how different tokenizers process it..."
        />
      </div>

      {inputText ? (
        <>
          <TokenExplorer text={inputText} showExample={false} />
          <TokenizationComparison text={inputText} />
        </>
      ) : (
        <Examples />
      )}

      <TokenPricingCalculator />
      <TokenApplications />
      <TokenizationQuiz />
    </div>
  );
}