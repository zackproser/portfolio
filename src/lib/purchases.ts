import { prisma } from './prisma';
import { purchaseLogger as logger } from '@/utils/logger'; // Import the centralized purchase logger

// Add a debug logger based on environment variable (REMOVED)
// const isDebugMode = process.env.NODE_ENV === 'development' && process.env.DEBUG_PURCHASES === 'true';
// const debugLog = (message: string, data?: any) => {
//   if (isDebugMode) {
//     if (data) {
//       console.log(`[purchases] ${message}`, data);
//     } else {
//       console.log(`[purchases] ${message}`);
//     }
//   }
// };

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
  
  // Use logger.info for general flow, logger.debug for details
  logger.info(`Checking purchase for ${isEmail ? 'email' : 'userId'}: ${userIdOrEmail}, content: ${contentType}/${contentSlug}`);
  
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
      
      logger.debug(`Email query result: ${purchase ? 'Found' : 'Not found'}`);
      
      // If not found with exact match, try case-insensitive match
      if (!purchase) {
        purchase = await prisma.purchase.findFirst({
          where: {
            email: { equals: userIdOrEmail, mode: 'insensitive' },
            contentType,
            contentSlug,
          },
        });
        logger.debug(`Case-insensitive email query result: ${purchase ? 'Found' : 'Not found'}`);
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
      logger.debug(`User ID query result: ${purchase ? 'Found' : 'Not found'}`);
    }
    
    if (purchase) {
      logger.debug(`Purchase found:`, {
        id: purchase.id,
        contentType: purchase.contentType,
        contentSlug: purchase.contentSlug,
        hasStripeId: !!purchase.stripePaymentId,
      });
    }
    
    return !!purchase;
  } catch (error) {
    logger.error(`Error checking purchase status for ${contentType}/${contentSlug}:`, error);
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
  
  logger.info(`Recording purchase for ${isEmail ? 'email' : 'userId'}: ${userIdOrEmail}, content: ${contentType}/${contentSlug}, amount: ${amount}`);
  
  try {
    let userId: string | null = null;
    let userEmail: string | null = null;

    if (isEmail) {
      userEmail = userIdOrEmail;
      // Check if user exists with this email to potentially link the purchase
      const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true } // Only select the ID
      });
      
      if (user) {
        userId = user.id;
        logger.debug(`Found existing user (ID: ${userId}) for email ${userEmail}`);
      } else {
         logger.debug(`No existing user found for email ${userEmail}`);
      }
    } else {
      userId = userIdOrEmail;
      // Attempt to find the user's email if we only have the ID
      const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { email: true }
      });
      if(user?.email) {
          userEmail = user.email;
           logger.debug(`Found email ${userEmail} for user ID ${userId}`);
      } else {
           logger.debug(`Could not find email for user ID ${userId}`);
      }
    }

    // Create the purchase record
    const createdPurchase = await prisma.purchase.create({
      data: {
        contentType,
        contentSlug,
        userId, // Will be null if only email was provided and no user found
        email: userEmail, // Store email if available, even if userId is set
        stripePaymentId,
        amount,
      },
    });

    logger.info(`Purchase recorded successfully (ID: ${createdPurchase.id})`);
    return true;

  } catch (error) {
    logger.error(`Error recording purchase for ${contentType}/${contentSlug}:`, error);
    return false;
  }
}

/**
 * Get all purchases for a user or email
 */
export async function getUserPurchases(userIdOrEmail: string) {
  const isEmail = userIdOrEmail.includes('@');
  logger.info(`Fetching purchases for ${isEmail ? 'email' : 'userId'}: ${userIdOrEmail}`);
  
  try {
    let purchases;
    if (isEmail) {
      purchases = await prisma.purchase.findMany({
        where: { email: userIdOrEmail },
        orderBy: { purchaseDate: 'desc' },
      });
    } else {
      purchases = await prisma.purchase.findMany({
        where: { userId: userIdOrEmail },
        orderBy: { purchaseDate: 'desc' },
      });
    }
    logger.info(`Found ${purchases.length} purchases for ${isEmail ? 'email' : 'userId'}: ${userIdOrEmail}`);
    return purchases;
  } catch (error) {
    logger.error(`Error fetching user purchases for ${userIdOrEmail}:`, error);
    return [];
  }
}

/**
 * Associate purchases made with an email to a user account
 * This is useful when a user makes a purchase before signing up,
 * then later creates an account with the same email
 */
export async function associatePurchasesToUser(email: string, userId: string): Promise<number> {
  logger.info(`Attempting to associate purchases for email ${email} to userId ${userId}`);
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
    
    logger.info(`Associated ${result.count} purchases for email ${email} to userId ${userId}.`);
    return result.count;
  } catch (error) {
    logger.error(`Error associating purchases for email ${email} to user ${userId}:`, error);
    return 0;
  }
}

/**
 * Get all purchases for a specific content
 */
export async function getContentPurchases(contentType: string, contentSlug: string) {
  logger.info(`Fetching purchases for content: ${contentType}/${contentSlug}`);
  try {
    const purchases = await prisma.purchase.findMany({
      where: {
        contentType,
        contentSlug,
      },
      orderBy: { purchaseDate: 'desc' },
      include: { user: true },
    });
    logger.info(`Found ${purchases.length} purchases for content ${contentType}/${contentSlug}`);
    return purchases;
  } catch (error) {
    logger.error(`Error fetching content purchases for ${contentType}/${contentSlug}:`, error);
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
  logger.info(`Recording email notification send attempt: type=purchase_confirmation, email=${email}, content=${contentType}/${contentSlug}`);
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
    
    logger.info(`Email notification record created successfully.`);
    // Here you would integrate with your email service
    // For example, using Postmark or Resend
    // logger.info(`Attempting to send purchase confirmation via email service...`);
    
    return true;
  } catch (error) {
    logger.error(`Error recording/sending purchase confirmation email for ${contentType}/${contentSlug} to ${email}:`, error);
    return false;
  }
} 