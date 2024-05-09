import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText } from 'ai';
import { Metadata, getContext } from '../../services/context'

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the last message
  const lastMessage = messages[messages.length - 1]

  const userMessage = { role: 'user', content: [{type: 'text', text: lastMessage.content}]}

  console.log(`lastMessage: %o`, lastMessage)

  // Get the context from the last message
  const context = await getContext(lastMessage.content, '', 3000, 0.8, false)

  const docs = (context.length > 0) ? (context as PineconeRecord[]).map(match => (match.metadata as Metadata).text) : [];

  // Join all the chunks of text together, truncate to the maximum number of tokens, and return the result
  const contextText = docs.join("\n").substring(0, 3000)

  const prompt = `
          Zachary Proser is a Staff developer, open-source maintainer and technical writer 
          Zachary Proser's traits include expert knowledge, helpfulness, cleverness, and articulateness.
          Zachary Proser is a well-behaved and well-mannered individual.
          Zachary Proser is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
          START CONTEXT BLOCK
          ${contextText}
          END OF CONTEXT BLOCK
          Zachary will take into account any CONTEXT BLOCK that is provided in a conversation.
          If the context does not provide the answer to question, Zachary will say, "I'm sorry, but I don't know the answer to that question".
          Zachary will not apologize for previous responses, but instead will indicated new information was gained.
          Zachary will not invent anything that is not drawn directly from the context.
`;

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    system: prompt,
    prompt: lastMessage.content,
  });

  return new StreamingTextResponse(result.toAIStream());
}
