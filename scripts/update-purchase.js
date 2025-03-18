#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updatePurchase() {
  try {
    // First get the user ID
    const user = await prisma.user.findUnique({
      where: { email: 'zackproser@gmail.com' }
    });
    
    if (!user) {
      console.log('User not found with email: zackproser@gmail.com');
      return;
    }
    
    console.log('Found user:', user.id);
    
    // Get the purchase
    const purchase = await prisma.purchase.findFirst({
      where: {
        email: 'zackproser@gmail.com',
        contentSlug: 'rag-pipeline-tutorial'
      }
    });
    
    if (!purchase) {
      console.log('Purchase not found');
      return;
    }
    
    console.log('Found purchase:', purchase.id);
    
    // Update the purchase to link the user ID
    const updated = await prisma.purchase.update({
      where: { id: purchase.id },
      data: { userId: user.id }
    });
    
    console.log('Updated purchase with user ID:', updated);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updatePurchase(); 