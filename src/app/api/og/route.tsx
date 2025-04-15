import { NextRequest } from 'next/server';
import { ImageResponse } from '@vercel/og';
import { join } from 'path';
import { readFile } from 'fs/promises';
import React from 'react';
import fs from 'fs';
import path from 'path';

export const maxDuration = 300;

// Set to be as fast as possible - only fetch static files
export const dynamic = 'force-dynamic'; // Allow dynamic parameters

export async function GET(request: NextRequest) {
  try {
    // Parse the URL directly from request.url
    const { searchParams } = new URL(request.url);

    // Extract the slug parameter and title for fallback
    const slug = searchParams.get('slug');
    const title = searchParams.get('title') || 'Modern Coding';
    
    console.log('OG route - looking for static image for slug:', slug);
    
    // Check for a pre-generated OG image using slug
    if (slug) {
      // Extract the final part of the slug (e.g., "walking-and-talking-with-ai" from "/blog/walking-and-talking-with-ai")
      const slugParts = slug.split('/');
      const lastSlugPart = slugParts[slugParts.length - 1];
      const ogImagePath = join(process.cwd(), 'public', 'og-images', `${lastSlugPart}.png`);
      
      console.log(`Looking for static OG image at: ${ogImagePath}`);
      
      if (fs.existsSync(ogImagePath)) {
        console.log(`✅ Found static OG image for: ${lastSlugPart}`);
        const imageData = await readFile(ogImagePath);
        
        return new Response(imageData, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, immutable', // Cache for 24 hours
          },
        });
      }
      
      // Try to find a file with similar name if exact match wasn't found
      const ogImageDir = join(process.cwd(), 'public', 'og-images');
      if (fs.existsSync(ogImageDir)) {
        const files = fs.readdirSync(ogImageDir);
        const matchingFile = files.find(file => 
          file.startsWith(`${lastSlugPart}.`) || 
          file.startsWith(`${lastSlugPart}-`)
        );
        
        if (matchingFile) {
          console.log(`✅ Found matching OG image: ${matchingFile}`);
          const imageData = await readFile(join(ogImageDir, matchingFile));
          
          return new Response(imageData, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=86400, immutable', // Cache for 24 hours
            },
          });
        }
      }
    }
    
    // If we couldn't find a static image, redirect to the generator API
    // We'll preserve all original query parameters
    const redirectParams = new URLSearchParams();
    
    // Copy all parameters to the new params object
    for (const [key, value] of searchParams.entries()) {
      redirectParams.set(key, value);
    }
    
    const generateUrl = `/api/og/generate?${redirectParams.toString()}`;
    
    console.log(`🔄 No static image found, redirecting to generator: ${generateUrl}`);
    
    return Response.redirect(new URL(generateUrl, request.url));
  } catch (error: any) {
    console.error(`OG route error:`, error);
    return new Response(`Error: ${error.message}`, {
      status: 500,
    });
  }
}
