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
    
    // Add detailed logging for the content field
    console.log("Campaign response status:", response.status);
    
    if (data && data.content) {
      console.log("Content field type:", typeof data.content);
      
      if (typeof data.content === 'object') {
        console.log("Content object keys:", Object.keys(data.content));
        
        // Log specific content fields that might exist
        if (data.content.html) {
          console.log("HTML content exists, length:", data.content.html.length);
          console.log("HTML preview:", data.content.html.substring(0, 100) + "...");
        }
        
        if (data.content.body) {
          console.log("Body content exists, length:", data.content.body.length);
          console.log("Body preview:", data.content.body.substring(0, 100) + "...");
        }
        
        if (data.content.text) {
          console.log("Text content exists, length:", data.content.text.length);
          console.log("Text preview:", data.content.text.substring(0, 100) + "...");
        }
      } else if (typeof data.content === 'string') {
        console.log("Content is a string, length:", data.content.length);
        console.log("Content preview:", data.content.substring(0, 100) + "...");
      }
    } else {
      console.log("No content field found in response");
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