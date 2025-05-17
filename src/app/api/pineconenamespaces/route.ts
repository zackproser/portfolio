import { NextRequest, NextResponse } from 'next/server';
import { Pinecone } from '@pinecone-database/pinecone';
import { getEmbeddings } from '@/app/services/embeddings';
import { getMatchesFromEmbeddings } from '@/app/services/pinecone';

const indexName = process.env.PINECONE_INDEX || 'vector-database-demo';

const getNamespace = (pc: Pinecone, namespace: string) => {
  return pc.index(indexName).namespace(namespace);
};

export async function POST(req: NextRequest) {
  const { namespace, vectorsToUpsert } = await req.json();
  if (!namespace || !Array.isArray(vectorsToUpsert)) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
  const ns = getNamespace(pc, namespace);
  await ns.upsert(
    vectorsToUpsert.map((v: any, i: number) => ({
      id: `vec-${Date.now()}-${i}`,
      values: v.vectors,
      metadata: v.metadata || {},
    }))
  );
  return NextResponse.json({ message: 'Vectors upserted' }, { status: 200 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const namespace = searchParams.get('namespace') || '';
  const query = searchParams.get('query') || '';
  const topK = Number(searchParams.get('topK') || '5');
  if (!query) return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  const embeddings = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(embeddings, topK, namespace);
  return NextResponse.json({ matches }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const { namespace } = await req.json();
  if (!namespace) return NextResponse.json({ error: 'Missing namespace' }, { status: 400 });
  const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY as string });
  const ns = getNamespace(pc, namespace);
  await ns.deleteAll();
  return NextResponse.json({ message: 'Namespace deleted' }, { status: 200 });
}
