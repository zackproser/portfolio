import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../../../auth"
import fs from "fs"
import path from "path"

const ADMIN_EMAIL = "zackproser@gmail.com"
const NEWSLETTER_DIR = path.join(process.cwd(), "src/content/newsletter")

interface NewsletterMetadata {
  type: "newsletter"
  author: string
  date: string
  title: string
  description: string
  image?: string
}

interface NewsletterEpisode {
  slug: string
  metadata: NewsletterMetadata
  content?: string
}

// Helper to check if user is admin
async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return session?.user?.email === ADMIN_EMAIL
}

// GET - List all newsletter episodes
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Ensure newsletter directory exists
    if (!fs.existsSync(NEWSLETTER_DIR)) {
      fs.mkdirSync(NEWSLETTER_DIR, { recursive: true })
    }

    const directories = fs.readdirSync(NEWSLETTER_DIR).filter((item) => {
      const itemPath = path.join(NEWSLETTER_DIR, item)
      return fs.statSync(itemPath).isDirectory()
    })

    const episodes: NewsletterEpisode[] = []

    for (const dir of directories) {
      const metadataPath = path.join(NEWSLETTER_DIR, dir, "metadata.json")
      const contentPath = path.join(NEWSLETTER_DIR, dir, "page.mdx")

      if (fs.existsSync(metadataPath)) {
        try {
          const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf-8"))
          const content = fs.existsSync(contentPath)
            ? fs.readFileSync(contentPath, "utf-8")
            : ""

          episodes.push({
            slug: dir,
            metadata,
            content,
          })
        } catch (e) {
          console.error(`Failed to parse metadata for ${dir}:`, e)
        }
      }
    }

    // Sort by date, newest first
    episodes.sort((a, b) => {
      const dateA = new Date(a.metadata.date).getTime()
      const dateB = new Date(b.metadata.date).getTime()
      return dateB - dateA
    })

    return NextResponse.json({ episodes })
  } catch (error) {
    console.error("Error fetching newsletter episodes:", error)
    return NextResponse.json(
      { error: "Failed to fetch episodes" },
      { status: 500 }
    )
  }
}

// POST - Create a new newsletter episode
export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { metadata, content } = await req.json()

    if (!metadata.title || !metadata.date) {
      return NextResponse.json(
        { error: "Title and date are required" },
        { status: 400 }
      )
    }

    // Create slug from date
    const slug = metadata.date
    const episodeDir = path.join(NEWSLETTER_DIR, slug)

    // Check if directory already exists
    if (fs.existsSync(episodeDir)) {
      return NextResponse.json(
        { error: "An episode with this date already exists" },
        { status: 400 }
      )
    }

    // Create the directory
    fs.mkdirSync(episodeDir, { recursive: true })

    // Prepare metadata
    const fullMetadata: NewsletterMetadata = {
      type: "newsletter",
      author: metadata.author || "Zachary Proser",
      date: metadata.date,
      title: metadata.title,
      description: metadata.description || "",
      ...(metadata.image && { image: metadata.image }),
    }

    // Write metadata.json
    fs.writeFileSync(
      path.join(episodeDir, "metadata.json"),
      JSON.stringify(fullMetadata, null, 2)
    )

    // Write page.mdx
    fs.writeFileSync(path.join(episodeDir, "page.mdx"), content || "")

    return NextResponse.json({
      success: true,
      episode: { slug, metadata: fullMetadata, content },
    })
  } catch (error) {
    console.error("Error creating newsletter episode:", error)
    return NextResponse.json(
      { error: "Failed to create episode" },
      { status: 500 }
    )
  }
}

// PUT - Update an existing newsletter episode
export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { slug, metadata, content } = await req.json()

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const episodeDir = path.join(NEWSLETTER_DIR, slug)

    if (!fs.existsSync(episodeDir)) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 })
    }

    // Prepare metadata
    const fullMetadata: NewsletterMetadata = {
      type: "newsletter",
      author: metadata.author || "Zachary Proser",
      date: metadata.date || slug,
      title: metadata.title,
      description: metadata.description || "",
      ...(metadata.image && { image: metadata.image }),
    }

    // Write metadata.json
    fs.writeFileSync(
      path.join(episodeDir, "metadata.json"),
      JSON.stringify(fullMetadata, null, 2)
    )

    // Write page.mdx
    if (content !== undefined) {
      fs.writeFileSync(path.join(episodeDir, "page.mdx"), content)
    }

    return NextResponse.json({
      success: true,
      episode: { slug, metadata: fullMetadata, content },
    })
  } catch (error) {
    console.error("Error updating newsletter episode:", error)
    return NextResponse.json(
      { error: "Failed to update episode" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a newsletter episode
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const slug = searchParams.get("slug")

    if (!slug) {
      return NextResponse.json({ error: "Slug is required" }, { status: 400 })
    }

    const episodeDir = path.join(NEWSLETTER_DIR, slug)

    if (!fs.existsSync(episodeDir)) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 })
    }

    // Remove directory and all contents
    fs.rmSync(episodeDir, { recursive: true, force: true })

    return NextResponse.json({ success: true, slug })
  } catch (error) {
    console.error("Error deleting newsletter episode:", error)
    return NextResponse.json(
      { error: "Failed to delete episode" },
      { status: 500 }
    )
  }
}




