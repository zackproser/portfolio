// Helper function to fetch metadata from a URL
export async function fetchMetadata(url: string) {
  try {
    if (!url) {
      throw new Error('URL is required')
    }

    // Validate URL format
    try {
      new URL(url)
    } catch (error) {
      throw new Error('Invalid URL format')
    }

    // Call the API route to fetch metadata
    const response = await fetch('/api/fetch-metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to fetch metadata')
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching metadata:', error)
    throw error
  }
} 