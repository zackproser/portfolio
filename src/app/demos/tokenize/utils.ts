import { encodingForModel } from "js-tiktoken";

export const TOKEN_COLORS = [
  '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff', '#ffc6ff',
  '#fffffc', '#ffd8be', '#ffeedd', '#ddffbb', '#bee9e8', '#caf0f8', '#d0d1ff'
];

export const getConsistentColor = (token: string, index: number) => {
  // Use hash function for consistent coloring based on token content
  const hash = token.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  return TOKEN_COLORS[Math.abs(hash) % TOKEN_COLORS.length];
};

export const characterTokenize = (text: string) => {
  return text.split('');
};

export const wordTokenize = (text: string) => {
  return text.split(/\s+/).filter(w => w.length > 0);
};

// Simple BPE-style tokenization that splits on common suffixes and prefixes
export const simpleBpeTokenize = (text: string) => {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const tokens: string[] = [];
  
  const commonPrefixes = ['un', 're', 'in', 'dis', 'pre', 'post'];
  const commonSuffixes = ['ing', 'ed', 'er', 'est', 'ly', 'tion', 'able', 'ible'];
  
  for (const word of words) {
    let processed = false;
    
    // Check for prefixes
    for (const prefix of commonPrefixes) {
      if (word.startsWith(prefix) && word.length > prefix.length + 2) {
        tokens.push(prefix);
        tokens.push(word.slice(prefix.length));
        processed = true;
        break;
      }
    }
    
    // Check for suffixes if no prefix was found
    if (!processed) {
      for (const suffix of commonSuffixes) {
        if (word.endsWith(suffix) && word.length > suffix.length + 2) {
          tokens.push(word.slice(0, -suffix.length));
          tokens.push(suffix);
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
        tokens.push(...subTokens);
      } else {
        tokens.push(word);
      }
    }
  }
  
  return tokens;
};

// Simple WordPiece-style tokenization that splits unknown words into characters
export const simpleWordpieceTokenize = (text: string) => {
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she'
  ]);
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const tokens: string[] = [];
  
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    
    if (commonWords.has(lowerWord)) {
      tokens.push(word);
    } else {
      // Split into subwords based on common patterns
      const subwords = word.split(/([A-Z][a-z]+|\d+|[^A-Za-z0-9]+)/).filter(sw => sw.length > 0);
      
      if (subwords.length > 1) {
        tokens.push(...subwords);
      } else {
        // If no natural splits, split into overlapping character sequences
        for (let i = 0; i < word.length; i += 2) {
          const piece = word.slice(i, Math.min(i + 3, word.length));
          tokens.push(piece);
        }
      }
    }
  }
  
  return tokens;
};

export const tiktokenTokenize = (text: string) => {
  const enc = encodingForModel('gpt-3.5-turbo');
  const tokenIds = enc.encode(text);
  return tokenIds.map(id => enc.decode([id]));
};

// Detailed explanations for each tokenization method
export const ENCODING_EXPLANATIONS = {
  character: {
    title: "Character Tokenization",
    description: "The simplest form of tokenization. Each character (letter, number, symbol) becomes a separate token. This approach is straightforward but inefficient, as it creates many tokens even for short texts.",
    pros: ["Simple to implement", "No vocabulary needed", "Works for any language"],
    cons: ["Very inefficient - large number of tokens", "No semantic meaning captured", "Doesn't handle rare characters well"]
  },
  word: {
    title: "Word Tokenization",
    description: "Text is split into words, typically at spaces and punctuation. This is intuitive for humans but has limitations for machine learning, especially with compound words, misspellings, and rare words.",
    pros: ["Intuitive for humans", "Preserves full words", "Fewer tokens than character-level"],
    cons: ["Large vocabulary needed", "Can't handle out-of-vocabulary words", "Problematic for languages without clear word boundaries"]
  },
  bpe: {
    title: "Byte-Pair Encoding (BPE)",
    description: "A simplified demonstration of BPE-style tokenization that splits words based on common prefixes and suffixes. Real BPE would learn these patterns from data.",
    pros: ["Handles common word parts", "Balances word and subword tokens", "Demonstrates subword tokenization concepts"],
    cons: ["Simplified implementation", "Fixed vocabulary", "Less sophisticated than real BPE"]
  },
  wordpiece: {
    title: "WordPiece",
    description: "A simplified WordPiece-style tokenizer that keeps common words intact and splits unknown words into overlapping pieces. Real WordPiece would use a learned vocabulary.",
    pros: ["Preserves common words", "Handles unknown words", "Shows basic subword concepts"],
    cons: ["Simplified implementation", "Limited vocabulary", "Basic splitting rules"]
  },
  tiktoken: {
    title: "Tiktoken (OpenAI)",
    description: "OpenAI's optimized tokenizer used for their models like GPT-3.5 and GPT-4. It's a BPE variant that's been trained on a large corpus and optimized for efficiency.",
    pros: ["Fast and efficient", "Used by OpenAI models", "Well-optimized for English and code"],
    cons: ["Closed vocabulary", "May not handle some languages well", "Specific to OpenAI models"]
  }
}; 