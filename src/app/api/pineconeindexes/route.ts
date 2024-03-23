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

    const pinecone = new Pinecone();

    await pinecone.createIndex({
      name,
      dimension,
      metric: 'cosine',
      spec: {
        pod: {
          environment: 'aws',
          pods: 2,
          podType: 'p1.x2',
          metadataConfig: {
            indexed: ['product_type'],
          },
        },
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
