'use client'

import { characterTokenize, wordTokenize, mockBpeTokenize, getConsistentColor } from '../utils';

type TokenizedTextProps = { 
  text: string; 
  tokenType: 'character' | 'word' | 'bpe' | 'wordpiece' | 'unigram' | 'tiktoken';
  highlightIndex?: number;
  onHoverToken?: (index: number) => void;
}

export function TokenizedText({ 
  text, 
  tokenType, 
  highlightIndex = -1,
  onHoverToken = (index: number) => {}
}: TokenizedTextProps) {
  // Get tokens based on selected method
  let tokens: string[] = [];
  let positions: {start: number, end: number}[] = [];
  
  if (tokenType === 'character') {
    tokens = characterTokenize(text);
    // Calculate character positions
    let pos = 0;
    positions = tokens.map(token => {
      const start = pos;
      pos += token.length;
      return {start, end: pos};
    });
  } else if (tokenType === 'word') {
    tokens = wordTokenize(text);
    
    // Calculate word positions
    let pos = 0;
    const regex = /\S+/g;
    let match;
    while ((match = regex.exec(text)) !== null) {
      positions.push({start: match.index, end: match.index + match[0].length});
    }
  } else {
    // For BPE and other subword methods, we'll use a mock implementation
    tokens = mockBpeTokenize(text);
    
    // This is a simplified approximation of positions for the mock
    let pos = 0;
    const words = text.split(/\s+/).filter(w => w.length > 0);
    let wordIndex = 0;
    let subwordIndex = 0;
    
    positions = words.flatMap(word => {
      const wordStart = text.indexOf(word, pos);
      pos = wordStart + word.length;
      
      if (word.length <= 3 || 
         (!word.endsWith('ing') && !word.endsWith('ed') && word.length <= 5)) {
        return [{start: wordStart, end: wordStart + word.length}];
      } else if (word.endsWith('ing')) {
        const stem = word.slice(0, -3);
        return [
          {start: wordStart, end: wordStart + stem.length},
          {start: wordStart + stem.length, end: wordStart + word.length}
        ];
      } else if (word.endsWith('ed')) {
        const stem = word.slice(0, -2);
        return [
          {start: wordStart, end: wordStart + stem.length},
          {start: wordStart + stem.length, end: wordStart + word.length}
        ];
      } else {
        // Split longer words
        const half = Math.ceil(word.length/2);
        return [
          {start: wordStart, end: wordStart + half},
          {start: wordStart + half, end: wordStart + word.length}
        ];
      }
    });
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
          borderRadius: '3px',
          padding: '0 1px',
          margin: '0 1px',
          cursor: 'pointer',
          display: 'inline-block'
        }}
        onMouseEnter={() => onHoverToken(i)}
        onMouseLeave={() => onHoverToken(-1)}
      >
        {text.substring(start, end)}
        {highlightIndex === i && (
          <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-1 rounded">
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