import { NextResponse } from 'next/server'
import { auth } from '../../../../../auth'

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
    const { subject, html } = await request.json()

    if (!subject || !html) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get Email Octopus API key from environment variables
    const apiKey = process.env.EMAIL_OCTOPUS_API_KEY
    const listId = process.env.EMAIL_OCTOPUS_LIST_ID
    
    if (!apiKey || !listId) {
      return NextResponse.json(
        { error: 'Email Octopus API key or List ID not configured' },
        { status: 500 }
      )
    }

    // Build the URL for the v1.6 API
    const apiUrl = `https://emailoctopus.com/api/1.6/campaigns`
    console.log("Creating campaign at:", apiUrl.replace(/api_key=([^&]+)/, 'api_key=****'));

    // Create campaign in Email Octopus using v1.6 API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        list_id: listId,
        subject,
        content: {
          html
        },
        from: {
          name: process.env.EMAIL_FROM_NAME || 'Modern Coding',
          email_address: process.env.EMAIL_FROM || 'newsletter@moderncoding.com'
        }
      }),
    })

    // Log the HTTP status for debugging
    console.log("EmailOctopus API status:", response.status, response.statusText);

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || data.detail || data.title || 'Failed to create campaign' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error creating campaign:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 