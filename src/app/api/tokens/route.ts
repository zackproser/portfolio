import { NextRequest, NextResponse } from 'next/server';
import { encodingForModel } from "js-tiktoken";

// Helper functions for different tokenization methods
const characterTokenize = (text: string) => {
  return text.split('').map((char, i) => ({
    token: char,
    id: i + 33 // Start from ASCII 33 for readability
  }));
};

const wordTokenize = (text: string) => {
  return text.split(/\s+/)
    .filter(w => w.length > 0)
    .map((word, i) => ({
      token: word,
      id: i + 1000 // Start from 1000 for word tokens
    }));
};

// Simple BPE-style tokenization that splits on common suffixes and prefixes
const simpleBpeTokenize = (text: string) => {
  const commonPrefixes = ['un', 're', 'in', 'dis', 'pre', 'post'];
  const commonSuffixes = ['ing', 'ed', 'er', 'est', 'ly', 'tion', 'able', 'ible'];
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const tokens: { token: string; id: number }[] = [];
  let id = 10000; // Start from 10000 for BPE tokens
  
  for (const word of words) {
    let processed = false;
    
    // Check for prefixes
    for (const prefix of commonPrefixes) {
      if (word.startsWith(prefix) && word.length > prefix.length + 2) {
        tokens.push({ token: prefix, id: id++ });
        tokens.push({ token: word.slice(prefix.length), id: id++ });
        processed = true;
        break;
      }
    }
    
    // Check for suffixes if no prefix was found
    if (!processed) {
      for (const suffix of commonSuffixes) {
        if (word.endsWith(suffix) && word.length > suffix.length + 2) {
          tokens.push({ token: word.slice(0, -suffix.length), id: id++ });
          tokens.push({ token: suffix, id: id++ });
          processed = true;
          break;
        }
      }
    }
    
    // If no prefix or suffix was found, split on capital letters or add as is
    if (!processed) {
      if (word.match(/[A-Z][a-z]+/g)) {
        // Split on capital letters for camelCase/PascalCase
        const subTokens = word.split(/(?=[A-Z])/).filter(t => t.length > 0);
        tokens.push(...subTokens.map(t => ({ token: t, id: id++ })));
      } else {
        tokens.push({ token: word, id: id++ });
      }
    }
  }
  
  return tokens;
};

// Simple WordPiece-style tokenization that splits unknown words into characters
const simpleWordpieceTokenize = (text: string) => {
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she'
  ]);
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const tokens: { token: string; id: number }[] = [];
  let id = 20000; // Start from 20000 for WordPiece tokens
  
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    
    if (commonWords.has(lowerWord)) {
      tokens.push({ token: word, id: id++ });
    } else {
      // Split into subwords based on common patterns
      const subwords = word.split(/([A-Z][a-z]+|\d+|[^A-Za-z0-9]+)/).filter(sw => sw.length > 0);
      
      if (subwords.length > 1) {
        tokens.push(...subwords.map(t => ({ token: t, id: id++ })));
      } else {
        // If no natural splits, split into overlapping character sequences
        for (let i = 0; i < word.length; i += 2) {
          const piece = word.slice(i, Math.min(i + 3, word.length));
          tokens.push({ token: piece, id: id++ });
        }
      }
    }
  }
  
  return tokens;
};

export async function POST(req: NextRequest) {
  try {
    const { inputText, method = 'tiktoken' } = await req.json();
    console.log(`inputText: ${inputText}, method: ${method}`);

    let tokens;
    
    switch (method) {
      case 'character':
        tokens = characterTokenize(inputText);
        break;
      case 'word':
        tokens = wordTokenize(inputText);
        break;
      case 'bpe':
        tokens = simpleBpeTokenize(inputText);
        break;
      case 'wordpiece':
        tokens = simpleWordpieceTokenize(inputText);
        break;
      case 'tiktoken':
      default:
        const enc = encodingForModel('gpt-3.5-turbo');
        const tokenIds = enc.encode(inputText);
        tokens = tokenIds.map(id => ({
          token: enc.decode([id]),
          id
        }));
        break;
    }

    return NextResponse.json({ tokens }, { status: 200 });
  } catch (error) {
    console.error('Error in token generation:', error);
    return NextResponse.json({ error: 'Failed to generate tokens' }, { status: 500 });
  }
}
