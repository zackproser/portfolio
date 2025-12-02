import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../../../../auth"
import { getAllContent } from "@/lib/content-handlers"

const ADMIN_EMAIL = "zackproser@gmail.com"

async function isAdmin(): Promise<boolean> {
  const session = await auth()
  return session?.user?.email === ADMIN_EMAIL
}

// GET - List recent blog posts for repurposing
export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get all blog posts
    const blogPosts = await getAllContent("blog")
    
    // Sort by date (newest first) and take the most recent 50
    const sortedPosts = blogPosts
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        return dateB - dateA
      })
      .slice(0, 50)
      .map(post => ({
        slug: post.slug,
        directorySlug: post.directorySlug,
        title: post.title,
        description: post.description || "",
        date: post.date,
        type: post.type,
      }))

    return NextResponse.json({ posts: sortedPosts })
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    )
  }
}


