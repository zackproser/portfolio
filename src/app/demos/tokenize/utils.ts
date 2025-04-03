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

export const mockBpeTokenize = (text: string) => {
  // This is a simplified mock of BPE tokenization
  // In a real implementation, you would use a proper BPE tokenizer
  const words = text.split(/\s+/).filter(w => w.length > 0);
  let result: string[] = [];
  
  words.forEach(word => {
    if (word.length <= 3) {
      result.push(word);
    } else if (word.endsWith('ing')) {
      result.push(word.slice(0, -3));
      result.push('ing');
    } else if (word.endsWith('ed')) {
      result.push(word.slice(0, -2));
      result.push('ed');
    } else if (word.length > 5) {
      // Split longer words arbitrarily to simulate subword tokenization
      result.push(word.slice(0, Math.ceil(word.length/2)));
      result.push(word.slice(Math.ceil(word.length/2)));
    } else {
      result.push(word);
    }
  });
  
  return result;
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
    description: "A subword tokenization method that starts with characters and iteratively merges the most common pairs. BPE balances efficiency and meaning by creating common subwords while handling rare combinations character by character.",
    pros: ["Good balance between vocabulary size and token length", "Handles rare words well", "Used by many modern models (GPT, RoBERTa)"],
    cons: ["More complex implementation", "Can create unintuitive splits", "Requires training on a corpus"]
  },
  wordpiece: {
    title: "WordPiece",
    description: "Similar to BPE but uses a different algorithm. Instead of merging most frequent pairs, it combines pairs that maximize likelihood of the training data. Used by BERT and other Google models.",
    pros: ["Good for morphologically rich languages", "Handles compound words well", "Used by BERT and other Google models"],
    cons: ["Complex training process", "Requires large corpus", "Can create unintuitive splits"]
  },
  unigram: {
    title: "Unigram",
    description: "Starts with a large vocabulary and iteratively removes tokens that don't significantly reduce the model's ability to compress the training data. This probabilistic approach often produces more natural subwords.",
    pros: ["Often creates more natural subwords", "Probabilistic approach", "Used by many Japanese/Chinese models"],
    cons: ["Most complex of the subword methods", "Computationally intensive training", "Larger initial vocabulary required"]
  },
  tiktoken: {
    title: "tiktoken (GPT Tokenizer)",
    description: "OpenAI's custom BPE-based tokenizer used for ChatGPT and other GPT models. It works on bytes rather than unicode characters, which helps it handle any language and even binary data.",
    pros: ["Works with any language", "Can encode any sequence of bytes", "Very efficient", "Used by ChatGPT and GPT models"],
    cons: ["Complex implementation", "Can create unintuitive splits", "Special tokens need careful handling"]
  }
} as const; 