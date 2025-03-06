"use server"

import { databases } from "@/data/databases"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function askQuestion(question: string) {
  try {
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
      prompt: question,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return { success: true, message: response.text }
  } catch (error) {
    console.error("Error asking question:", error)
    return {
      success: false,
      message: "Sorry, I couldn't process your question. Please try again.",
    }
  }
} 