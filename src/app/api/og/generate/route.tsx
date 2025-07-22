import { NextRequest } from 'next/server';
import { ImageResponse } from 'next/og';

// Use Edge runtime for ImageResponse
export const runtime = 'edge';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== OG GENERATE ROUTE START ===');
    console.log('Generate request object type:', typeof request);
    console.log('Generate request URL:', request.url);
    console.log('Generate request headers:', request.headers);
    
    const { searchParams } = new URL(request.url);
    
    // Extract parameters
    const title = searchParams.get('title') || 'Modern Coding';
    const description = searchParams.get('description') || 'AI Engineering Mastery for Teams That Ship';
    
    // Decode URL-encoded parameters
    const decodedTitle = decodeURIComponent(title);
    const decodedDescription = decodeURIComponent(description);
    
    console.log('Generating OG image for:', { title: decodedTitle, description: decodedDescription });
    
    console.log('About to create ImageResponse...');
    // Create a simple OG image
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            backgroundColor: '#1f4898',
            padding: '40px',
            color: 'white',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
            {decodedTitle}
          </div>
          <div style={{ fontSize: '24px', opacity: 0.8 }}>
            {decodedDescription}
          </div>
          <div style={{ 
            position: 'absolute', 
            bottom: '40px', 
            left: '40px', 
            fontSize: '20px',
            opacity: 0.7 
          }}>
            zackproser.com
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error: any) {
    console.log('=== OG GENERATE ROUTE ERROR ===');
    console.log('Generate error type:', typeof error);
    console.log('Generate error message:', error.message);
    console.log('Generate error stack:', error.stack);
    console.log('Generate error name:', error.name);
    console.log('Generate error constructor:', error.constructor.name);
    console.log('Full generate error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    console.error('OG image generation error:', error);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
} 