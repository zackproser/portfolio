#!/bin/bash

# This script runs the prisma seed against the production database
# Usage: ./scripts/seed-production.sh

echo "🌱 Production Database Seeding Script"
echo "======================================"

# Check if we have the required environment file
if [ ! -f ".env.production" ]; then
  echo "❌ Error: .env.production file not found"
  echo "Please create .env.production with your production database URLs"
  exit 1
fi

# Get the production database URL (non-pooling for direct operations)
PROD_DB_URL=$(grep POSTGRES_URL_NON_POOLING .env.production | cut -d '=' -f2- | tr -d '"')

if [ -z "$PROD_DB_URL" ]; then
  echo "❌ Error: Could not find POSTGRES_URL_NON_POOLING in .env.production"
  echo "Please make sure you have POSTGRES_URL_NON_POOLING set in .env.production"
  exit 1
fi

echo "🔍 Found production database URL"
echo "⚠️  WARNING: This will modify your PRODUCTION database!"
echo "⚠️  This will DELETE all existing tools and replace them with the seed data"
echo ""
echo "Current seed data contains 25 tools:"
echo "- Anthropic Claude API, Mistral AI, Cursor, GitHub Copilot, etc."
echo ""
echo "Continue? (y/n)"
read -r confirm

if [ "$confirm" != "y" ]; then
  echo "❌ Operation cancelled"
  exit 0
fi

echo ""
echo "🚀 Running seed script against production database..."
echo "📊 This will:"
echo "   1. Delete all existing tools"
echo "   2. Insert 25 new tools from seed data"
echo "   3. Update comparison URLs to work correctly"
echo ""

# Run the seed script with the production database URL
POSTGRES_URL="$PROD_DB_URL" npm run prisma:seed

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Production database seeding completed successfully!"
  echo "🎉 Your comparison URLs should now work correctly"
  echo ""
  echo "Next steps:"
  echo "1. Test a few comparison URLs to verify they work"
  echo "2. Check that the tools are displaying correctly on your site"
  echo "3. Monitor for any issues in production"
else
  echo ""
  echo "❌ Seeding failed! Please check the error messages above"
  echo "Your production database was not modified"
  exit 1
fi 