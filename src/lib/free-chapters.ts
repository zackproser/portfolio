import { prisma } from "@/lib/prisma";

/**
 * Check if a user has already requested free chapters for a specific product
 * @param email User's email address
 * @param productSlug Product slug
 * @returns Boolean indicating if the user has already requested free chapters
 */
export async function hasRequestedFreeChapters(
  email: string,
  productSlug: string
): Promise<boolean> {
  if (!email || !productSlug) {
    return false;
  }

  try {
    // Log the available models to debug
    console.log('Available Prisma models:', Object.keys(prisma));
    
    // Use findFirst instead of findUnique with the compound key
    const request = await prisma.freeChapterRequest.findFirst({
      where: {
        AND: [
          { email },
          { productSlug }
        ]
      }
    });

    return !!request;
  } catch (error) {
    console.error("Error checking free chapter request status:", error);
    return false;
  }
}

/**
 * Get all free chapter requests for a specific product
 * @param productSlug Product slug
 * @returns Array of email addresses that have requested free chapters
 */
export async function getFreeChapterRequestsForProduct(
  productSlug: string
): Promise<string[]> {
  if (!productSlug) {
    return [];
  }

  try {
    const requests = await prisma.freeChapterRequest.findMany({
      where: {
        productSlug
      },
      select: {
        email: true
      }
    });

    return requests.map((request: { email: string }) => request.email);
  } catch (error) {
    console.error("Error getting free chapter requests:", error);
    return [];
  }
}

/**
 * Get all products for which a user has requested free chapters
 * @param email User's email address
 * @returns Array of product slugs
 */
export async function getUserFreeChapterRequests(
  email: string
): Promise<string[]> {
  if (!email) {
    return [];
  }

  try {
    const requests = await prisma.freeChapterRequest.findMany({
      where: {
        email
      },
      select: {
        productSlug: true
      }
    });

    return requests.map((request: { productSlug: string }) => request.productSlug);
  } catch (error) {
    console.error("Error getting user free chapter requests:", error);
    return [];
  }
}

/**
 * Record a free chapter request
 * @param email User's email address
 * @param productSlug Product slug
 * @param userId Optional user ID if the user is logged in
 * @returns The created or updated free chapter request
 */
export async function recordFreeChapterRequest(
  email: string,
  productSlug: string,
  userId?: string
): Promise<any> {
  if (!email || !productSlug) {
    throw new Error("Email and product slug are required");
  }

  try {
    // Use upsert with findFirst condition instead of unique constraint
    const existingRequest = await prisma.freeChapterRequest.findFirst({
      where: {
        AND: [
          { email },
          { productSlug }
        ]
      }
    });

    if (existingRequest) {
      return await prisma.freeChapterRequest.update({
        where: { id: existingRequest.id },
        data: {
          requestDate: new Date(),
          userId: userId || undefined
        }
      });
    } else {
      return await prisma.freeChapterRequest.create({
        data: {
          email,
          productSlug,
          userId: userId || undefined
        }
      });
    }
  } catch (error) {
    console.error("Error recording free chapter request:", error);
    throw error;
  }
}

/**
 * Mark a free chapter request as fulfilled
 * @param email User's email address
 * @param productSlug Product slug
 * @returns The updated free chapter request
 */
export async function markFreeChapterRequestFulfilled(
  email: string,
  productSlug: string
): Promise<any> {
  if (!email || !productSlug) {
    throw new Error("Email and product slug are required");
  }

  try {
    const existingRequest = await prisma.freeChapterRequest.findFirst({
      where: {
        AND: [
          { email },
          { productSlug }
        ]
      }
    });

    if (!existingRequest) {
      throw new Error("Free chapter request not found");
    }

    return await prisma.freeChapterRequest.update({
      where: { id: existingRequest.id },
      data: {
        fulfilled: true,
        fulfilledDate: new Date()
      }
    });
  } catch (error) {
    console.error("Error marking free chapter request as fulfilled:", error);
    throw error;
  }
} 