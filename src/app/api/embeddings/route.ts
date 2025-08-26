import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const { inputText, model = 'text-embedding-3-small' } = await req.json();

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.warn('OPENAI_API_KEY is not set. Embeddings API is disabled.');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const openai = new OpenAI({ apiKey });
    const response = await openai.embeddings.create({
      model,
      input: inputText,
    });

    const generatedEmbeddings = response.data[0].embedding;
    console.log(`Generated embeddings with model ${model}`);

    return NextResponse.json({ embeddings: generatedEmbeddings }, { status: 200 });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}


