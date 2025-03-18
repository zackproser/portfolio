#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const { program } = require('commander');
const readline = require('readline');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Initialize PrismaClient
const prisma = new PrismaClient();

// Setup a readline interface for interactive prompts
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to prompt for input
const prompt = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Generate a fake Stripe payment ID that looks realistic
const generateFakeStripeId = () => {
  // Format: free_access_xxxxxx (random string with free_access_ prefix)
  // This makes it clear this is a manually provisioned free access
  const randomString = crypto.randomBytes(14).toString('hex');
  return `free_access_${randomString}`;
};

// Validate a product slug using a reliable approach
const validateProductSlug = async (slug) => {
  try {
    if (!slug) return false;

    // 1. First check for existing purchases with this slug
    const existingPurchase = await prisma.purchase.findFirst({
      where: { contentSlug: slug },
      take: 1
    });

    if (existingPurchase) {
      console.log(`✅ Product slug validated via existing purchase: ${slug}`);
      return true;
    }

    // 2. Check if the directory exists in the blog content directory
    const blogPath = path.join(process.cwd(), 'src/content/blog', slug);
    if (fs.existsSync(blogPath) && fs.statSync(blogPath).isDirectory()) {
      // Check if there's a page.mdx file inside the directory
      const mdxPath = path.join(blogPath, 'page.mdx');
      if (fs.existsSync(mdxPath)) {
        // Read the file content to check if it's a paid product
        const content = fs.readFileSync(mdxPath, 'utf8');
        
        // Check if this is a paid product by looking for commerce.isPaid: true in the metadata
        if (content.includes('isPaid: true') || content.includes('"isPaid": true') || content.includes('isPaid:true')) {
          console.log(`✅ Product slug validated via content metadata: ${slug}`);
          return true;
        } else {
          console.log(`❌ Content found but not a paid product: ${slug}`);
          return false;
        }
      }
    }

    // If we couldn't validate automatically, ask for confirmation
    console.warn(`⚠️ Warning: Could not automatically validate product slug: ${slug}`);
    const confirm = await prompt(`Could not validate product '${slug}'. Proceed anyway? (y/n): `);
    return confirm.toLowerCase() === 'y';
  } catch (error) {
    console.error('Error validating product slug:', error);
    return false;
  }
};

// Get available product slugs by scanning for paid content
const getAvailableProductSlugs = async () => {
  try {
    // Check the blog directory for potential products
    const blogDir = path.join(process.cwd(), 'src/content/blog');
    if (!fs.existsSync(blogDir)) {
      console.error('Blog content directory not found:', blogDir);
      return [];
    }

    const items = fs.readdirSync(blogDir, { withFileTypes: true });
    
    // Filter for directories that contain a page.mdx file with isPaid: true
    const paidProducts = [];
    
    for (const item of items) {
      if (item.isDirectory()) {
        const mdxPath = path.join(blogDir, item.name, 'page.mdx');
        if (fs.existsSync(mdxPath)) {
          // Read the file to check if it's a paid product
          const content = fs.readFileSync(mdxPath, 'utf8');
          
          // Check if this is a paid product (a bit of a hack but works)
          if (content.includes('isPaid: true') || content.includes('"isPaid": true') || content.includes('isPaid:true')) {
            paidProducts.push(item.name);
          }
        }
      }
    }
    
    return paidProducts;
  } catch (error) {
    console.error('Error getting available product slugs:', error);
    return [];
  }
};

// Validate an email address
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Grant access to a product for an email
const grantAccess = async (email, productSlug) => {
  try {
    // First check if this combination already exists
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        email,
        contentSlug: productSlug
      }
    });

    if (existingPurchase) {
      console.log(`Access to ${productSlug} already granted for ${email}`);
      return false;
    }
    
    // Check if there's a user account with this email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Generate unique Stripe-like ID for free access
    const stripePaymentId = generateFakeStripeId();
    
    // Create a new purchase record
    const purchaseData = {
      email,
      contentType: 'article', // Assuming all products are articles for now
      contentSlug: productSlug,
      stripePaymentId,
      amount: 0, // Free access
      purchaseDate: new Date()
    };
    
    // If user exists, associate the purchase with their account
    if (user) {
      console.log(`Found user account for ${email}, associating purchase with user ID: ${user.id}`);
      purchaseData.userId = user.id;
    }

    const purchase = await prisma.purchase.create({
      data: purchaseData
    });

    console.log(`✅ Successfully granted access to ${productSlug} for ${email}`);
    console.log(`Purchase ID: ${purchase.id}`);
    return true;
  } catch (error) {
    console.error(`❌ Error granting access to ${productSlug} for ${email}:`, error);
    return false;
  }
};

