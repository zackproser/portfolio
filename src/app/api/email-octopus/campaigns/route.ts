import { NextResponse } from 'next/server'
import { auth } from 'auth'

export async function GET(request: Request) {
  try {
    // Check if user is authenticated and authorized
    const session = await auth()
    
    if (!session || session.user?.email !== 'zackproser@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
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

    // Get campaigns from Email Octopus
    const response = await fetch(`https://emailoctopus.com/api/1.6/campaigns?api_key=${apiKey}&limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || 'Failed to retrieve campaigns' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error retrieving campaigns:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 