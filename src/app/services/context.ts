import type { PineconeRecord } from "@pinecone-database/pinecone";
import { getEmbeddings } from './embeddings';
import { getMatchesFromEmbeddings } from "./pinecone";

export type Metadata = {
  source: string,
  text: string,
}

// The function `getContext` is used to retrieve the context of a given message
export const getContext = async (message: string, namespace: string, maxTokens = 3000, minScore = 0.7, getOnlyText = true): Promise<PineconeRecord[]> => {

  // Get the embeddings of the input message
  const embedding = await getEmbeddings(message);

  console.log(`embedding: %o`, embedding)

  // Retrieve the matches for the embeddings from the specified namespace
  const matches = await getMatchesFromEmbeddings(embedding, 10, namespace);

  console.log(`matches: %o`, matches)

  // Filter out the matches that have a score lower than the minimum score
  const qualifyingDocs = matches.filter(m => m.score && m.score > minScore);

  console.log(`qualifyingDocs: %o`, qualifyingDocs)

  return qualifyingDocs
}
