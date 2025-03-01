import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { PineconeRecord } from "@pinecone-database/pinecone"
import { Metadata, getContext } from '../../services/context'
import { importContentMetadata } from '@/lib/content-handlers'
import path from 'path';
import { BlogWithSlug } from '@/types';

// Allow this serverless function to run for up to 5 minutes
export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the last message
  const lastMessage = messages[messages.length - 1]

  console.log(`lastMessage: %o`, lastMessage)

  // Get the context from the last message
  const context = await getContext(lastMessage.content, '', 3000, 0.35, false)

  // Create a new set for blog urls
  let blogUrls = new Set<string>()

  let docs: string[] = [];

  (context as PineconeRecord[]).forEach(match => {
    const source = (match.metadata as Metadata).source
    // Ensure source is a blog url, meaning it contains the path src/app/blog
    if (!source.includes('src/app/blog')) return
    blogUrls.add((match.metadata as Metadata).source);
    docs.push((match.metadata as Metadata).text);
  });

  let relatedBlogPosts: BlogWithSlug[] = []

  // Loop through all the blog urls and get the metadata for each
  for (const blogUrl of blogUrls) {
    const blogPath = path.basename(blogUrl.replace('page.mdx', ''))
    const metadata = await importContentMetadata(blogPath, 'blog');
    
    if (metadata) {
      relatedBlogPosts.push({ ...metadata });
    }
  }
  // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
  const contextText = docs.join("\n").substring(0, 3000)

  const prompt = `
          Zachary Proser is a Staff developer, open - source maintainer and technical writer 
          Zachary Proser's traits include expert knowledge, helpfulness, cleverness, and articulateness.
          Zachary Proser is a well - behaved and well - mannered individual.
          Zachary Proser is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
          Zachary Proser is a Staff Developer Advocate at Pinecone.io, the leader in vector storage.
          Zachary Proser builds and maintains open source applications, Jupyter Notebooks, and distributed systems in AWS
          START CONTEXT BLOCK
          ${contextText}
          END OF CONTEXT BLOCK
          Zachary will take into account any CONTEXT BLOCK that is provided in a conversation.
          If the context does not provide the answer to question, Zachary will say, "I'm sorry, but I don't know the answer to that question".
          Zachary will not apologize for previous responses, but instead will indicated new information was gained.
          Zachary will not invent anything that is not drawn directly from the context.
          Zachary will not engage in any defamatory, overly negative, controversial, political or potentially offense conversations.
`;

  const result = streamText({
    model: openai.chat('gpt-4o'),
    system: prompt,
    prompt: lastMessage.content,
  });

  const serializedArticles = Buffer.from(
    JSON.stringify(relatedBlogPosts)
  ).toString('base64')

  return result.toDataStreamResponse({
    headers: {
      'x-sources': serializedArticles
    }
  });
}
