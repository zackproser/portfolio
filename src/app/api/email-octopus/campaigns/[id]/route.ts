import { NextResponse } from 'next/server'
import { auth } from '../../../../../../auth'

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
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

    // In Next.js 15+, we need to await params
    const params = await context.params
    const campaignId = params.id;

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Campaign ID is required' },
        { status: 400 }
      )
    }

    // Build the URL for the v1.6 API
    const apiUrl = `https://emailoctopus.com/api/1.6/campaigns/${campaignId}?api_key=${apiKey}`
    console.log("Fetching campaign from:", apiUrl.replace(apiKey, apiKey.substring(0, 4) + '...'));

    // Get campaign from Email Octopus using v1.6 API
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
    
    // Log the campaign data structure
    console.log("Campaign data structure:", {
      id: data.id, 
      subject: data.subject,
      content: data.content ? 
        typeof data.content === 'string' ? 
          'Content is a string' : 
          Object.keys(data.content).map(key => `${key}: ${typeof data.content[key]}`)
        : 'No content'
    });
    
    // Log the full content object if it exists
    if (data.content) {
      console.log("Full content object:", JSON.stringify(data.content));
    }

    // Transform v1.6 API response format to match our application format
    if (response.ok && data) {
      const transformedData = {
        id: data.id,
        subject: data.subject,
        status: data.status,
        createdAt: data.created_at || null,
        sentAt: data.sent_at || null,
        scheduledFor: data.scheduled_for || null,
        content: data.content || null
      };
      
      return NextResponse.json(transformedData);
    }

    // If there was an error, return it
    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || data.detail || data.title || 'Failed to retrieve campaign' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error retrieving campaign:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 