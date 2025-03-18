import { prisma } from './prisma';

/**
 * Check if a user or email has purchased a specific content
 */
export async function hasUserPurchased(
  contentType: string,
  contentSlug: string,
  userIdOrEmail: string
): Promise<boolean> {
  // First determine if the input is an email or userId
  const isEmail = userIdOrEmail.includes('@');
  
  console.log(`[hasUserPurchased] Checking purchase for ${isEmail ? 'email' : 'userId'}: ${userIdOrEmail}, contentType: ${contentType}, contentSlug: ${contentSlug}`);
  
  try {
    let purchase = null;
    
    if (isEmail) {
      // Check by email (using findFirst instead of findUnique for more flexibility)
      purchase = await prisma.purchase.findFirst({
        where: {
          email: userIdOrEmail,
          contentType,
          contentSlug,
        },
      });
      
      console.log(`[hasUserPurchased] Email query result: ${purchase ? 'Found' : 'Not found'}`);
      
      // If not found with exact match, try case-insensitive match
      if (!purchase) {
        purchase = await prisma.purchase.findFirst({
          where: {
            email: { equals: userIdOrEmail, mode: 'insensitive' },
            contentType,
            contentSlug,
          },
        });
        console.log(`[hasUserPurchased] Case-insensitive email query result: ${purchase ? 'Found' : 'Not found'}`);
      }
    } else {
      // Check by userId (using findFirst instead of findUnique for more flexibility)
      purchase = await prisma.purchase.findFirst({
        where: {
          userId: userIdOrEmail,
          contentType,
          contentSlug,
        },
      });
      console.log(`[hasUserPurchased] User ID query result: ${purchase ? 'Found' : 'Not found'}`);
    }
    
    if (purchase) {
      console.log(`[hasUserPurchased] Purchase found: ${JSON.stringify({
        id: purchase.id,
        contentType: purchase.contentType,
        contentSlug: purchase.contentSlug,
        hasStripeId: !!purchase.stripePaymentId,
      })}`);
    }
    
    return !!purchase;
  } catch (error) {
    console.error(`[hasUserPurchased] Error checking purchase status: ${error}`);
    return false;
  }
}

/**
 * Record a purchase for a user or email
 */
export async function recordPurchase(
  contentType: string,
  contentSlug: string,
  userIdOrEmail: string,
  stripePaymentId: string,
  amount: number
): Promise<boolean> {
  const isEmail = userIdOrEmail.includes('@');
  
  try {
    if (isEmail) {
      // Check if user exists with this email
      const user = await prisma.user.findUnique({
        where: { email: userIdOrEmail },
      });
      
      if (user) {
        // User exists, record purchase with userId
        await prisma.purchase.create({
          data: {
            contentType,
            contentSlug,
            userId: user.id,
            email: userIdOrEmail, // Store email as well for redundancy
            stripePaymentId,
            amount,
          },
        });
      } else {
        // No user account, just record with email
        await prisma.purchase.create({
          data: {
            contentType,
            contentSlug,
            email: userIdOrEmail,
            stripePaymentId,
            amount,
          },
        });
      }
    } else {
      // Record with userId
      await prisma.purchase.create({
        data: {
          contentType,
          contentSlug,
          userId: userIdOrEmail,
          stripePaymentId,
          amount,
        },
      });
    }
    
    return true;
  } catch (error) {
    console.error('Error recording purchase:', error);
    return false;
  }
}

/**
 * Get all purchases for a user or email
 */
export async function getUserPurchases(userIdOrEmail: string) {
  const isEmail = userIdOrEmail.includes('@');
  
  try {
    if (isEmail) {
      return await prisma.purchase.findMany({
        where: { email: userIdOrEmail },
        orderBy: { purchaseDate: 'desc' },
      });
    } else {
      return await prisma.purchase.findMany({
        where: { userId: userIdOrEmail },
        orderBy: { purchaseDate: 'desc' },
      });
    }
  } catch (error) {
    console.error('Error fetching user purchases:', error);
    return [];
  }
}

/**
 * Associate purchases made with an email to a user account
 * This is useful when a user makes a purchase before signing up,
 * then later creates an account with the same email
 */
export async function associatePurchasesToUser(email: string, userId: string): Promise<number> {
  try {
    // Find purchases made with this email that don't have a userId
    const result = await prisma.purchase.updateMany({
      where: {
        email,
        userId: null,
      },
      data: {
        userId,
      },
    });
    
    return result.count;
  } catch (error) {
    console.error('Error associating purchases to user:', error);
    return 0;
  }
}

/**
 * Get all purchases for a specific content
 */
export async function getContentPurchases(contentType: string, contentSlug: string) {
  try {
    return await prisma.purchase.findMany({
      where: {
        contentType,
        contentSlug,
      },
      orderBy: { purchaseDate: 'desc' },
      include: { user: true },
    });
  } catch (error) {
    console.error('Error fetching content purchases:', error);
    return [];
  }
}

/**
 * Send a purchase confirmation email
 */
export async function sendPurchaseConfirmationEmail(
  contentType: string,
  contentSlug: string,
  email: string
): Promise<boolean> {
  try {
    // Create a record of the email notification
    await prisma.emailNotification.create({
      data: {
        contentType,
        contentSlug,
        email,
        emailType: 'purchase_confirmation',
      },
    });
    
    // Here you would integrate with your email service
    // For example, using Postmark or Resend
    
    return true;
  } catch (error) {
    console.error('Error sending purchase confirmation email:', error);
    return false;
  }
} 