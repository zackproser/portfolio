'use client'

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';
import { TokenizedText } from './TokenizedText';
import { TokenIdVisualization } from './TokenIdVisualization';
import { ENCODING_EXPLANATIONS, characterTokenize, wordTokenize, bpeTokenize, wordpieceTokenize, tiktokenTokenize } from '../utils';

type TokenExplorerProps = {
  text: string;
  showExample?: boolean;
  tokenizationMethod?: string;
}

export function TokenExplorer({
  text,
  showExample = true,
  tokenizationMethod = 'tiktoken'
}: TokenExplorerProps) {
  // Convert the passed tokenizationMethod to a valid encoding type
  const getEncodingFromMethod = (method: string): keyof typeof ENCODING_EXPLANATIONS => {
    switch (method) {
      case 'tiktoken': return 'tiktoken';
      case 'character': return 'character';
      case 'wordpiece': return 'word';
      case 'bpe': return 'bpe';
      default: return 'tiktoken';
    }
  };

  const [encodingType, setEncodingType] = useState<keyof typeof ENCODING_EXPLANATIONS>(
    getEncodingFromMethod(tokenizationMethod)
  );
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState(-1);
  const [tokens, setTokens] = useState<number[]>([]);
  const [tokenTexts, setTokenTexts] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);
  
  // Update encoding type when tokenizationMethod changes
  useEffect(() => {
    setEncodingType(getEncodingFromMethod(tokenizationMethod));
  }, [tokenizationMethod]);
  
  useEffect(() => {
    // Update tokens based on encoding type
    async function updateTokens() {
      let texts: string[] = [];
      let ids: number[] = [];
      
      try {
        switch (encodingType) {
          case 'character':
            texts = characterTokenize(text);
            ids = texts.map((_, i) => i + 33);
            break;
          case 'word':
            texts = wordTokenize(text);
            ids = texts.map((_, i) => i + 1000);
            break;
          case 'bpe':
            texts = await bpeTokenize(text);
            ids = texts.map((_, i) => i + 10000);
            break;
          case 'wordpiece':
            texts = await wordpieceTokenize(text);
            ids = texts.map((_, i) => i + 20000);
            break;
          case 'tiktoken':
            texts = tiktokenTokenize(text);
            ids = texts.map((_, i) => i + 30000);
            break;
        }
        
        setTokenTexts(texts);
        setTokens(ids);
      } catch (error) {
        console.error('Error updating tokens:', error);
        // Reset to character tokenization on error
        texts = characterTokenize(text);
        ids = texts.map((_, i) => i + 33);
        setTokenTexts(texts);
        setTokens(ids);
      }
    }
    
    updateTokens();
  }, [text, encodingType]);
  
  // Get the explanation for the current encoding
  const explanation = ENCODING_EXPLANATIONS[encodingType];
  
  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <TokenizedText 
          text={text} 
          tokenType={encodingType}
          highlightIndex={hoveredTokenIndex}
          onHoverToken={setHoveredTokenIndex}
        />
        
        <TokenIdVisualization 
          tokens={tokens}
          tokenTexts={tokenTexts}
          highlightIndex={hoveredTokenIndex}
          onHoverToken={setHoveredTokenIndex}
        />
      </div>

      <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-zinc-800 dark:text-white">{explanation.title}</h3>
          <button
            className="text-sm text-zinc-600 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-white"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? 'Hide' : 'Show'} Explanation
          </button>
        </div>
        
        {showExplanation && (
          <div className="mb-4 space-y-3">
            <p className="text-zinc-700 dark:text-zinc-300">{explanation.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-green-600 dark:text-green-400 mb-2">Pros</h4>
                <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300">
                  {explanation.pros.map((pro, i) => (
                    <li key={i}>{pro}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Cons</h4>
                <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300">
                  {explanation.cons.map((con, i) => (
                    <li key={i}>{con}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 