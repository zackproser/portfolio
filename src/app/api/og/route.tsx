import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { join } from 'path';
import { readFile, readdir } from 'fs/promises';
import React from 'react';
import sharp from 'sharp';

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  try {
    // Parse the URL directly from request.url
    const requestUrl = request.url;
    // Replace HTML entities with actual characters
    const cleanUrl = requestUrl.replace(/&amp;/g, '&');
    
    const { searchParams } = new URL(cleanUrl);
    
    const title = searchParams.get('title') || 'AI Engineering Mastery for Teams That Ship';
    const description = searchParams.get('description') || 'Modern development techniques, AI tools, projects, videos, tutorials and more';
    const heroImage = searchParams.get('heroImage');

    console.log('-----OG IMAGE DEBUG-----');
    console.log('Request URL:', requestUrl);
    console.log('Cleaned URL:', cleanUrl);
    console.log('Parsed heroImage param:', heroImage);
    
    // If heroImage includes a hash, strip it to match the actual filename
    let imageFilename = heroImage;
    if (heroImage && heroImage.includes('.')) {
      // Match the base name without the hash, like "walking-talking-ai" from "walking-talking-ai.cf7f5fd4.webp"
      const match = heroImage.match(/^(.+?)(?:\.[a-f0-9]{8})?(\.\w+)$/);
      if (match) {
        imageFilename = match[1] + match[2]; // base name + extension
        console.log('Extracted base filename:', imageFilename);
      }
    }

    let imageData;
    let base64Image; // Declare at function scope
    try {
      let rawImageData;
      if (imageFilename) {
        // Direct path from images directory
        const imagePath = join(process.cwd(), 'src', 'images', imageFilename);
        console.log('Attempting to load image from:', imagePath);
        
        try {
          rawImageData = await readFile(imagePath);
          console.log('✅ Successfully loaded image:', imageFilename);
        } catch (error: any) {
          console.error('❌ Failed to load image:', imagePath, error.code);
          
          // Fall back to default
          console.log('Falling back to default image');
          const defaultPath = join(process.cwd(), 'public', 'modern-coding-og-background.png');
          rawImageData = await readFile(defaultPath);
        }
      } else {
        console.log('No heroImage provided, using default');
        const defaultPath = join(process.cwd(), 'public', 'modern-coding-og-background.png');
        rawImageData = await readFile(defaultPath);
      }

      // Convert any image format (including WebP) to PNG
      console.log('Converting image to PNG...');
      imageData = await sharp(rawImageData)
        .png()
        .toBuffer();
      console.log('✅ Successfully converted image to PNG');
      console.log('Image buffer size:', imageData.length, 'bytes');
      
      // Create base64 encoding directly
      base64Image = imageData.toString('base64');
      console.log('Base64 image length:', base64Image.length);
      
    } catch (error: any) {
      console.error('Error in image processing:', error);
      return new Response(`Failed to load/convert image: ${error.message}`, { status: 500 });
    }

    console.log('imageData', imageData);

    // Image dimensions - explicit values prevent 'image size cannot be determined' errors
    const imageWidth = 600;
    const imageHeight = 600;

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
              linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px, 100px 100px',
            zIndex: Number(1),
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
            zIndex: Number(2),
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
              linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              radial-gradient(circle at 40px 40px, rgba(120, 180, 255, 0.15) 6px, transparent 8px),
              radial-gradient(circle at 120px 120px, rgba(120, 180, 255, 0.15) 6px, transparent 8px)
            `,
            backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px, 200px 200px, 200px 200px',
            padding: '24px',
            zIndex: Number(3),
            boxShadow: 'inset 0 0 0 2px rgba(255, 255, 255, 0.4)', // Inner white line
            display: 'flex',
          }}>
            {/* Main layout - side by side containers */}
            <div style={{ 
              display: 'flex', 
              height: '100%', 
              width: '100%', 
              position: 'relative', 
              zIndex: Number(5)
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
                zIndex: Number(10)
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
                    Modern Coding
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
                        {description}
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
                      🔥 AI Engineering Mastery 
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
                zIndex: Number(5)
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
        height: 630
      }
    );
  } catch (error: any) {
    console.log(`OG image error: ${error.message}`);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
}
