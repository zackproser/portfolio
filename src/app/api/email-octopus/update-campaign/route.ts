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
    const { campaignId, subject, html } = await request.json()

    if (!campaignId || (!subject && !html)) {
      return NextResponse.json(
        { error: 'Missing required fields (campaignId and either subject or html)' },
        { status: 400 }
      )
    }

    // Get Email Octopus API key from environment variables
    const apiKey = process.env.EMAIL_OCTOPUS_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Email Octopus API key not configured' },
        { status: 500 }
      )
    }

    // Build the URL for the v1.6 API
    const apiUrl = `https://emailoctopus.com/api/1.6/campaigns/${campaignId}`
    console.log("Updating campaign at:", apiUrl.replace(/api_key=([^&]+)/, 'api_key=****'));

    // Prepare the update payload
    const payload: Record<string, any> = {
      api_key: apiKey
    }

    // Add optional fields if provided
    if (subject) {
      payload.subject = subject
    }

    if (html) {
      payload.content = {
        html
      }
    }

    // Update campaign in Email Octopus using v1.6 API
    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    // Log the HTTP status for debugging
    console.log("EmailOctopus API status:", response.status, response.statusText);

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || data.detail || data.title || 'Failed to update campaign' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error updating campaign:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 