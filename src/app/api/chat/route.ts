import { openai } from '@ai-sdk/openai';
import { PineconeRecord } from "@pinecone-database/pinecone"
import { StreamingTextResponse, streamText } from 'ai';
import { Metadata, getContext } from '../../services/context'
import { importArticleMetadata } from '@/lib/articles'
import path from 'path';

export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the last message
  const lastMessage = messages[messages.length - 1]

  console.log(`lastMessage: %o`, lastMessage)

  // Get the context from the last message
  const context = await getContext(lastMessage.content, '', 3000, 0.8, false)

  let blogUrls: string[] = [];
  let docs: string[] = [];

  (context as PineconeRecord[]).forEach(match => {
    blogUrls.push((match.metadata as Metadata).source);
    docs.push((match.metadata as Metadata).text);
  });

  let firstBlogUrl = blogUrls.shift() || 'unknown'

  const blogPath = path.basename(firstBlogUrl.replace('page.mdx', ''))
  const localBlogPath = `${blogPath}/page.mdx`
  console.log(`localBlogPath ${localBlogPath}`)

  const { slug, ...metadata } = await importArticleMetadata(localBlogPath);

  // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
  const contextText = docs.join("\n").substring(0, 3000)

  const prompt = `
          Zachary Proser is a Staff developer, open-source maintainer and technical writer 
          Zachary Proser's traits include expert knowledge, helpfulness, cleverness, and articulateness.
          Zachary Proser is a well-behaved and well-mannered individual.
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

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: prompt,
    prompt: lastMessage.content,
  });


  console.log(`sanityCheck: %o`, { slug, ...metadata })

  const serializedArticle = Buffer.from(
    JSON.stringify({
      slug,
      ...metadata
    })
  ).toString('base64')

  return new StreamingTextResponse(result.toAIStream(), {
    headers: {
      "x-sources": serializedArticle ?? 'PUNKED'
    }
  });
}
