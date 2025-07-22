import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { join } from 'path';
import { readFile } from 'fs/promises';
import React from 'react';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// This route is only for generating images and won't be used in production
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Parse the URL directly from request.url
    const requestUrl = request.url;
    // Decode HTML entities in the URL (convert &amp; to &)
    let decodedUrl = requestUrl;
    
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
      
      // If we have a direct image src from Next.js
      if (finalImageSrc) {
        // Extract just the base filename without any path or hash
        let baseFilename = '';
        
        console.log('Original image source:', finalImageSrc);
        
        if (finalImageSrc.includes('/_next/static/media/')) {
          // This is a Next.js optimized image path like "/_next/static/media/pair-coding-with-ai.123abc.webp"
          // We just want "pair-coding-with-ai"
          const filename = path.basename(finalImageSrc); // Get "pair-coding-with-ai.123abc.webp"
          // Remove hash from filename (like .95561f3f)
          baseFilename = filename.split('.')[0].replace(/\.[a-f0-9]+$/, ''); 
        } else {
          // Direct string path, just use as is
          const fullFilename = path.basename(finalImageSrc).split('?')[0]; // Remove any query params
          baseFilename = path.basename(fullFilename, path.extname(fullFilename));
        }
        
        console.log('Extracted base filename:', baseFilename);
        
        // Check if this is a Bunny CDN URL
        if (finalImageSrc && finalImageSrc.includes('zackproser.b-cdn.net')) {
          console.log('Image source is a Bunny CDN URL, fetching directly');
          try {
            const response = await fetch(finalImageSrc);
            if (response.ok) {
              rawImageData = await response.arrayBuffer();
              console.log('Successfully fetched image from Bunny CDN:', finalImageSrc);
            } else {
              console.log('Failed to fetch image from Bunny CDN:', finalImageSrc);
            }
          } catch (error) {
            console.log('Error fetching image from Bunny CDN:', error);
          }
        } else {
          // Fallback to local file system lookup
          const imageDir = join(process.cwd(), 'src', 'images');
          console.log('Searching for images in:', imageDir);
          
          if (fs.existsSync(imageDir)) {
            // Get all files recursively including in subdirectories
            const getAllFiles = (dir: string, fileList: string[] = []): string[] => {
              try {
                const files = fs.readdirSync(dir);
                
                files.forEach(file => {
                  const filePath = path.join(dir, file);
                  if (fs.statSync(filePath).isDirectory()) {
                    fileList = getAllFiles(filePath, fileList);
                  } else {
                    // Only include .webp files as specified
                    const ext = path.extname(file).toLowerCase();
                    if (ext === '.webp') {
                      // Store full path for easier access
                      fileList.push(filePath);
                    }
                  }
                });
              } catch (err) {
                console.log(`Error reading directory ${dir}:`, err);
              }
              
              return fileList;
            };
            
            const allFiles = getAllFiles(imageDir);
            console.log(`Found ${allFiles.length} webp files in src/images directory`);
            
            // First try exact match by basename
            const exactMatches = allFiles.filter(file => 
              path.basename(file, '.webp') === baseFilename
            );
            
            if (exactMatches.length > 0) {
              console.log(`Found ${exactMatches.length} exact matches:`, 
                exactMatches.map(f => path.basename(f)).join(', '));
              
              // Use the first exact match
              const matchFile = exactMatches[0];
              console.log('Using exact match:', matchFile);
              rawImageData = await readFile(matchFile);
            } 
            // If no exact match, try files containing the basename
            else {
              const containingMatches = allFiles.filter(file => 
                path.basename(file).includes(baseFilename)
              );
              
              if (containingMatches.length > 0) {
                console.log(`Found ${containingMatches.length} containing matches:`, 
                  containingMatches.map(f => path.basename(f)).join(', '));
                
                // Use the first containing match
                const matchFile = containingMatches[0];
                console.log('Using containing match:', matchFile);
                rawImageData = await readFile(matchFile);
              } else {
                console.log('❌ No matching image found for base name:', baseFilename);
                if (allFiles.length > 0) {
                  console.log('Sample files:', allFiles.slice(0, 5).map(f => path.basename(f)));
                }
              }
            }
          } else {
            console.log('Image directory does not exist:', imageDir);
          }
        }
      }
      
      // Fallback to default if no image was found
      if (!rawImageData) {
        console.log('No image found, using default from Bunny CDN');
        
        // Try to fetch default image from Bunny CDN
        let defaultImageUrl = 'https://zackproser.b-cdn.net/images/modern-coding-og-background.webp';
        
        try {
          const response = await fetch(defaultImageUrl);
          if (response.ok) {
            rawImageData = await response.arrayBuffer();
            console.log('Using default image from Bunny CDN:', defaultImageUrl);
          } else {
            console.error('Default image not found on Bunny CDN:', defaultImageUrl);
            return new Response('Default image not found', { status: 500 });
          }
        } catch (error) {
          console.error('Error fetching default image from Bunny CDN:', error);
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
      // Set a fallback base64Image to prevent undefined errors
      base64Image = null;
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

    // Ensure base64Image is defined
    if (!base64Image) {
      console.log('No image data available, proceeding with fallback');
    }

    // Generate the OG image
    try {
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
              linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
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
                  {base64Image ? (
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
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: 'white',
                      opacity: 0.7
                    }}>
                      Image
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
    } catch (imageError: any) {
      console.error(`ImageResponse error:`, imageError);
      // Fallback to a simple text response
      return new Response(`Failed to generate image: ${imageError.message}`, {
        status: 500,
        headers: {
          'Content-Type': 'text/plain',
        },
      });
    }
  } catch (error: any) {
    console.error(`OG image generation error:`, error);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
} 