'use client'

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Info } from 'lucide-react';
import { TokenizedText } from './TokenizedText';
import { TokenIdVisualization } from './TokenIdVisualization';
import { ENCODING_EXPLANATIONS, characterTokenize, wordTokenize, mockBpeTokenize } from '../utils';

type TokenExplorerProps = {
  text: string;
  showExample?: boolean;
}

export function TokenExplorer({
  text,
  showExample = true
}: TokenExplorerProps) {
  const [encodingType, setEncodingType] = useState<keyof typeof ENCODING_EXPLANATIONS>('character');
  const [hoveredTokenIndex, setHoveredTokenIndex] = useState(-1);
  const [tokens, setTokens] = useState<number[]>([]);
  const [tokenTexts, setTokenTexts] = useState<string[]>([]);
  const [showExplanation, setShowExplanation] = useState(true);
  
  useEffect(() => {
    // Update tokens based on encoding type
    if (encodingType === 'character') {
      setTokenTexts(characterTokenize(text));
      // Mock token IDs for character tokenization
      setTokens(characterTokenize(text).map((_, i) => i + 33)); 
    } else if (encodingType === 'word') {
      setTokenTexts(wordTokenize(text));
      // Mock token IDs for word tokenization
      setTokens(wordTokenize(text).map((_, i) => i + 1000)); 
    } else {
      // For other methods, use our mock BPE implementation
      setTokenTexts(mockBpeTokenize(text));
      // Mock token IDs for BPE tokenization
      setTokens(mockBpeTokenize(text).map((_, i) => i + 10000)); 
    }
  }, [text, encodingType]);
  
  // Get the explanation for the current encoding
  const explanation = ENCODING_EXPLANATIONS[encodingType];
  
  return (
    <div className="mb-8 bg-white dark:bg-zinc-900 p-5 rounded-lg border border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2 text-zinc-800 dark:text-white">
          <Eye size={20} />
          Token Explorer
        </h3>
        <div className="flex items-center gap-2">
          <button 
            className="bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white px-3 py-1 rounded-md text-sm flex items-center gap-1"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            {showExplanation ? <EyeOff size={16} /> : <Info size={16} />}
            {showExplanation ? 'Hide' : 'Show'} explanation
          </button>
        </div>
      </div>
      
      {showExplanation && (
        <div className="mb-4 p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <h4 className="font-bold text-lg mb-2 text-zinc-800 dark:text-white">{explanation.title}</h4>
          <p className="mb-3 text-zinc-700 dark:text-zinc-300">{explanation.description}</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h5 className="font-bold text-green-600 dark:text-green-400 mb-1">Advantages</h5>
              <ul className="list-disc pl-5 text-zinc-700 dark:text-zinc-300">
                {explanation.pros.map((pro, i) => (
                  <li key={i}>{pro}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-red-600 dark:text-red-400 mb-1">Limitations</h5>
              <ul className="list-disc pl-5 text-zinc-700 dark:text-zinc-300">
                {explanation.cons.map((con, i) => (
                  <li key={i}>{con}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-sm font-medium text-zinc-800 dark:text-white">Tokenization Method:</span>
          {Object.keys(ENCODING_EXPLANATIONS).map((type) => (
            <button
              key={type}
              className={`px-3 py-1 text-sm rounded-full ${
                encodingType === type 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-white'
              }`}
              onClick={() => setEncodingType(type as keyof typeof ENCODING_EXPLANATIONS)}
            >
              {ENCODING_EXPLANATIONS[type as keyof typeof ENCODING_EXPLANATIONS].title}
            </button>
          ))}
        </div>
        
        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg mb-4">
          <h4 className="font-medium mb-2 text-zinc-800 dark:text-white">Original Text with Token Boundaries:</h4>
          <TokenizedText 
            text={text} 
            tokenType={encodingType}
            highlightIndex={hoveredTokenIndex}
            onHoverToken={setHoveredTokenIndex}
          />
        </div>
        
        <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <h4 className="font-medium mb-2 text-zinc-800 dark:text-white">Tokens and Their IDs:</h4>
          <TokenIdVisualization 
            tokens={tokens}
            tokenTexts={tokenTexts}
            highlightIndex={hoveredTokenIndex}
            onHoverToken={setHoveredTokenIndex}
          />
          <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
            <span className="font-bold">Token Count:</span> {tokens.length} tokens
            {encodingType === 'tiktoken' && (
              <span> (≈ {Math.ceil(tokens.length / 4)} tokens billed by OpenAI)</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 