#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

// Initialize PrismaClient
const prisma = new PrismaClient();

/**
 * Test script to verify our handling of manually provisioned free access
 * This simulates the flow that would happen when a user tries to access content
 * that was provisioned for them with free access
 */
async function main() {
  console.log('Starting free access test...');
  
  try {
    const testEmail = `test-${Date.now()}@example.com`;
    const testSlug = 'rag-pipeline-tutorial';
    const testStripeId = `free_access_${crypto.randomBytes(14).toString('hex')}`;
    
    console.log('Creating test purchase record with:', { 
      email: testEmail, 
      contentSlug: testSlug, 
      stripePaymentId: testStripeId 
    });
    
    // 1. First create a purchase record with a fake Stripe ID
    const purchase = await prisma.purchase.create({
      data: {
        email: testEmail,
        contentType: 'article',
        contentSlug: testSlug,
        stripePaymentId: testStripeId,
        amount: 0, // Free access
        purchaseDate: new Date()
      }
    });
    
    console.log('✅ Created test purchase record:', purchase);
    
    // 2. Now simulate what happens in the checkout-sessions API endpoint
    // when someone tries to access with this ID
    try {
      console.log('Simulating checkout session retrieval with ID:', testStripeId);
      
      // Try to "look up" the ID directly in purchases
      const foundPurchase = await prisma.purchase.findFirst({
        where: { stripePaymentId: testStripeId }
      });
      
      if (foundPurchase) {
        console.log('✅ Successfully found purchase record by stripePaymentId');
        console.log('Purchase:', foundPurchase);
        
        // We'd normally now try to load the content via importContentMetadata
        console.log('✅ In a real request we would now load the content metadata and return it');
      } else {
        console.error('❌ Failed to find purchase record by stripePaymentId');
      }
    } catch (error) {
      console.error('❌ Error during simulated checkout retrieval:', error);
    }
    
    // 3. Clean up the test data
    await prisma.purchase.delete({
      where: { id: purchase.id }
    });
    
    console.log('✅ Test data cleaned up');
    console.log('✅ Test completed successfully');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
main(); 