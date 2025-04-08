'use client'

import { useState, useEffect } from 'react';
import { getConsistentColor, characterTokenize, wordTokenize, bpeTokenize, wordpieceTokenize, tiktokenTokenize } from '../utils';

type TokenizedTextProps = {
  text: string;
  tokenType: string;
  highlightIndex?: number;
  onHoverToken?: (index: number) => void;
};

export function TokenizedText({ 
  text, 
  tokenType, 
  highlightIndex = -1,
  onHoverToken = (index: number) => {}
}: TokenizedTextProps) {
  const [tokens, setTokens] = useState<string[]>([]);
  const [positions, setPositions] = useState<{start: number, end: number}[]>([]);
  
  useEffect(() => {
    async function updateTokenization() {
      try {
        let newTokens: string[] = [];
        let newPositions: {start: number, end: number}[] = [];
        
        switch (tokenType) {
          case 'character':
            newTokens = characterTokenize(text);
            // Calculate character positions
            let pos = 0;
            newPositions = newTokens.map(token => {
              const start = pos;
              pos += token.length;
              return {start, end: pos};
            });
            break;
            
          case 'word':
            newTokens = wordTokenize(text);
            // Calculate word positions
            let wordPos = 0;
            const regex = /\S+/g;
            let match;
            while ((match = regex.exec(text)) !== null) {
              newPositions.push({start: match.index, end: match.index + match[0].length});
            }
            break;
            
          case 'bpe':
            newTokens = await bpeTokenize(text);
            // Approximate positions for BPE tokens
            newPositions = await calculateSubwordPositions(text, newTokens);
            break;
            
          case 'wordpiece':
            newTokens = await wordpieceTokenize(text);
            // Approximate positions for WordPiece tokens
            newPositions = await calculateSubwordPositions(text, newTokens);
            break;
            
          case 'tiktoken':
            newTokens = tiktokenTokenize(text);
            // Approximate positions for tiktoken tokens
            newPositions = await calculateSubwordPositions(text, newTokens);
            break;
        }
        
        setTokens(newTokens);
        setPositions(newPositions);
      } catch (error) {
        console.error('Error in tokenization:', error);
        // Fallback to character tokenization
        const fallbackTokens = characterTokenize(text);
        let pos = 0;
        const fallbackPositions = fallbackTokens.map(token => {
          const start = pos;
          pos += token.length;
          return {start, end: pos};
        });
        setTokens(fallbackTokens);
        setPositions(fallbackPositions);
      }
    }
    
    updateTokenization();
  }, [text, tokenType]);
  
  // Helper function to calculate subword token positions
  async function calculateSubwordPositions(text: string, tokens: string[]) {
    const positions: {start: number, end: number}[] = [];
    let currentPos = 0;
    
    for (const token of tokens) {
      // Skip special tokens (those starting with special characters)
      if (token.startsWith('Ġ') || token.startsWith('##') || token.startsWith('▁')) {
        const actualToken = token.replace(/^(Ġ|##|▁)/, '');
        // Find the next occurrence of this token after the current position
        const nextPos = text.indexOf(actualToken, currentPos);
        if (nextPos !== -1) {
          positions.push({
            start: nextPos,
            end: nextPos + actualToken.length
          });
          currentPos = nextPos + actualToken.length;
        } else {
          // If we can't find the exact position, approximate it
          positions.push({
            start: currentPos,
            end: currentPos + actualToken.length
          });
          currentPos += actualToken.length;
        }
      } else {
        // For regular tokens, just use the current position
        positions.push({
          start: currentPos,
          end: currentPos + token.length
        });
        currentPos += token.length;
      }
    }
    
    return positions;
  }
  
  // Create spans for each token
  const spans = [];
  let lastEnd = 0;
  
  for (let i = 0; i < positions.length; i++) {
    const { start, end } = positions[i];
    
    // Add any text between tokens
    if (start > lastEnd) {
      spans.push(
        <span key={`space-${i}`} className="text-gray-400">
          {text.substring(lastEnd, start)}
        </span>
      );
    }
    
    // Add the token with its color
    spans.push(
      <span 
        key={`token-${i}`}
        className={`relative ${highlightIndex === i ? 'ring-2 ring-white' : ''}`}
        style={{ 
          backgroundColor: getConsistentColor(tokens[i], i),
          color: 'black',
          borderRadius: '3px',
          padding: '1px 2px',
          margin: '0 1px',
          cursor: 'pointer',
          display: 'inline-block',
          fontWeight: 500,
          textShadow: '0 0 1px rgba(255,255,255,0.5)'
        }}
        onMouseEnter={() => onHoverToken(i)}
        onMouseLeave={() => onHoverToken(-1)}
      >
        {text.substring(start, end)}
        {highlightIndex === i && (
          <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-10">
            Token {i}
          </span>
        )}
      </span>
    );
    
    lastEnd = end;
  }
  
  // Add any remaining text
  if (lastEnd < text.length) {
    spans.push(
      <span key="final-space" className="text-gray-400">
        {text.substring(lastEnd)}
      </span>
    );
  }
  
  return <div className="font-mono leading-relaxed text-lg">{spans}</div>;
} 