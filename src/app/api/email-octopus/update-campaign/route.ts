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
    console.log("Updating campaign at:", apiUrl);

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

    console.log("Update payload structure:", JSON.stringify({
      ...payload,
      api_key: "REDACTED"
    }));

    // Update campaign in Email Octopus using v1.6 API
    // NOTE: For v1.6 API, we're using POST instead of PUT
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    // Log the HTTP status for debugging
    console.log("EmailOctopus API status:", response.status, response.statusText);

    // Check if the response is JSON or HTML (error response)
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle HTML error response
      const textResponse = await response.text();
      console.error("Received non-JSON response:", textResponse.substring(0, 200) + '...');
      
      data = { 
        error: { 
          message: `Received non-JSON response with status ${response.status}` 
        } 
      };
    }

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