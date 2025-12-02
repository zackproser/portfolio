import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../../../../auth"
import fs from "fs"
import path from "path"

const ADMIN_EMAIL = "zackproser@gmail.com"
const NEWSLETTER_DIR = path.join(process.cwd(), "src/content/newsletter")

// Helper to check if user is admin
async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return session?.user?.email === ADMIN_EMAIL
}

interface ExportOptions {
  includeUnsubscribe?: boolean
  includeTracking?: boolean
  trackingPrefix?: string
}

function convertMarkdownToEmailHtml(
  content: string,
  slug: string,
  options: ExportOptions = {}
): string {
  const { includeTracking = true, trackingPrefix = "newsletter" } = options
  
  let html = content

  // Remove table of contents line
  html = html.replace(/^## Table of contents\s*$/gm, "")

  // Convert headers
  html = html.replace(
    /^#### (.+)$/gm,
    '<h4 style="margin: 20px 0 10px; font-size: 16px; font-weight: 600; color: #1e293b;">$1</h4>'
  )
  html = html.replace(
    /^### (.+)$/gm,
    '<h3 style="margin: 24px 0 12px; font-size: 18px; font-weight: 600; color: #1e293b;">$1</h3>'
  )
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 style="margin: 28px 0 14px; font-size: 22px; font-weight: 700; color: #0f172a;">$1</h2>'
  )

  // Convert bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>")

  // Convert links - wrap with click tracking
  if (includeTracking) {
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (match, text, url) => {
        // Don't track mailto links or anchors
        if (url.startsWith("mailto:") || url.startsWith("#")) {
          return `<a href="${url}" style="color: #2563eb; text-decoration: underline;">${text}</a>`
        }
        const trackingUrl = `https://zackproser.com/api/click?e={{EmailAddress}}&tag=${trackingPrefix}:${slug}&tag=clicked:link&r=${encodeURIComponent(url)}`
        return `<a href="${trackingUrl}" style="color: #2563eb; text-decoration: underline;">${text}</a>`
      }
    )
  } else {
    html = html.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" style="color: #2563eb; text-decoration: underline;">$1</a>'
    )
  }

  // Convert inline code
  html = html.replace(
    /`([^`]+)`/g,
    '<code style="background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: ui-monospace, monospace; font-size: 14px;">$1</code>'
  )

  // Convert code blocks
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre style="background: #1e293b; color: #e2e8f0; padding: 16px; border-radius: 8px; overflow-x: auto; font-family: ui-monospace, monospace; font-size: 13px; line-height: 1.5;"><code>$2</code></pre>'
  )

  // Convert bullet lists
  const listItemPattern = /^- (.+)$/gm
  html = html.replace(listItemPattern, '<li style="margin: 6px 0; line-height: 1.6;">$1</li>')

  // Wrap consecutive list items in ul
  html = html.replace(
    /(<li[^>]*>.*<\/li>\n?)+/g,
    (match) => `<ul style="margin: 16px 0; padding-left: 24px; list-style-type: disc;">${match}</ul>`
  )

  // Convert numbered lists
  const numberedListPattern = /^\d+\. (.+)$/gm
  html = html.replace(
    numberedListPattern,
    '<li style="margin: 6px 0; line-height: 1.6;">$1</li>'
  )

  // Convert blockquotes
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote style="border-left: 4px solid #e2e8f0; padding-left: 16px; margin: 16px 0; color: #64748b; font-style: italic;">$1</blockquote>'
  )

  // Convert horizontal rules
  html = html.replace(
    /^---$/gm,
    '<hr style="margin: 32px 0; border: none; border-top: 1px solid #e2e8f0;">'
  )

  // Convert paragraphs - split by double newlines and wrap non-HTML blocks
  html = html
    .split("\n\n")
    .map((block) => {
      block = block.trim()
      if (!block) return ""
      // Skip if already HTML
      if (block.startsWith("<")) return block
      // Skip empty lines after processing
      if (!block.replace(/\n/g, "").trim()) return ""
      return `<p style="margin: 16px 0; line-height: 1.7; color: #334155;">${block}</p>`
    })
    .join("\n")

  return html
}

// GET - Export newsletter as HTML for EmailOctopus
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")
    const format = searchParams.get("format") || "full" // 'full' or 'body'
    const includeTracking = searchParams.get("tracking") !== "false"

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const episodeDir = path.join(NEWSLETTER_DIR, slug)
    const metadataPath = path.join(episodeDir, "metadata.json")
    const contentPath = path.join(episodeDir, "page.mdx")

    if (!fs.existsSync(episodeDir)) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 })
    }

    const metadata = fs.existsSync(metadataPath)
      ? JSON.parse(fs.readFileSync(metadataPath, "utf-8"))
      : { title: "Untitled", date: slug }

    const content = fs.existsSync(contentPath)
      ? fs.readFileSync(contentPath, "utf-8")
      : ""

    const bodyHtml = convertMarkdownToEmailHtml(content, slug, {
      includeTracking,
    })

    if (format === "body") {
      return NextResponse.json({ html: bodyHtml })
    }

    // Full HTML with email template
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${metadata.title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body { margin: 0; padding: 0; }
    table { border-spacing: 0; }
    td { padding: 0; }
    img { border: 0; }
    @media screen and (max-width: 600px) {
      .container { width: 100% !important; padding: 16px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc;">
    <tr>
      <td align="center" style="padding: 40px 16px;">
        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px; border-bottom: 1px solid #e2e8f0;">
              <h1 style="margin: 0 0 8px; font-size: 28px; font-weight: 700; color: #0f172a; line-height: 1.3;">
                ${metadata.title}
              </h1>
              <p style="margin: 0; font-size: 14px; color: #64748b;">
                ${new Date(metadata.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })} · By ${metadata.author || "Zachary Proser"}
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px 40px;">
              ${bodyHtml}
            </td>
          </tr>
          
          <!-- CTA Section -->
          <tr>
            <td style="padding: 0 40px 32px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: linear-gradient(135deg, #059669 0%, #0d9488 100%); border-radius: 8px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 16px; font-size: 16px; font-weight: 600; color: #ffffff;">
                      Want to dive deeper into AI development?
                    </p>
                    <a href="https://zackproser.com/api/click?e={{EmailAddress}}&tag=newsletter:${slug}&tag=clicked:cta&r=${encodeURIComponent("https://zackproser.com/products")}" style="display: inline-block; padding: 12px 24px; background-color: #ffffff; color: #059669; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px;">
                      Browse My Resources
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; border-radius: 0 0 8px 8px;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #64748b; text-align: center;">
                You received this email because you subscribed to Zachary Proser's newsletter.
              </p>
              <p style="margin: 0; font-size: 13px; color: #94a3b8; text-align: center;">
                <a href="{{UnsubscribeURL}}" style="color: #94a3b8; text-decoration: underline;">Unsubscribe</a>
                · <a href="https://zackproser.com/newsletter" style="color: #94a3b8; text-decoration: underline;">View Online</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    return new NextResponse(fullHtml, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `inline; filename="newsletter-${slug}.html"`,
      },
    })
  } catch (error) {
    console.error("Error exporting newsletter:", error)
    return NextResponse.json(
      { error: "Failed to export newsletter" },
      { status: 500 }
    )
  }
}




