import { NextResponse } from 'next/server';
import embeddings from "@themaximalist/embeddings.js";

export async function POST(req) {
  const { inputText } = await req.json();
  try {
    const generatedEmbeddings = await embeddings(inputText);
    return NextResponse.json({ embeddings: generatedEmbeddings }, { status: 200 });
  } catch (error) {
    console.error('Error generating embeddings:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}


