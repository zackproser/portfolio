import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';

export async function POST(req: NextRequest) {
  try {
    const { name, dimension } = await req.json();

    if (!name || !dimension) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    console.log(`Creating index ${name} with dimension ${dimension}`);

    const pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY as unknown as string
    });

    await pinecone.createIndex({
      name,
      dimension,
      metric: 'cosine',
      spec: {
        pod: {
          environment: 'us-west1-gcp',
          podType: 'p1.x1',
          pods: 1
        }
      },
      // This option tells the client not to throw if the index already exists.
      suppressConflicts: true,

      // This option tells the client not to resolve the promise until the
      // index is ready.
      waitUntilReady: true,
    });

    return NextResponse.json(
      { message: 'Index created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating index:', error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
