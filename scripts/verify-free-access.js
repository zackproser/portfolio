#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const { program } = require('commander');

// Initialize PrismaClient
const prisma = new PrismaClient();

/**
 * Verify a user's access to a specific product
 * This can be run in production to check if a user has access to a product
 * without requiring them to log in
 */
async function verifyAccess(email, productSlug) {
  console.log(`Verifying access for ${email} to ${productSlug}...`);
  
  try {
    // Check by exact email match
    const purchase = await prisma.purchase.findFirst({
      where: {
        email,
        contentSlug: productSlug
      }
    });
    
    if (purchase) {
      console.log('✅ Purchase record found:', {
        id: purchase.id,
        contentType: purchase.contentType,
        contentSlug: purchase.contentSlug,
        stripePaymentId: purchase.stripePaymentId,
        amount: purchase.amount,
        purchaseDate: purchase.purchaseDate
      });
      
      // Check if it's a free access purchase
      if (purchase.stripePaymentId && purchase.stripePaymentId.startsWith('free_access_')) {
        console.log('✅ This is a manually provisioned free access purchase');
      } else if (purchase.amount === 0) {
        console.log('✅ This is a free access purchase (amount = 0)');
      } else {
        console.log('ℹ️ This is a paid purchase');
      }
      
      return true;
    }
    
    // Try case-insensitive match
    const purchaseCaseInsensitive = await prisma.purchase.findFirst({
      where: {
        email: { equals: email, mode: 'insensitive' },
        contentSlug: productSlug
      }
    });
    
    if (purchaseCaseInsensitive) {
      console.log('✅ Purchase record found (case-insensitive match):', {
        id: purchaseCaseInsensitive.id,
        contentType: purchaseCaseInsensitive.contentType,
        contentSlug: purchaseCaseInsensitive.contentSlug,
        email: purchaseCaseInsensitive.email,
        stripePaymentId: purchaseCaseInsensitive.stripePaymentId
      });
      
      // Check if it's a free access purchase
      if (purchaseCaseInsensitive.stripePaymentId && purchaseCaseInsensitive.stripePaymentId.startsWith('free_access_')) {
        console.log('✅ This is a manually provisioned free access purchase');
      } else if (purchaseCaseInsensitive.amount === 0) {
        console.log('✅ This is a free access purchase (amount = 0)');
      } else {
        console.log('ℹ️ This is a paid purchase');
      }
      
      return true;
    }
    
    console.log(`❌ No purchase record found for ${email} and product ${productSlug}`);
    
    // Let's list all purchases for this email to help debug
    const allPurchases = await prisma.purchase.findMany({
      where: {
        OR: [
          { email: { contains: email.split('@')[0], mode: 'insensitive' } }
        ]
      },
      take: 5
    });
    
    if (allPurchases.length > 0) {
      console.log(`ℹ️ Found ${allPurchases.length} related purchases for this email:`, 
        allPurchases.map(p => ({ 
          id: p.id, 
          email: p.email, 
          contentSlug: p.contentSlug,
          stripePaymentId: p.stripePaymentId
        }))
      );
    } else {
      console.log('ℹ️ No related purchases found for this email');
    }
    
    // Let's also check if there are any purchases for this product
    const productPurchases = await prisma.purchase.findMany({
      where: { contentSlug: productSlug },
      take: 5
    });
    
    if (productPurchases.length > 0) {
      console.log(`ℹ️ Found ${productPurchases.length} purchases for product ${productSlug}:`, 
        productPurchases.map(p => ({ 
          id: p.id, 
          email: p.email, 
          stripePaymentId: p.stripePaymentId
        }))
      );
    } else {
      console.log(`ℹ️ No purchases found for product ${productSlug}`);
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error verifying access:', error);
    return false;
  }
}

// Parse command-line arguments
program
  .name('verify-free-access')
  .description('Verify if a user has access to a specific product')
  .argument('<email>', 'User email to check')
  .argument('<product>', 'Product slug to check access for')
  .action(async (email, product) => {
    try {
      const hasAccess = await verifyAccess(email, product);
      
      console.log();
      if (hasAccess) {
        console.log(`✅ User ${email} HAS access to product ${product}`);
      } else {
        console.log(`❌ User ${email} DOES NOT have access to product ${product}`);
      }
      
      await prisma.$disconnect();
    } catch (error) {
      console.error('Error:', error);
      process.exit(1);
    }
  });

program.parse(process.argv); 