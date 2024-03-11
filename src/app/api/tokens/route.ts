import { NextRequest, NextResponse } from 'next/server';
import { Tiktoken } from "tiktoken/lite";
import cl100k_base from "tiktoken/encoders/cl100k_base.json";

const encoding = new Tiktoken(
  cl100k_base.bpe_ranks,
  cl100k_base.special_tokens,
  cl100k_base.pat_str
);

export async function POST(req: NextRequest) {
  const { inputText } = await req.json();

  try {
    if (!encoding) {
      throw new Error('Encoding not loaded');
    }

    console.log(`TEST`)
    console.log(`inputText: ${inputText}`)
    const tokens = encoding.encode(inputText);
    console.log(`tokens: %o`, tokens);

    return NextResponse.json({ tokens }, { status: 200 });
  } catch (error) {
    console.error('Error generating tokens:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
