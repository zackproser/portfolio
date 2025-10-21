/**
 * Convert MDX/Markdown string to email-safe HTML
 *
 * Uses marked to convert markdown to HTML, stripping any JSX components
 * for email-safe content.
 */

import { marked } from 'marked'

export async function mdxToSimpleHtml(mdxContent: string): Promise<string> {
  // Strip out JSX components (anything that looks like <Component />)
  // Keep only standard markdown
  const markdownOnly = mdxContent
    .replace(/<[A-Z][^>]*\/>/g, '') // Self-closing JSX components
    .replace(/<[A-Z][^>]*>.*?<\/[A-Z][^>]*>/gs, '') // JSX components with children
    .trim()

  // Configure marked for email-safe HTML
  marked.setOptions({
    breaks: true, // Convert \n to <br>
    gfm: true, // GitHub Flavored Markdown
  })

  // Convert to HTML
  const html = await marked.parse(markdownOnly)

  return html
}
