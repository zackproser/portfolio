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
    const { campaignId, newSubject } = await request.json()

    if (!campaignId) {
      return NextResponse.json(
        { error: 'Missing campaign ID' },
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

    // Step 1: Fetch the original campaign
    const fetchUrl = `https://emailoctopus.com/api/1.6/campaigns/${campaignId}?api_key=${apiKey}`
    console.log("Fetching original campaign from:", fetchUrl.replace(apiKey, apiKey.substring(0, 4) + '...'));

    const fetchResponse = await fetch(fetchUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!fetchResponse.ok) {
      const errorData = await fetchResponse.json()
      return NextResponse.json(
        { error: errorData.error?.message || 'Failed to fetch original campaign' },
        { status: fetchResponse.status }
      )
    }

    const originalCampaign = await fetchResponse.json()

    // Step 2: Create a new campaign with the same content
    const createUrl = `https://emailoctopus.com/api/1.6/campaigns`
    console.log("Creating duplicate campaign at:", createUrl);

    // Use the provided subject or create one
    const subject = newSubject || `Copy of: ${originalCampaign.subject}`

    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        list_id: listId,
        subject,
        content: originalCampaign.content,
        from: originalCampaign.from
      }),
    })

    // Log the HTTP status for debugging
    console.log("EmailOctopus API create status:", createResponse.status, createResponse.statusText);

    // Handle non-JSON responses
    let data;
    const contentType = createResponse.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await createResponse.json();
    } else {
      // Handle HTML or other non-JSON responses
      const textResponse = await createResponse.text();
      console.error("Non-JSON response:", textResponse.substring(0, 200) + "...");
      
      data = { 
        error: { 
          message: `Received non-JSON response with status ${createResponse.status}` 
        } 
      };
    }

    if (!createResponse.ok) {
      return NextResponse.json(
        { error: data.error?.message || data.detail || data.title || 'Failed to duplicate campaign' },
        { status: createResponse.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error duplicating campaign:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 