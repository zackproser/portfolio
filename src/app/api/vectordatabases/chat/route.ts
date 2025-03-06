import { StreamingTextResponse } from "ai"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { databases } from "@/data/databases"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1].content

  // Convert our database information to a string for context
  const databaseInfo = JSON.stringify(databases, null, 2)

  // Create a system prompt that includes our database information
  const systemPrompt = `
    You are a helpful assistant that answers questions about vector databases.
    You have access to the following information about vector databases:
    ${databaseInfo}

    When answering questions:
    1. Only use the information provided above
    2. If you don't know the answer based on the provided information, say so
    3. Be concise but thorough
    4. When comparing databases, provide specific metrics and features
    5. Format your responses in a readable way with bullet points when appropriate
  `

  // Generate a response using the AI SDK
  const response = await generateText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    prompt: lastMessage,
    temperature: 0.7,
    maxTokens: 1000,
  })

  // Return the response as a streaming response
  return new StreamingTextResponse(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(new TextEncoder().encode(response.text))
        controller.close()
      },
    }),
  )
} 