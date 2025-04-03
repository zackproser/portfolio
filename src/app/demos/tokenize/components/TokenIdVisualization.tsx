'use client'

import { getConsistentColor } from '../utils';

type TokenIdVisualizationProps = { 
  tokens: number[];
  tokenTexts: string[];
  highlightIndex?: number;
  onHoverToken?: (index: number) => void;
}

export function TokenIdVisualization({ 
  tokens,
  tokenTexts,
  highlightIndex = -1,
  onHoverToken = (index: number) => {}
}: TokenIdVisualizationProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tokens.map((tokenId, index) => (
        <div 
          key={index}
          className={`relative px-3 py-2 rounded flex flex-col items-center text-black ${highlightIndex === index ? 'ring-2 ring-white' : ''}`}
          style={{ 
            backgroundColor: getConsistentColor(tokenTexts[index], index),
            cursor: 'pointer'
          }}
          onMouseEnter={() => onHoverToken(index)}
          onMouseLeave={() => onHoverToken(-1)}
        >
          <span className="text-sm font-bold">ID: {tokenId}</span>
          <span className="text-xs">"{tokenTexts[index]}"</span>
        </div>
      ))}
    </div>
  );
} 