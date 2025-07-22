import { NextRequest } from 'next/server';
import { ogLogger } from '@/utils/logger';

export const maxDuration = 300;

// Set to be as fast as possible - only fetch static files
export const dynamic = 'force-dynamic'; // Allow dynamic parameters

// Bunny CDN configuration
const CDN_BASE_URL = 'https://zackproser.b-cdn.net';

export async function GET(request: NextRequest) {
  try {
    console.log('=== OG ROUTE START ===');
    console.log('Request object type:', typeof request);
    console.log('Request object keys:', Object.keys(request));
    console.log('Request headers type:', typeof request.headers);
    console.log('Request headers:', request.headers);
    
    // Parse the URL directly from request.url and decode HTML entities more thoroughly
    const requestUrl = request.url;
    
    console.log('Request URL:', requestUrl);
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
    
    // Additional URL decoding for double-encoded parameters
    try {
      decodedUrl = decodeURIComponent(decodedUrl);
    } catch (e) {
      ogLogger.warn('Failed to decode URL, using original:', e);
    }
    
    ogLogger.info('Decoded URL:', decodedUrl);
    
    const { searchParams } = new URL(decodedUrl);

    // Extract the slug parameter and title for fallback
    const slug = searchParams.get('slug');
    const title = searchParams.get('title') || 'Modern Coding';
    
    ogLogger.info(`Raw slug from searchParams: "${slug}"`);
    ogLogger.info(`Slug type: ${typeof slug}`);
    ogLogger.info(`Slug length: ${slug?.length}`);
    
    // Log all search parameters for debugging
    ogLogger.info('OG Route - Parameters:');
    for (const [key, value] of searchParams.entries()) {
      ogLogger.info(`- ${key}: ${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`);
    }
    
    // BUNNY CDN STATIC FILE LOOKUP
    // Check for a pre-generated OG image using slug (if provided)
    if (slug && slug !== '[slug]') {
      // Extract the final part of the slug (e.g., "walking-and-talking-with-ai" from "/blog/walking-and-talking-with-ai")
      const slugParts = slug.split('/');
      const lastSlugPart = slugParts[slugParts.length - 1];
      
      // Construct Bunny CDN URL for the OG image
      const cdnImageUrl = `${CDN_BASE_URL}/images/og-images/${lastSlugPart}.png`;
      ogLogger.info(`Redirecting to CDN URL: ${cdnImageUrl}`);
      
          // Try to check if image exists on CDN, but handle errors gracefully
    console.log('About to make CDN fetch request to:', cdnImageUrl);
    try {
      console.log('Making fetch request...');
      const response = await fetch(cdnImageUrl, { 
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; OG-Image-Checker/1.0)'
        }
      });
      
      console.log('Fetch response received, status:', response.status);
      console.log('Fetch response headers:', response.headers);
      
      if (response.ok) {
        console.log('✅ Found OG image on CDN, redirecting to:', cdnImageUrl);
        ogLogger.info(`✅ Found OG image on CDN, redirecting to: ${cdnImageUrl}`);
        return Response.redirect(cdnImageUrl, 302);
      } else {
        console.log('❌ Image not found on CDN (status:', response.status, '), proceeding to generator');
        ogLogger.info(`❌ Image not found on CDN (status: ${response.status}), proceeding to generator`);
      }
    } catch (error: any) {
      console.log('CDN fetch error:', error);
      console.log('CDN error message:', error.message);
      console.log('CDN error stack:', error.stack);
      ogLogger.warn(`CDN check failed, proceeding to generator: ${error.message}`);
    }
    } else {
      if (slug === '[slug]') {
        ogLogger.info('Invalid slug parameter [slug] provided, skipping CDN lookup');
      } else {
        ogLogger.info('No slug parameter provided, skipping CDN lookup');
      }
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
    
    console.log('Generate URL:', generateUrl);
    ogLogger.info(`Redirecting to generator: ${generateUrl}`);
    
    // Use the full URL for the redirect
    console.log('About to create URL object with:', generateUrl, 'and base:', request.url);
    const fullGenerateUrl = new URL(generateUrl, request.url).toString();
    console.log('Full generate URL:', fullGenerateUrl);
    console.log('About to redirect to:', fullGenerateUrl);
    
    const redirectResponse = Response.redirect(fullGenerateUrl, 302);
    console.log('Redirect response created:', redirectResponse);
    console.log('Redirect response status:', redirectResponse.status);
    console.log('Redirect response headers:', redirectResponse.headers);
    
    return redirectResponse;
  } catch (error: any) {
    console.log('=== OG ROUTE ERROR ===');
    console.log('Error type:', typeof error);
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('Error name:', error.name);
    console.log('Error constructor:', error.constructor.name);
    console.log('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    
    ogLogger.error(`OG route error:`, error);
    return new Response(`Error: ${error.message}`, {
      status: 500,
    });
  }
}
