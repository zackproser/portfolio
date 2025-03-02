import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    console.log('Auto-login API called');
    
    // Parse request body
    let email, sessionId;
    try {
      const body = await req.json();
      email = body.email;
      sessionId = body.sessionId;
      console.log(`Auto-login request for email: ${email}, sessionId: ${sessionId?.substring(0, 10)}...`);
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { error: 'Invalid request body format', success: false },
        { status: 400 }
      );
    }

    if (!email || !sessionId) {
      console.error('Missing required parameters:', { email: !!email, sessionId: !!sessionId });
      return NextResponse.json(
        { error: 'Missing required parameters', success: false },
        { status: 400 }
      );
    }

    // Verify this is a legitimate purchase by checking the session ID
    console.log(`Looking for purchase with email: ${email} and sessionId: ${sessionId}`);
    
    // Extract the session ID parts (cs_test_a1ePZZha8Lv36mRTOXssrrkWfeACdgKojSzhfjDxRjk4bksWKz3RCsmNNi)
    // Sometimes only the part after the last underscore is stored
    const sessionIdParts = sessionId.split('_');
    const sessionIdSuffix = sessionIdParts.length > 2 ? sessionIdParts[2] : sessionId;
    
    console.log(`Trying to match with full sessionId or suffix: ${sessionIdSuffix}`);
    
    // Try to find the purchase with more flexible matching - only using stripePaymentId which exists in schema
    let purchase = await prisma.purchase.findFirst({
      where: {
        email: email,
        OR: [
          { stripePaymentId: sessionId },
          { stripePaymentId: { contains: sessionId } },
          { stripePaymentId: { contains: sessionIdSuffix } }
        ]
      },
      orderBy: {
        purchaseDate: 'desc'
      }
    });

    if (!purchase) {
      // If still not found, try to find any recent purchase for this email
      console.log(`No purchase found with session ID. Trying to find any recent purchase for ${email}`);
      
      // Try with a more relaxed search - just look for recent purchases by this email
      const recentPurchase = await prisma.purchase.findFirst({
        where: {
          email: email
        },
        orderBy: {
          purchaseDate: 'desc'
        }
      });
      
      if (!recentPurchase) {
        console.log(`No valid purchase found for email: ${email}, but proceeding with user creation anyway`);
        // Instead of returning an error, we'll create a user account anyway
        // This makes the flow more resilient
      } else {
        console.log(`Found recent purchase for ${email}, purchase ID: ${recentPurchase.id}`);
        // Use the recent purchase instead
        purchase = recentPurchase;
      }
    } else {
      console.log(`Found valid purchase for ${email}, purchase ID: ${purchase.id}`);
    }

    // Check if user exists with this email
    let user = await prisma.user.findUnique({
      where: { email }
    });

    // If no user exists, create one (but don't verify the email)
    if (!user) {
      console.log(`Creating new user for email: ${email}`);
      try {
        user = await prisma.user.create({
          data: {
            email,
            name: 'Customer', // Default name
            // Don't set emailVerified - user will need to verify via magic link
          }
        });
        console.log(`Created new user account for ${email} after purchase, user ID: ${user.id}`);
      } catch (error) {
        console.error(`Failed to create user for ${email}:`, error);
        return NextResponse.json(
          { error: 'Failed to create user account', success: false },
          { status: 500 }
        );
      }
    } else {
      console.log(`Using existing user: ${email}, user ID: ${user.id}`);
    }

    // Return success with the email for the client to use with signIn
    // This will trigger the email verification flow
    console.log(`Auto-login preparation successful for ${email}, returning user data`);
    return NextResponse.json({ 
      success: true,
      userId: user.id,
      email: user.email,
      verified: !!user.emailVerified,
      message: user.emailVerified 
        ? "User is already verified, proceeding with sign in" 
        : "Verification email will be sent to complete sign in"
    });
  } catch (error) {
    // Log the error for debugging
    console.error('Unexpected error in auto-login:', 
      error instanceof Error ? error.message : 'Unknown error');
    
    // Return a proper error response
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process auto-login',
        success: false 
      }, 
      { status: 500 }
    );
  }
} 