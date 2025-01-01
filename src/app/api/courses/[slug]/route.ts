import { NextResponse } from 'next/server'
import { sql } from '@vercel/postgres'

export async function GET(request: Request, props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  try {
    const { rows } = await sql`
      SELECT title, description, slug, status
      FROM courses
      WHERE slug = ${slug}
    `

    if (!rows.length) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    )
  }
} 