import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(req: NextRequest) {
  try {
    const { namespace } = await req.json();

    if (!namespace) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log(`Creating namespace ${namespace}...`);

    const pc = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as unknown as string
    });

    const indexName = `vector-database-demo`
    const ns = pc.index(indexName).namespace(namespace);

    await ns.upsert([
      {
        id: 'id-1',
        values: [0.1]
      }
    ])

    return NextResponse.json(
      { message: 'Index created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating index:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
