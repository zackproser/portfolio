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

// Enhanced BPE tokenization
export const bpeTokenize = async (text: string): Promise<string[]> => {
  // More advanced BPE tokenization
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const tokens: string[] = [];
  
  const commonPairs: Record<string, string> = {
    'th': 'th', 'he': 'he', 'in': 'in', 'er': 'er', 'an': 'an',
    'en': 'en', 'es': 'es', 're': 're', 'on': 'on', 'at': 'at',
    'ed': 'ed', 'nd': 'nd', 'to': 'to', 'or': 'or', 'ea': 'ea',
    'ti': 'ti', 'ar': 'ar', 'te': 'te', 'al': 'al', 'st': 'st',
    'it': 'it', 'li': 'li', 'is': 'is', 'ing': 'ing', 'ion': 'ion'
  };
  
  for (const word of words) {
    // For simplicity, check if the word is very long - if so, break it into smaller parts
    if (word.length > 10) {
      let currentWord = word;
      let subTokens: string[] = [];
      
      // First try to extract common prefixes and suffixes
      for (const prefix of ['un', 're', 'in', 'dis', 'pre', 'post']) {
        if (currentWord.startsWith(prefix) && currentWord.length > prefix.length + 2) {
          subTokens.push(prefix);
          currentWord = currentWord.slice(prefix.length);
          break;
        }
      }
      
      for (const suffix of ['ing', 'ed', 'er', 'est', 'ly', 'tion', 'able', 'ible']) {
        if (currentWord.endsWith(suffix) && currentWord.length > suffix.length + 2) {
          const base = currentWord.slice(0, -suffix.length);
          subTokens.push(base);
          subTokens.push(suffix);
          currentWord = '';
          break;
        }
      }
      
      // If we still have a word left, process it with pair merges
      if (currentWord.length > 0) {
        let chars = currentWord.split('');
        let merging = true;
        
        while (merging && chars.length > 1) {
          merging = false;
          for (let i = 0; i < chars.length - 1; i++) {
            const pair = chars[i] + chars[i + 1];
            if (commonPairs[pair]) {
              chars.splice(i, 2, pair);
              merging = true;
              break;
            }
          }
        }
        
        subTokens.push(...chars);
      }
      
      tokens.push(...subTokens);
    } else {
      // For shorter words, just add them directly
      tokens.push(word);
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

// Enhanced WordPiece implementation
export const wordpieceTokenize = async (text: string): Promise<string[]> => {
  const commonWords = new Set([
    'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
    'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
    'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
    'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when'
  ]);
  
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const tokens: string[] = [];
  
  for (const word of words) {
    const lowerWord = word.toLowerCase();
    
    if (commonWords.has(lowerWord)) {
      // Keep common words as single tokens, but mark them as whole words
      tokens.push(word);
    } else {
      // For unknown words, try to break them into known subwords
      // In real WordPiece, these would start with ## to indicate subwords
      
      // First, check if it has any recognizable prefixes/suffixes
      let processed = false;
      let remainingWord = word;
      let wordTokens: string[] = [];
      
      // Check common prefixes
      const prefixes = ['un', 're', 'in', 'im', 'dis', 'pre', 'non', 'anti', 'sub', 'inter'];
      for (const prefix of prefixes) {
        if (lowerWord.startsWith(prefix) && lowerWord.length > prefix.length + 2) {
          wordTokens.push(prefix);
          remainingWord = word.slice(prefix.length);
          processed = true;
          break;
        }
      }
      
      // Check common suffixes
      const suffixes = ['ing', 'ed', 'er', 'est', 'ly', 'tion', 'able', 'ible', 'ment', 'ness', 'ful', 'less'];
      for (const suffix of suffixes) {
        if (lowerWord.endsWith(suffix) && lowerWord.length > suffix.length + 2) {
          const base = remainingWord.slice(0, -suffix.length);
          wordTokens.push(base);
          wordTokens.push('##' + suffix); // Use ## prefix to denote a subword token
          processed = true;
          break;
        }
      }
      
      // If no preset patterns matched, use character-level segmentation
      if (!processed) {
        // For demonstration, we'll segment into character n-grams
        const chars = remainingWord.split('');
        let tokenStart = true;
        
        for (let i = 0; i < chars.length; i++) {
          if (tokenStart) {
            // Start of a word doesn't have ##
            wordTokens.push(chars[i]);
            tokenStart = false;
          } else {
            // Middle or end of a word gets ##
            wordTokens.push('##' + chars[i]);
          }
        }
      }
      
      tokens.push(...wordTokens);
    }
  }
  
  return tokens;
};

// Enhanced tiktoken implementation (already using the proper library)
export const tiktokenTokenize = (text: string) => {
  try {
    const enc = encodingForModel('gpt-3.5-turbo');
    const tokenIds = enc.encode(text);
    return tokenIds.map(id => enc.decode([id]));
  } catch (error) {
    console.error("Error using tiktoken, falling back to character tokenization:", error);
    // Fallback to character tokenization
    return text.split('');
  }
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
    description: "A subword tokenization algorithm that iteratively merges the most frequent pairs of bytes or characters. Used in GPT models, it efficiently handles common word parts and rare words.",
    pros: ["Efficiently balances vocabulary size and token length", "Handles unseen words well", "Used in state-of-the-art models"],
    cons: ["More complex to implement", "Requires training data", "Word boundaries can be lost"]
  },
  wordpiece: {
    title: "WordPiece",
    description: "A subword tokenization method that splits unknown words into smaller units. Used in BERT and other transformer models, it prefixes subwords with '##' to indicate they're part of a larger word.",
    pros: ["Preserves word boundaries", "Handles morphologically rich languages well", "Balances vocabulary size and token count"],
    cons: ["Requires training on a corpus", "Fixed vocabulary size", "Less efficient for some languages than BPE"]
  },
  tiktoken: {
    title: "Tiktoken (OpenAI)",
    description: "OpenAI's optimized tokenizer used for their models like GPT-3.5 and GPT-4. It's a BPE variant that's been trained on a large corpus and optimized for efficiency.",
    pros: ["Fast and efficient", "Used by OpenAI models", "Well-optimized for English and code"],
    cons: ["Closed vocabulary", "May not handle some languages well", "Specific to OpenAI models"]
  }
}; 