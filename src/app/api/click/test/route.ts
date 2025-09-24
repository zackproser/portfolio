import { NextRequest, NextResponse } from "next/server";

/**
 * Test endpoint to verify the click API works
 * Usage: /api/click/test?email=test@example.com&tag=intent:build&tag=newsletter:ai
 */
export async function GET(req: NextRequest) {
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email') || 'test@example.com';
  const tags = searchParams.getAll('tag');
  
  // Build the click URL
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const clickUrl = new URL('/api/click', baseUrl);
  clickUrl.searchParams.set('e', email);
  tags.forEach(tag => clickUrl.searchParams.append('tag', tag));
  clickUrl.searchParams.set('r', 'https://zackproser.com/thanks');

  return NextResponse.json({
    message: 'Click API test endpoint',
    email,
    tags,
    clickUrl: clickUrl.toString(),
    environment: {
      hasApiKey: !!process.env.EMAIL_OCTOPUS_API_KEY,
      hasListId: !!process.env.EMAIL_OCTOPUS_LIST_ID,
      hasDefaultRedirect: !!process.env.CLICK_REDIRECT_DEFAULT,
    }
  });
}
