#!/bin/bash

# This script runs the grant-free-access.js script against the production database
# Usage: ./grant-free-access-prod.sh -p product-slug -e email@example.com

# Get your production database URL from your deployment environment (Vercel, etc.)
# Using the non-pooling URL to avoid connection issues from outside Vercel's network
PROD_DB_URL=$(grep POSTGRES_URL_NON_POOLING .env.production | cut -d '=' -f2- | tr -d '"')

if [ -z "$PROD_DB_URL" ]; then
  echo "Error: Could not find non-pooling database URL in .env.production"
  echo "Please make sure you have a .env.production file with POSTGRES_URL_NON_POOLING set"
  exit 1
fi

echo "Running grant-free-access script against PRODUCTION database..."
echo "⚠️  WARNING: This will modify your production database!"
echo "Continue? (y/n)"
read -r confirm

if [ "$confirm" != "y" ]; then
  echo "Operation cancelled"
  exit 0
fi

# Run the script with the production database URL
POSTGRES_URL="$PROD_DB_URL" node scripts/grant-free-access.js "$@" 