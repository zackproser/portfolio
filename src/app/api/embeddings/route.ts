import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { inputText, model = 'text-embedding-3-small' } = await req.json();

  try {
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


