import { NextRequest, NextResponse } from "next/server";
import { sendFreeChaptersEmail } from "@/lib/postmark";
import fs from 'fs';
import path from 'path';
import { emailLogger as logger } from "@/utils/logger";

export async function GET(request: NextRequest) {
  logger.info('[TEST_EMAIL] Starting test email endpoint');
  
  // Only allow in development mode
  if (process.env.NODE_ENV !== 'development') {
    logger.warn('[TEST_EMAIL] Rejecting request: not in development mode');
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
  
  logger.info(`[TEST_EMAIL] Request parameters: email=${email}, rawProductSlug=${rawProductSlug}, normalized=${productSlug}`);

  // Validate email
  if (!email) {
    logger.warn('[TEST_EMAIL] Rejecting request: missing email parameter');
    return NextResponse.json(
      { error: 'Email parameter is required' },
      { status: 400 }
    );
  }

  // Debug: Check if content file exists directly
  try {
    const contentDir = path.join(process.cwd(), 'src/content/blog', productSlug);
    const contentFile = path.join(contentDir, 'page.mdx');
    
    logger.debug(`[TEST_EMAIL] Checking if content file exists: ${contentFile}`);
    const fileExists = fs.existsSync(contentFile);
    logger.debug(`[TEST_EMAIL] File exists: ${fileExists}`);
    
    if (!fileExists) {
      logger.error(`[TEST_EMAIL] Rejecting request: content file not found at ${contentFile}`);
      return NextResponse.json(
        { error: `Content file not found for slug: ${productSlug}` },
        { status: 404 }
      );
    }
    
    // Try to read the first few lines to get the title
    const fileContent = fs.readFileSync(contentFile, 'utf8').split('\n').slice(0, 30).join('\n');
    //console.log(`📧 [DEBUG] First 30 lines of content file:`);
    //console.log(fileContent);
    
    // Extract title from metadata
    const titleMatch = fileContent.match(/title: ["'](.+?)["']/);
    const title = titleMatch ? titleMatch[1] : productSlug;
    logger.debug(`[TEST_EMAIL] Extracted title: ${title}`);
    
    logger.info(`[TEST_EMAIL] Sending test email to ${email} for content "${title}" (${productSlug})`);
    
    try {
      // Send the email
      const result = await sendFreeChaptersEmail({
        To: email,
        ProductName: title,
        ProductSlug: productSlug
      });
      
      logger.info(`[TEST_EMAIL] Email sent successfully via Postmark:`, result);
      
      return NextResponse.json({
        success: true,
        message: 'Test email sent successfully',
        to: email,
        content: title
      });
    } catch (error) {
      logger.error('[TEST_EMAIL] Error sending test email:', error);
      
      return NextResponse.json(
        { 
          error: 'Failed to send test email',
          details: error instanceof Error ? error.message : String(error)
        },
        { status: 500 }
      );
    }
  } catch (error) {
    logger.error(`[TEST_EMAIL] Error checking content file:`, error);
    return NextResponse.json(
      { 
        error: 'Failed to check content file',
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 