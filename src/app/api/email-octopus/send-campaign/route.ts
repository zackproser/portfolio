import { NextResponse } from 'next/server'
import { auth } from 'auth'

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
    const { campaignId, sendAt } = await request.json()

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Missing campaign ID' },
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

    // Create payload based on whether to send now or schedule
    const payload: Record<string, any> = {
      api_key: apiKey,
    }

    // Add scheduled time if provided
    if (sendAt) {
      payload.scheduled_for = sendAt
    }

    // Send campaign in Email Octopus
    const response = await fetch(`https://emailoctopus.com/api/1.6/campaigns/${campaignId}/actions/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to send campaign' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error sending campaign:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 