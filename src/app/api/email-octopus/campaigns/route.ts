import { NextResponse } from 'next/server'
import { auth } from '../../../../../auth'

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

    // Get query parameters for pagination
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit') || '100'
    const page = searchParams.get('page') || '1'
    
    // Build the URL for the v1.6 API with appropriate parameters
    const apiUrl = `https://emailoctopus.com/api/1.6/campaigns?api_key=${apiKey}&limit=${limit}`
    
    console.log("Fetching campaigns from:", apiUrl.replace(apiKey, apiKey.substring(0, 4) + '...'));

    // Get campaigns from Email Octopus using v1.6 API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    // Log the HTTP status for debugging
    console.log("EmailOctopus API status:", response.status, response.statusText);

    const data = await response.json()

    // Transform the v1.6 response format to match our application format
    if (response.ok && data.campaigns) {
      const transformedData = {
        data: data.campaigns.map((campaign: any) => ({
          id: campaign.id,
          subject: campaign.subject,
          status: campaign.status,
          createdAt: campaign.created_at || null,
          sentAt: campaign.sent_at || null,
          scheduledFor: campaign.scheduled_for || null,
        })),
        paging: data.paging || null
      };
      
      return NextResponse.json(transformedData);
    }

    // If there was an error, return it
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || data.detail || data.title || 'Failed to retrieve campaigns' },
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