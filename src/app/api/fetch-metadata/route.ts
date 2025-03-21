import { NextResponse } from 'next/server'
import { auth } from '../../../../auth'
import * as cheerio from 'cheerio'

export async function POST(request: Request) {
  try {
    // Check if user is authenticated and authorized
    const session = await auth()
    
    if (!session || session.user?.email !== 'zackproser@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get request body
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.status} ${response.statusText}` },
        { status: 400 }
      )
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // Extract metadata
    const title = $('title').text() || $('meta[property="og:title"]').attr('content') || ''
    const description = $('meta[name="description"]').attr('content') || 
                       $('meta[property="og:description"]').attr('content') || ''
    const imageUrl = $('meta[property="og:image"]').attr('content') || 
                    $('meta[name="twitter:image"]').attr('content') || ''

    // Extract the domain name for favicon fallback
    const domain = new URL(url).hostname
    const favicon = $('link[rel="icon"]').attr('href') || 
                   $('link[rel="shortcut icon"]').attr('href') || 
                   `https://${domain}/favicon.ico`

    // Normalize the favicon URL if it's a relative path
    const normalizedFavicon = favicon.startsWith('http') 
      ? favicon 
      : new URL(favicon, url).toString()

    return NextResponse.json({
      url,
      title: title.trim(),
      description: description.trim(),
      image: imageUrl,
      favicon: normalizedFavicon,
    })
  } catch (error) {
    console.error('Error fetching metadata:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch metadata' },
      { status: 500 }
    )
  }
} 