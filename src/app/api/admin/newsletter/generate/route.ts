import { NextRequest } from "next/server"
import { auth } from "../../../../../../auth"
import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import fs from "fs"
import path from "path"

const ADMIN_EMAIL = "zackproser@gmail.com"
const CONTENT_DIR = path.join(process.cwd(), "src/content")

async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return session?.user?.email === ADMIN_EMAIL
}

// System prompt that captures your voice and newsletter style
const NEWSLETTER_SYSTEM_PROMPT = `You are Zachary Proser, a Staff-level AI Engineer with 13+ years of experience building production systems. You write a newsletter about AI development, developer tools, and productivity.

Your writing style:
- Direct and conversational, not formal or stuffy
- Use "I" and share personal experiences
- Include specific technical details and real examples
- Be opinionated but back it up with evidence
- Use analogies to explain complex concepts
- Write in a way that's accessible to developers of all levels
- Include actionable insights, not just theory
- Be genuine and enthusiastic about tools that actually work

Newsletter format:
- Start with a compelling hook that draws readers in
- Use markdown formatting with ## for main sections
- Keep paragraphs short and scannable
- Include code examples when relevant
- End with a clear call-to-action or takeaway
- Aim for 800-1500 words

DO NOT:
- Use marketing buzzwords or hype language
- Be vague or generic
- Write in third person
- Use overly complex jargon without explanation
- Be negative or dismissive without constructive alternatives`

// POST - Generate newsletter content with AI
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    })
  }

  try {
    const { mode, topic, blogSlug, templateType } = await req.json()

    let prompt: string

    if (mode === "repurpose" && blogSlug) {
      // Load the blog post content to repurpose
      const blogContentPath = path.join(CONTENT_DIR, "blog", blogSlug, "page.mdx")
      const blogMetadataPath = path.join(CONTENT_DIR, "blog", blogSlug, "metadata.json")

      if (!fs.existsSync(blogContentPath)) {
        return new Response(JSON.stringify({ error: "Blog post not found" }), { 
          status: 404,
          headers: { "Content-Type": "application/json" }
        })
      }

      const blogContent = fs.readFileSync(blogContentPath, "utf-8")
      let blogMetadata = { title: "Unknown", description: "" }
      
      if (fs.existsSync(blogMetadataPath)) {
        try {
          blogMetadata = JSON.parse(fs.readFileSync(blogMetadataPath, "utf-8"))
        } catch (e) {
          // Use defaults
        }
      }

      prompt = `Transform this blog post into a newsletter episode. Keep the core insights but make it more conversational and personal. Add your own commentary and experiences. The newsletter should feel like you're sharing this with a friend, not just republishing the post.

Original blog post title: "${blogMetadata.title}"
Original description: "${blogMetadata.description}"

Blog post content:
---
${blogContent}
---

Create a newsletter episode based on this content. Include:
1. A catchy title (different from the original)
2. A brief description (1-2 sentences)
3. The newsletter content in markdown format

Format your response as:
TITLE: [your title here]
DESCRIPTION: [your description here]
CONTENT:
[your newsletter content here]`

    } else if (mode === "topic" && topic) {
      // Generate fresh content from a topic
      const templateGuidance = getTemplateGuidance(templateType)

      prompt = `Write a newsletter episode about: "${topic}"

${templateGuidance}

Include:
1. A compelling title
2. A brief description (1-2 sentences) 
3. The full newsletter content in markdown format

Format your response as:
TITLE: [your title here]
DESCRIPTION: [your description here]
CONTENT:
[your newsletter content here]`

    } else {
      return new Response(JSON.stringify({ error: "Invalid request. Provide either topic or blogSlug." }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      })
    }

    const result = streamText({
      model: openai("gpt-4o"),
      system: NEWSLETTER_SYSTEM_PROMPT,
      prompt: prompt,
      maxTokens: 4000,
    })

    return result.toDataStreamResponse()

  } catch (error) {
    console.error("Error generating newsletter:", error)
    return new Response(JSON.stringify({ error: "Failed to generate content" }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}

function getTemplateGuidance(templateType?: string): string {
  switch (templateType) {
    case "tool-review":
      return `Structure this as a tool review/deep-dive:
- Hook: Start with a specific moment or problem that led you to this tool
- What It Is: Brief explanation of what the tool does
- Why It Matters: The problem it solves and why developers should care
- How I Use It: Your personal workflow and integration
- Key Features: 3-5 standout capabilities with examples
- Honest Assessment: Pros, cons, and who this is best for
- Verdict: Clear recommendation with any caveats
- Call to Action: Link to try it, learn more, or share thoughts`

    case "roundup":
      return `Structure this as a curated roundup:
- Intro: Brief context on the theme or why these links matter this week
- 3-5 Curated Items: Each with:
  - Clear headline
  - 2-3 sentence summary of why it's interesting
  - Your personal take or how you might use it
- Personal Update: Brief note on what you're working on or thinking about
- Call to Action: Invite replies or shares`

    case "tutorial":
      return `Structure this as a practical tutorial:
- The Problem: What pain point or goal are we addressing?
- Solution Overview: High-level approach before diving in
- Step-by-Step Guide: Clear, numbered steps with code examples
- Tips & Gotchas: Common mistakes and how to avoid them
- Resources: Links for going deeper
- Call to Action: Encourage readers to try it and share results`

    case "opinion":
      return `Structure this as an opinion/commentary piece:
- Hot Take: Lead with your main thesis or controversial opinion
- Context: Background that explains why this matters now
- Your Perspective: Detailed argument with evidence and examples
- Counterpoints: Acknowledge other views fairly
- Implications: What this means for developers/the industry
- Call to Action: Invite discussion or alternative viewpoints`

    default:
      return `Create engaging, actionable content that provides real value to developers interested in AI tools and productivity.`
  }
}


