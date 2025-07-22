import { NextRequest } from 'next/server';
import { ogLogger } from '@/utils/logger';

export const maxDuration = 300;

// Set to be as fast as possible - only fetch static files
export const dynamic = 'force-dynamic'; // Allow dynamic parameters

// Bunny CDN configuration
const CDN_BASE_URL = 'https://zackproser.b-cdn.net';

export async function GET(request: NextRequest) {
  try {
    // Parse the URL directly from request.url and decode HTML entities more thoroughly
    const requestUrl = request.url;
    
    ogLogger.info('OG Route - Processing request:', requestUrl);
    
    // More thorough HTML entity decoding - replace common patterns
    // First decode &amp; to & to handle double-encoded URLs
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
    
    ogLogger.info('Decoded URL:', decodedUrl);
    
    const { searchParams } = new URL(decodedUrl);

    // Extract the slug parameter and title for fallback
    const slug = searchParams.get('slug');
    const title = searchParams.get('title') || 'Modern Coding';
    
    // Log all search parameters for debugging
    ogLogger.info('OG Route - Parameters:');
    for (const [key, value] of searchParams.entries()) {
      ogLogger.info(`- ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
    }
    
    // BUNNY CDN STATIC FILE LOOKUP
    // Check for a pre-generated OG image using slug (if provided)
    if (slug) {
      // Extract the final part of the slug (e.g., "walking-and-talking-with-ai" from "/blog/walking-and-talking-with-ai")
      const slugParts = slug.split('/');
      const lastSlugPart = slugParts[slugParts.length - 1];
      
      // Construct Bunny CDN URL for the OG image
      const cdnImageUrl = `${CDN_BASE_URL}/images/og-images/${lastSlugPart}.png`;
      ogLogger.info(`Looking for OG image on Bunny CDN: ${cdnImageUrl}`);
      
      try {
        // Check if the image exists on Bunny CDN by making a HEAD request
        const response = await fetch(cdnImageUrl, { method: 'HEAD' });
        
        if (response.ok) {
          ogLogger.info(`✅ Found OG image on Bunny CDN for: ${lastSlugPart}`);
          
          // Redirect to the CDN URL for optimal performance
          return Response.redirect(cdnImageUrl, 302);
        } else {
          ogLogger.info(`❌ No OG image found on Bunny CDN for slug: ${lastSlugPart}`);
        }
      } catch (cdnError: any) {
        ogLogger.error(`Error checking Bunny CDN: ${cdnError.message}`);
        // Fall through to dynamic generation
      }
    } else {
      ogLogger.info('No slug parameter provided, skipping CDN lookup');
    }
    
    
    // REDIRECT TO GENERATOR
    // If we couldn't find a static image on CDN, redirect to the generator API
    const redirectParams = new URLSearchParams();
    
    // Copy all parameters to the new params object
    for (const [key, value] of searchParams.entries()) {
      redirectParams.set(key, value);
      ogLogger.info(`Setting redirect param: ${key}=${value}`);
    }
    
    // Double-check slug is present in the redirect
    let slugInRedirect = redirectParams.get('slug');
    ogLogger.info(`Slug in redirect params: ${slugInRedirect}`);
    
    // If slug was in the original request but missing in redirect params, add it back
    if (slug && !slugInRedirect) {
      ogLogger.warn('Slug was lost during redirect creation, adding it back');
      redirectParams.set('slug', slug);
    }
    
    // Confirm slug is now in params
    slugInRedirect = redirectParams.get('slug');
    ogLogger.info(`Final slug in redirect params: ${slugInRedirect}`);
    
    const generateUrl = `/api/og/generate?${redirectParams.toString()}`;
    
    ogLogger.info(`Redirecting to generator: ${generateUrl}`);
    
    return Response.redirect(new URL(generateUrl, request.url));
  } catch (error: any) {
    ogLogger.error(`OG route error:`, error);
    return new Response(`Error: ${error.message}`, {
      status: 500,
    });
  }
}
