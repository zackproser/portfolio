import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { Database } from '@/types/database';
import { databases } from '@/data/databases';

// Allow this serverless function to run for up to 5 minutes
export const maxDuration = 300;

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the last message
  const lastMessage = messages[messages.length - 1];

  console.log(`lastMessage: %o`, lastMessage);

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

Security Features:
${Object.entries(db.security)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Supported Algorithms:
${Object.entries(db.algorithms)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

Search Capabilities:
${Object.entries(db.searchCapabilities)
  .map(([key, value]) => `- ${key}: ${value}`)
  .join('\n')}

AI & ML Capabilities:
- Features:
${Object.entries(db.aiCapabilities.features)
  .map(([key, value]) => `  • ${key}: ${value}`)
  .join('\n')}
- Scores:
${Object.entries(db.aiCapabilities.scores)
  .map(([key, value]) => `  • ${key}: ${value}/10`)
  .join('\n')}
- RAG Features:
${db.aiCapabilities.ragFeatures.map(feature => `  • ${feature}`).join('\n')}
- RAG Limitations:
${db.aiCapabilities.ragLimitations.map(limitation => `  • ${limitation}`).join('\n')}
  `).join('\n---\n');

  const prompt = `
You are an expert AI assistant specializing in vector databases. You have detailed knowledge about Pinecone, Weaviate, and Milvus based on the following up-to-date information:

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
    model: openai.chat('gpt-4.5-preview'),
    system: prompt,
    prompt: lastMessage.content,
  });

  return result.toDataStreamResponse();
} 