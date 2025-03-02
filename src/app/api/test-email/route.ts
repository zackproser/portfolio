import { NextRequest, NextResponse } from "next/server";
import { sendFreeChaptersEmail } from "@/lib/postmark";
import { loadContent } from "@/lib/content-handlers";
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  console.log('📧 [TEST] Starting test email endpoint');
  
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    console.log('📧 [TEST] Rejecting request: not in development mode');
    return NextResponse.json(
      { error: 'This endpoint is only available in development mode' },
      { status: 403 }
    );
  }

  // Get query parameters
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');
  const rawProductSlug = searchParams.get('productSlug') || 'rag-pipeline-tutorial';
  
  // Remove any leading slashes from the productSlug
  const productSlug = rawProductSlug.replace(/^\/+/, '');
  
  console.log(`📧 [TEST] Request parameters: email=${email}, rawProductSlug=${rawProductSlug}, normalized=${productSlug}`);

  // Validate email
  if (!email) {
    console.log('📧 [TEST] Rejecting request: missing email parameter');
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  // Debug: Check if content file exists directly
  try {
    const contentDir = path.join(process.cwd(), 'src/content/blog', productSlug);
    const contentFile = path.join(contentDir, 'page.mdx');
    
    console.log(`📧 [DEBUG] Checking if content file exists: ${contentFile}`);
    const fileExists = fs.existsSync(contentFile);
    console.log(`📧 [DEBUG] File exists: ${fileExists}`);
    
    if (!fileExists) {
      console.log(`📧 [TEST] Rejecting request: content file not found at ${contentFile}`);
      return NextResponse.json(
        { error: `Content file not found for slug: ${productSlug}` },
        { status: 404 }
      );
    }
    
    // Try to read the first few lines to get the title
    const fileContent = fs.readFileSync(contentFile, 'utf8').split('\n').slice(0, 30).join('\n');
    console.log(`📧 [DEBUG] First 30 lines of content file:`);
    console.log(fileContent);
    
    // Extract title from metadata
    const titleMatch = fileContent.match(/title: ["'](.+?)["']/);
    const title = titleMatch ? titleMatch[1] : productSlug;
    console.log(`📧 [DEBUG] Extracted title: ${title}`);
    
    console.log(`📧 [TEST] Sending test email to ${email} for content "${title}" (${productSlug})`);
    
    try {
      // Send the email
      const result = await sendFreeChaptersEmail({
        To: email,
        ProductName: title,
        ProductSlug: productSlug
      });
      
      console.log(`📧 [TEST] Email sent successfully:`, result);
      
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        to: email,
        content: title
      });
    } catch (error) {
      console.error('📧 [TEST] Error sending test email:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to send test email',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error(`📧 [DEBUG] Error checking content file:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to check content file',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 