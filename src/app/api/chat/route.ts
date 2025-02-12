import { Configuration, OpenAIApi } from 'openai-edge';
import { importArticleMetadata } from '@/lib/articles';
import path from 'path';
import { Article } from '@/lib/shared-types';

// Allow this serverless function to run for up to 5 minutes
export const maxDuration = 300;

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(config);

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Get the last message
  const lastMessage = messages[messages.length - 1];

  // Get the article slug from the last message
  const articleSlug = lastMessage.content.match(/article_slug: (.*)/)?.[1];

  let article: Article | null = null;
  if (articleSlug) {
    try {
      article = await importArticleMetadata(articleSlug);
    } catch (error) {
      console.error('Error loading article:', error);
    }
  }

  // Create the messages array with the system prompt and article context
  const systemPrompt = `You are a helpful AI assistant that helps users understand articles about software development, AI, and technology.
${article ? `You are currently discussing the article "${article.title}" by ${article.author}.` : ''}
Please provide accurate, technical responses while keeping explanations clear and accessible.
If you don't know something, say so rather than making assumptions.
When discussing code, use markdown formatting for code blocks.`;

  const prompt = [
    { role: 'system', content: systemPrompt },
    ...messages
  ];

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    stream: true,
    messages: prompt,
    temperature: 0.7,
    max_tokens: 2000
  });

  // Return the response as a stream
  return new Response(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
