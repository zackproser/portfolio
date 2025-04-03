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

const mockBpeTokenize = (text: string) => {
  // This is a simplified mock of BPE tokenization
  const words = text.split(/\s+/).filter(w => w.length > 0);
  let result: { token: string; id: number }[] = [];
  let id = 10000; // Start from 10000 for BPE tokens
  
  words.forEach(word => {
    if (word.length <= 3) {
      result.push({ token: word, id: id++ });
    } else if (word.endsWith('ing')) {
      result.push({ token: word.slice(0, -3), id: id++ });
      result.push({ token: 'ing', id: id++ });
    } else if (word.endsWith('ed')) {
      result.push({ token: word.slice(0, -2), id: id++ });
      result.push({ token: 'ed', id: id++ });
    } else if (word.length > 5) {
      result.push({ token: word.slice(0, Math.ceil(word.length/2)), id: id++ });
      result.push({ token: word.slice(Math.ceil(word.length/2)), id: id++ });
    } else {
      result.push({ token: word, id: id++ });
    }
  });
  
  return result;
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
      case 'wordpiece':
      case 'unigram':
        tokens = mockBpeTokenize(inputText);
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
