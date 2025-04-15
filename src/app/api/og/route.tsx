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
    const requestUrl = request.url;
    // Decode HTML entities in the URL (convert &amp; to &)
    const decodedUrl = requestUrl.replace(/&amp;/g, '&');
    const { searchParams } = new URL(decodedUrl);

    // Extract the slug parameter and title for fallback
    const slug = searchParams.get('slug');
    const title = searchParams.get('title') || 'Modern Coding';
    
    console.log('OG route - looking for static image for slug:', slug);
    
    // Special debug check for vercel-ai-sdk
    if (slug === 'vercel-ai-sdk' || (title && title.includes('Vercel AI SDK'))) {
      console.log('🔍 Special handling for vercel-ai-sdk detected');
      
      // Direct hardcoded path check for this specific file
      const specificPath = path.join(process.cwd(), 'public', 'og-images', 'vercel-ai-sdk.png');
      console.log(`Checking for file at ${specificPath}, exists: ${fs.existsSync(specificPath)}`);
      
      if (fs.existsSync(specificPath)) {
        try {
          console.log('✅ Found the vercel-ai-sdk.png file directly');
          const imageData = await readFile(specificPath);
          return new Response(imageData, {
            headers: {
              'Content-Type': 'image/png',
              'Cache-Control': 'public, max-age=86400, immutable',
            },
          });
        } catch (error) {
          console.error('Error reading vercel-ai-sdk.png:', error);
        }
      }
    }
    
    // STEP 1: DIRECT STATIC FILE LOOKUP
    // Check for a pre-generated OG image using slug
    if (slug) {
      // Extract the final part of the slug (e.g., "walking-and-talking-with-ai" from "/blog/walking-and-talking-with-ai")
      const slugParts = slug.split('/');
      const lastSlugPart = slugParts[slugParts.length - 1];
      
      // Absolute path to the OG image
      const ogImagePath = path.join(process.cwd(), 'public', 'og-images', `${lastSlugPart}.png`);
      
      // Check if the static file exists
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
    }
    
    // STEP 2: TITLE-BASED LOOKUP
    // Try to find a file based on the title if slug doesn't work
    if (title && (!slug || slug === '')) {
      const titleSlug = title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .replace(/-+/g, '-');
        
      const ogImagePath = path.join(process.cwd(), 'public', 'og-images', `${titleSlug}.png`);
      
      if (fs.existsSync(ogImagePath)) {
        console.log(`✅ Found title-based static OG image for: ${titleSlug}`);
        const imageData = await readFile(ogImagePath);
        
        return new Response(imageData, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, immutable',
          },
        });
      }
    }
    
    // STEP 3: REDIRECT TO GENERATOR
    // If we couldn't find a static image, redirect to the generator API
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