// Main function to run the script
const main = async () => {
  try {
    // Set up command-line interface
    program
      .name('grant-free-access')
      .description('Grant free access to products for students or others who cannot afford them')
      .option('-e, --emails <emails>', 'Comma-separated list of emails to grant access')
      .option('-p, --product <slug>', 'Product slug to grant access to')
      .option('-l, --list-products', 'List available product slugs')
      .parse(process.argv);

    const options = program.opts();

    // Handle listing products
    if (options.listProducts) {
      console.log('Available paid product slugs:');
      const availableProductSlugs = await getAvailableProductSlugs();
      
      if (availableProductSlugs.length === 0) {
        console.log('No paid products found. Check the content directory structure.');
      } else {
        availableProductSlugs.forEach(slug => console.log(`- ${slug}`));
      }
      
      rl.close();
      return;
    }

    // Interactive mode if no arguments are provided
    if (!options.emails && !options.product) {
      console.log('No arguments provided. Running in interactive mode...');
      
      // Get email
      const email = await prompt('Enter email address: ');
      
      if (!isValidEmail(email)) {
        console.error('Invalid email address');
        rl.close();
        return;
      }
      
      // List available products
      console.log('\nAvailable paid product slugs:');
      const availableProductSlugs = await getAvailableProductSlugs();
      
      if (availableProductSlugs.length === 0) {
        console.log('No paid products found. Please enter a slug manually.');
      } else {
        availableProductSlugs.forEach((slug, index) => {
          console.log(`${index + 1}. ${slug}`);
        });
      }
      
      // Get product slug
      const productChoice = await prompt('\nSelect product (enter number or slug): ');
      
      let productSlug;
      if (/^\d+$/.test(productChoice) && availableProductSlugs.length > 0) {
        const index = parseInt(productChoice) - 1;
        if (index >= 0 && index < availableProductSlugs.length) {
          productSlug = availableProductSlugs[index];
        } else {
          console.error('Invalid product selection');
          rl.close();
          return;
        }
      } else {
        productSlug = productChoice;
      }
      
      // Validate product slug
      const isValid = await validateProductSlug(productSlug);
      if (!isValid) {
        console.error(`❌ Invalid product slug: ${productSlug}`);
        rl.close();
        return;
      }
      
      // Grant access
      await grantAccess(email, productSlug);
    } else {
      // Use command-line arguments
      const productSlug = options.product;
      
      // Validate product slug if provided
      if (productSlug) {
        const isValid = await validateProductSlug(productSlug);
        if (!isValid) {
          console.error(`❌ Invalid product slug: ${productSlug}`);
          
          const availableProductSlugs = await getAvailableProductSlugs();
          if (availableProductSlugs.length > 0) {
            console.log('Available paid product slugs:');
            availableProductSlugs.forEach(slug => console.log(`- ${slug}`));
          }
          
          rl.close();
          return;
        }
      }
      
      if (!options.emails) {
        console.error('No emails provided. Use --emails <comma-separated-emails>');
        rl.close();
        return;
      }
      
      const emails = options.emails.split(',').map(e => e.trim());
      
      // Validate each email
      const invalidEmails = emails.filter(email => !isValidEmail(email));
      if (invalidEmails.length > 0) {
        console.error('Invalid email addresses:', invalidEmails.join(', '));
        rl.close();
        return;
      }
      
      // Prompt for product slug if not provided
      let finalProductSlug = productSlug;
      if (!finalProductSlug) {
        console.log('Available paid product slugs:');
        const availableProductSlugs = await getAvailableProductSlugs();
        
        if (availableProductSlugs.length === 0) {
          console.log('No paid products found. Please enter a slug manually.');
        } else {
          availableProductSlugs.forEach((slug, index) => {
            console.log(`${index + 1}. ${slug}`);
          });
        }
        
        const productChoice = await prompt('\nSelect product (enter number or slug): ');
        
        if (/^\d+$/.test(productChoice) && availableProductSlugs.length > 0) {
          const index = parseInt(productChoice) - 1;
          if (index >= 0 && index < availableProductSlugs.length) {
            finalProductSlug = availableProductSlugs[index];
          } else {
            console.error('Invalid product selection');
            rl.close();
            return;
          }
        } else {
          finalProductSlug = productChoice;
        }
        
        const isValid = await validateProductSlug(finalProductSlug);
        if (!isValid) {
          console.error(`❌ Invalid product slug: ${finalProductSlug}`);
          rl.close();
          return;
        }
      }
      
      // Grant access to each email
      console.log(`Granting access to ${finalProductSlug} for ${emails.length} email(s)...`);
      
      let successCount = 0;
      for (const email of emails) {
        const success = await grantAccess(email, finalProductSlug);
        if (success) successCount++;
      }
      
      console.log(`✅ Successfully granted access to ${successCount} out of ${emails.length} email(s)`);
    }
  } catch (error) {
    console.error('An error occurred:', error);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
};

// Run the script
main(); 