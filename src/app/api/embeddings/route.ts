import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const { inputText } = await req.json();

  try {
    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: inputText,
    });

    const generatedEmbeddings = response.data[0].embedding;
    console.log(`Generated embeddings: %o`, generatedEmbeddings);

    return NextResponse.json({ embeddings: generatedEmbeddings }, { status: 200 });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}


