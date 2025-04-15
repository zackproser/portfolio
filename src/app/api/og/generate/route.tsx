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
    const decodedUrl = requestUrl.replace(/&amp;/g, '&');
    const { searchParams } = new URL(decodedUrl);

    // Check if this is a debug request
    const debug = searchParams.get('debug') === 'true';
    
    // Extract query parameters
    const title = searchParams.get('title') || 'AI Engineering Mastery for Teams That Ship';
    const description = searchParams.get('description') || 'Modern development techniques, AI tools, projects, videos, tutorials and more';
    const imageSrc = searchParams.get('imageSrc')?.replace(/^"|"$/g, ''); // Remove surrounding quotes
    
    console.log('-----OG IMAGE GENERATOR-----');
    console.log('Generating OG image with:');
    console.log('Title:', title);
    console.log('Description:', description?.substring(0, 50) + '...');
    console.log('Image Src:', imageSrc);
    
    // Special debug endpoint to see what's happening
    if (debug) {
      // Collect all search params
      const params: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      // List image directory contents
      const imageDir = join(process.cwd(), 'src', 'images');
      let imageFiles: string[] = [];
      
      if (fs.existsSync(imageDir)) {
        imageFiles = fs.readdirSync(imageDir).slice(0, 20);
      }
      
      return new Response(JSON.stringify({
        requestUrl,
        params,
        imageDir,
        imageFiles,
        imageSrcProvided: !!imageSrc
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Process image
    let imageData;
    let base64Image;
    
    try {
      let rawImageData;
      
      // If we have a direct image src from Next.js
      if (imageSrc) {
        // Extract just the base filename without any path or hash
        let baseFilename = '';
        
        if (imageSrc.includes('/_next/static/media/')) {
          // This is a Next.js optimized image path like "/_next/static/media/pair-coding-with-ai.123abc.webp"
          // We just want "pair-coding-with-ai"
          const filename = path.basename(imageSrc); // Get "pair-coding-with-ai.123abc.webp"
          // Remove hash from filename (like .95561f3f)
          baseFilename = filename.split('.')[0].replace(/\.[a-f0-9]+$/, ''); 
        } else {
          // Direct string path, just use as is
          baseFilename = path.basename(imageSrc).split('.')[0];
        }
        
        console.log('Extracted base filename:', baseFilename);
        
        // Now look for any file with this name in src/images directory
        const imageDir = join(process.cwd(), 'src', 'images');
        
        if (fs.existsSync(imageDir)) {
          // Get all files recursively including in subdirectories
          const getAllFiles = (dir: string, fileList: string[] = []): string[] => {
            const files = fs.readdirSync(dir);
            
            files.forEach(file => {
              const filePath = path.join(dir, file);
              if (fs.statSync(filePath).isDirectory()) {
                fileList = getAllFiles(filePath, fileList);
              } else {
                // Store relative path from imageDir
                const relativePath = path.relative(imageDir, filePath);
                fileList.push(relativePath);
              }
            });
            
            return fileList;
          };
          
          const allFiles = getAllFiles(imageDir);
          console.log('Found', allFiles.length, 'files in images directory');
          
          // Look for an exact match by basename first
          const exactMatch = allFiles.find(file => path.basename(file) === `${baseFilename}.webp`);
          if (exactMatch) {
            console.log('Found exact match by basename:', exactMatch);
            const imagePath = join(imageDir, exactMatch);
            rawImageData = await readFile(imagePath);
          }
          // Then look for matches containing the basename
          else {
            const match = allFiles.find(file => path.basename(file).startsWith(`${baseFilename}.`));
            if (match) {
              console.log('Found match starting with base name:', match);
              const imagePath = join(imageDir, match);
              rawImageData = await readFile(imagePath);
            } 
            // Finally, try to find a match considering the full path
            else {
              const fullPathMatch = allFiles.find(file => file.includes(`/${baseFilename}.`) || file === `${baseFilename}.webp`);
              if (fullPathMatch) {
                console.log('Found match in full path:', fullPathMatch);
                const imagePath = join(imageDir, fullPathMatch);
                rawImageData = await readFile(imagePath);
              } else {
                console.log('No matching file found for base name:', baseFilename);
                console.log('First 5 files in directory:', allFiles.slice(0, 5));
              }
            }
          }
        } else {
          console.log('Image directory does not exist:', imageDir);
        }
      }
      
      // Fallback to default if no image was found
      if (!rawImageData) {
        console.log('No image found, using default');
        const defaultPath = join(process.cwd(), 'public', 'modern-coding-og-background.png');
        if (fs.existsSync(defaultPath)) {
          rawImageData = await readFile(defaultPath);
        } else {
          return new Response('Default image not found', { status: 500 });
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
      }
    );
  } catch (error: any) {
    console.error(`OG image generation error:`, error);
    return new Response(`Failed to generate image: ${error.message}`, {
      status: 500,
    });
  }
} 