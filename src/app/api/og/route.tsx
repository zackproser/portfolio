import { NextRequest } from 'next/server';
import { readFile } from 'fs/promises';
import fs from 'fs';
import path from 'path';
import { ogLogger } from '@/utils/logger';

export const maxDuration = 300;

// Set to be as fast as possible - only fetch static files
export const dynamic = 'force-dynamic'; // Allow dynamic parameters

// Only log in development or when explicitly enabled
const shouldLog = process.env.NODE_ENV === 'development' || process.env.DEBUG_OG === 'true';

// Helper function to conditionally log
const log = (message: string, ...args: any[]) => {
  if (shouldLog) {
    console.log(message, ...args);
  }
};

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
    
    ogLogger.info('Looking for static image for slug:', slug);
    
    // DIRECT STATIC FILE LOOKUP
    // Check for a pre-generated OG image using slug
    if (slug) {
      // Extract the final part of the slug (e.g., "walking-and-talking-with-ai" from "/blog/walking-and-talking-with-ai")
      const slugParts = slug.split('/');
      const lastSlugPart = slugParts[slugParts.length - 1];
      
      // Absolute path to the OG image
      const ogImagePath = path.join(process.cwd(), 'public', 'og-images', `${lastSlugPart}.png`);
      
      // Check if the static file exists
      if (fs.existsSync(ogImagePath)) {
        ogLogger.info(`Found static OG image for: ${lastSlugPart}`);
        const imageData = await readFile(ogImagePath);
        
        return new Response(imageData, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400, immutable', // Cache for 24 hours
          },
        });
      }
    }
    
    
    // REDIRECT TO GENERATOR
    // If we couldn't find a static image, redirect to the generator API
    const redirectParams = new URLSearchParams();
    
    // Copy all parameters to the new params object
    for (const [key, value] of searchParams.entries()) {
      redirectParams.set(key, value);
    }
    
    const generateUrl = `/api/og/generate?${redirectParams.toString()}`;
    
    ogLogger.info(`No static image found, redirecting to generator: ${generateUrl}`);
    
    return Response.redirect(new URL(generateUrl, request.url));
  } catch (error: any) {
    ogLogger.error(`OG route error:`, error);
    return new Response(`Error: ${error.message}`, {
      status: 500,
    });
  }
}
