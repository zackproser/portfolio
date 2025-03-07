import { streamText, generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getDatabases } from '@/lib/getDatabases';
import { sendFreeChaptersEmail } from '@/lib/postmark';
import { tool } from 'ai';
import { z } from 'zod';
import { LeadAnalysis } from '@/types';

// Allow this serverless function to run for up to 5 minutes
export const maxDuration = 300;

interface Message {
  role: string;
  content: string;
}

// Define tools for the AI to use
const tools = {
  analyzePotentialLead: tool({
    description: 'Analyze if the conversation indicates a potential lead',
    parameters: z.object({
      messages: z.array(z.object({
        role: z.string(),
        content: z.string()
      })).describe('The conversation messages to analyze')
    }),
    execute: async ({ messages }) => {
      // Use generateText for the analysis
      const { text } = await generateText({
        model: openai('gpt-4-turbo-preview'),
        messages: [
          {
            role: "system",
            content: `You are a lead qualification expert. Analyze the conversation to determine if the user shows signs of being a potential client for vector database consulting or implementation services. Consider factors like:
1. Technical sophistication of their questions
2. Indication of real project needs
3. Signs of decision-making authority
4. Urgency or timeline mentions
5. Budget discussions or enterprise context

Respond with a JSON object containing:
{
  "isPotentialLead": boolean,
  "confidence": number (0-1),
  "reasons": string[],
  "topics": string[],
  "nextSteps": string[]
}`
          },
          {
            role: "user",
            content: messages.map(m => `${m.role}: ${m.content}`).join('\n')
          }
        ],
        temperature: 0,
        format: 'json'
      });

      const result = JSON.parse(text) as LeadAnalysis;
      
      // If high confidence lead, send notification
      if (result.isPotentialLead && result.confidence > 0.7) {
        try {
          await sendFreeChaptersEmail({
            To: process.env.NOTIFICATION_EMAIL || '',
            ProductName: 'Vector Database Consultation',
            ProductSlug: 'vector-database-consultation',
            ChapterLinks: result.nextSteps.map(step => ({
              title: step,
              url: '#'
            }))
          });
        } catch (error) {
          console.error('Failed to send lead notification:', error);
        }
      }

      return result;
    }
  })
};

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // Get fresh database data
  const databases = getDatabases();

  // Ensure databases exists and has data
  if (!databases || !Array.isArray(databases) || databases.length === 0) {
    return new Response('Database information not available', { status: 500 });
  }

  // Convert databases to a structured format for the LLM
  const databasesContext = databases.map(db => `
Database: ${db.name}
Company Information:
- Company Name: ${db.company.name}
- Founded: ${db.company.founded}
- Funding: ${db.company.funding}
- Employees: ${db.company.employees}

Description: ${db.description}

Core Features:
${Object.entries(db.features)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Performance Metrics:
${Object.entries(db.performance)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

AI & ML Capabilities:
${Object.entries(db.aiCapabilities.features)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}
`).join('\n---\n');

  const prompt = `
You are an expert AI assistant specializing in vector databases. You have detailed knowledge about vector databases based on the following up-to-date information:

START CONTEXT BLOCK
${databasesContext}
END OF CONTEXT BLOCK

When answering questions:
1. Use ONLY the information provided in the context block
2. If you can't answer based on the context, say "I don't have enough information to answer that accurately"
3. When comparing databases, cite specific metrics and features from the context
4. Format responses clearly with bullet points or sections when appropriate
5. Highlight key trade-offs between different databases when relevant
6. Use technical accuracy but explain concepts in an approachable way

Remember: You're helping users understand and compare vector databases based on real, current data.`;

  const result = streamText({
    model: openai('gpt-4-turbo-preview'),
    system: prompt,
    prompt: lastMessage.content,
    tools,
    maxSteps: 3,
  });

  return result.toDataStreamResponse();
} 