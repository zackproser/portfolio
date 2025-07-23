import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import React from 'react';
import sharp from 'sharp';

// This route is only for generating images and won't be used in production
// Use Node.js runtime for Sharp compatibility
export const runtime = 'nodejs';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Parse the URL directly from request.url
    const requestUrl = request.url;
    // Decode HTML entities in the URL (convert &amp; to &)
    let decodedUrl = requestUrl;
    console.log('=== OG GENERATE ROUTE START ===');
    console.log('Generate request object type:', typeof request);
    console.log('Generate request URL:', request.url);
    console.log('Generate request headers:', request.headers);

    // Multiple passes to handle potentially nested encodings
    for (let i = 0; i < 3; i++) {
      decodedUrl = decodedUrl
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&#x2F;/g, '/');
    }

    console.log('Original URL:', requestUrl);
    console.log('Decoded URL:', decodedUrl);
    const { searchParams } = new URL(decodedUrl);

    // Log all parameters for debugging
    console.log('🔍 All parameters received in generator:');
    for (const [key, value] of searchParams.entries()) {
      console.log(`- ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
    }
    
    // Check if slug exists
    const slug = searchParams.get('slug');
    console.log('📌 Slug parameter:', slug);

    // Extract query parameters
    const encodedTitle = searchParams.get('title') || 'AI Engineering Mastery for Teams That Ship';
    const encodedDescription = searchParams.get('description') || 'Modern development techniques, AI tools, projects, videos, tutorials and more';
    
    // Properly decode the URL-encoded parameters, handling special characters
    const title = decodeURIComponent(encodedTitle);
    let description = '';
    
    try {
      // Handle potential double-encoding or malformed encoding
      if (encodedDescription) {
        description = decodeURIComponent(encodedDescription);
        console.log('Successfully decoded description');
      }
    } catch (e) {
      console.error('Error decoding description:', e);
      description = encodedDescription || '';
    }
    console.log('Generating OG image for:', { title, description });

    // Check for both parameter names for backward compatibility
    const imageSrc = searchParams.get('imageSrc') || searchParams.get('image');
    const finalImageSrc = imageSrc?.replace(/^"|"$/g, ''); // Remove surrounding quotes
    
    console.log('-----OG IMAGE GENERATOR-----');
    console.log('Generating OG image with:');
    console.log('Slug:', slug);
    console.log('Title:', title);
    console.log('Description:', description?.substring(0, 50) + '...');
    console.log('Image Src:', finalImageSrc);
    
    // Process image
    let imageData;
    let base64Image;
    
    try {
      let rawImageData;
      
      // If we have an image src, fetch it from CDN
      if (finalImageSrc) {
        console.log('🔗 Fetching image from CDN URL:', finalImageSrc);
        try {
          const response = await fetch(finalImageSrc);
          if (response.ok) {
            rawImageData = Buffer.from(await response.arrayBuffer());
            console.log('✅ Successfully fetched image from CDN');
          } else {
            console.error('❌ Failed to fetch image from CDN:', response.status, response.statusText);
          }
        } catch (error) {
          console.error('❌ Error fetching image from CDN:', error);
        }
      }
      
      // Fallback to default if no image was found
      if (!rawImageData) {
        console.log('No image found, using default');
        // Use the default image from Bunny CDN
        const defaultImageUrl = 'https://zackproser.b-cdn.net/modern-coding-og-background.png';
        try {
          const response = await fetch(defaultImageUrl);
          if (response.ok) {
            rawImageData = Buffer.from(await response.arrayBuffer());
            console.log('Using default image from CDN:', defaultImageUrl);
          } else {
            console.error('Default image not found at CDN URL:', defaultImageUrl);
            return new Response('Default image not found', { status: 500 });
          }
        } catch (error) {
          console.error('Error fetching default image from CDN:', error);
          return new Response('Failed to fetch default image', { status: 500 });
        }
      }

      // Convert any image format to PNG for consistency
      console.log('Converting image to PNG...');
      imageData = await sharp(rawImageData)
        .png()
        .toBuffer();
      console.log('✅ Successfully converted image to PNG');
      
      // Create base64 encoding directly
      base64Image = imageData.toString('base64');
      
    } catch (error: any) {
      console.error('Error in image processing:', error);
      return new Response(`Failed to load/convert image: ${error.message}`, { status: 500 });
    }

    // Force number type for zIndex values - removing 'px' from values
    const zIndexes = {
      background: 1,
      border: 2,
      content: 3,
      layout: 5,
      textColumn: 10,
      imageColumn: 5
    };

    // Image dimensions 
    const imageWidth = 600;
    const imageHeight = 600;

    // Generate the OG image
    console.log('About to create ImageResponse...');
    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#1f4898',
            padding: '40px',
            color: 'white',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          {/* Main background with blueprint effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#1f4898', // Lighter blue background color for the outermost border
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px',
            zIndex: zIndexes.background,
          }} />
          
          {/* Intermediary border with lighter blue */}
          <div style={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            right: '15px',
            bottom: '15px',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.6)',
            background: '#2753a9', // Lighter blue in the border area
            boxShadow: '0 0 10px rgba(255, 255, 255, 0.3)', // Subtle white glow
            zIndex: zIndexes.border,
          }} />
          
          {/* Inner content area */}
          <div style={{
            position: 'absolute',
            top: '19px',
            left: '19px',
            right: '19px',
            bottom: '19px',
            borderRadius: '5px',
            backgroundColor: '#15346e',
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px),
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px),
              radial-gradient(circle at 40px 40px, rgba(120, 180, 255, 0.15) 6px, transparent 8px),
              radial-gradient(circle at 120px 120px, rgba(120, 180, 255, 0.15) 6px, transparent 8px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px, 200px 200px, 200px 200px',
            padding: '24px',
            zIndex: zIndexes.content,
            boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.4)', // Inner white line
            display: 'flex',
          }}>
            {/* Main layout - side by side containers */}
            <div style={{ 
              display: 'flex', 
              height: '100%', 
              width: '100%', 
              position: 'relative', 
              zIndex: zIndexes.layout
            }}>
              {/* Left text column - fixed width to prevent overlap */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                width: '50%', 
                height: '100%',
                justifyContent: 'space-between',
                paddingTop: '8px',
                paddingBottom: '8px',
                paddingLeft: '8px',
                paddingRight: '12px',
                zIndex: zIndexes.textColumn
              }}>
                {/* Top text content */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}>
                  {/* Top text content */}
                  <div style={{ 
                    fontSize: '36px', 
                    fontWeight: 'bold', 
                    color: 'white', 
                    lineHeight: 1.2, 
                    marginBottom: '16px',
                    maxWidth: '100%',
                    wordWrap: 'break-word'
                  }}>
                    🔥 AI Engineering Mastery
                  </div>
                  
                  {/* Center content - title and description */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    <div style={{ 
                      fontSize: '46px', 
                      fontWeight: 'bold', 
                      color: 'white', 
                      lineHeight: 1.2, 
                      marginBottom: '24px',
                      maxWidth: '100%',
                      maxHeight: '220px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      wordWrap: 'break-word'
                    }}>
                      {title}
                    </div>
                    
                    {description && (
                      <div style={{ 
                        fontSize: '28px', 
                        color: '#dbeafe', 
                        marginBottom: '16px',
                        maxWidth: '100%',
                        maxHeight: '112px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        wordWrap: 'break-word'
                      }}>
                        {description.replace(/&apos;/g, "'").replace(/&quot;/g, '"')}
                      </div>
                    )}
                  </div>
                  
                  {/* Bottom footer area */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    maxWidth: '100%'
                  }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: 'white',
                      opacity: 0.9,
                      marginRight: '16px'
                    }}>
                      zackproser.com
                    </div>
                    <div style={{
                      fontSize: '18px',
                      color: 'white',
                      opacity: 1,
                      textAlign: 'center'
                    }}>
                      Modern Coding
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right image column - fixed width container */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '50%',
                height: '100%',
                zIndex: zIndexes.imageColumn
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                  overflow: 'hidden',
                  filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.5))',
                  padding: '5px'
                }}>
                  <img 
                    src={`data:image/png;base64,${base64Image}`}
                    alt="Page hero image"
                    width={imageWidth}
                    height={imageHeight}
                    style={{
                      width: '110%',
                      height: '110%',
                      objectFit: 'contain',
                      objectPosition: 'center',
                      filter: 'brightness(1.2) contrast(1.1)',
                      mixBlendMode: 'screen'
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
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