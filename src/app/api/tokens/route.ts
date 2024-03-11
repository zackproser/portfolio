import { NextRequest, NextResponse } from 'next/server';
import { encodingForModel } from "js-tiktoken";

export async function POST(req: NextRequest) {

  try {
    const enc = encodingForModel('gpt-3.5-turbo');

    const { inputText } = await req.json();
    console.log(`inputText: ${inputText}`);

    const tokens = enc.encode(inputText);

    return NextResponse.json({ tokens }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
