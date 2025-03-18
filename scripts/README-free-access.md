# Testing Free Access for Manually Provisioned Users

This document describes how to test that manually provisioned free access is working correctly in your production environment without requiring the end user to log in multiple times.

## Overview of Changes

We've made these changes to fix the issue with free access:

1. Updated the `checkout-sessions` API endpoint to handle manual provisions
2. Modified the `grant-free-access.js` script to use a clear `free_access_` prefix 
3. Improved error handling throughout the authentication flow

## Verifying Changes Before User Login

Before asking your user to log in again, you can verify that the changes are working by running the `verify-free-access.js` script:

```bash
# Make the script executable
chmod +x scripts/verify-free-access.js

# Run it with the user's email and the product slug
node scripts/verify-free-access.js user@example.com rag-pipeline-tutorial
```

This will check if the user has a valid purchase record and whether they should be able to access the content.

## Testing Process for Production

1. **Verify Purchase Record**: Run the `verify-free-access.js` script to check if the user has a valid purchase record.

2. **Monitor Logs After Deployment**: After deploying, watch your logs for "Could not retrieve Stripe session, checking for manual provision" messages when the user logs in.

3. **Staged Testing**: You can create a test user with the `grant-free-access.js` script and verify the flow works before trying with the actual user.

4. **Step-by-Step Debugging with the User**: If needed, here's a step-by-step troubleshooting process:

   a. Ask the user to log in
   b. Check the logs for any errors during the checkout session retrieval
   c. If there are errors, verify the purchase record again
   d. If needed, run the `grant-free-access.js` script again to recreate the purchase record

## Sample Test Workflow

```bash
# First, verify the user's access
node scripts/verify-free-access.js user@example.com rag-pipeline-tutorial

# If no access is found, grant access
node scripts/grant-free-access.js -e user@example.com -p rag-pipeline-tutorial

# Verify access again
node scripts/verify-free-access.js user@example.com rag-pipeline-tutorial

# Deploy your changes
git push

# Ask the user to try logging in
# Check logs for "Could not retrieve Stripe session, checking for manual provision"
```

## Common Issues and Solutions

- **User Not Found**: Make sure you're using the exact email address they use to log in
- **Product Slug Mismatch**: Double-check the product slug is correct (matches URL/database)
- **Stripe Error Persists**: If the Stripe error persists, check for incorrect URL formatting in the client
- **Database Access**: Ensure your scripts have proper access to the production database

## Need Help?

If you encounter issues, collect the following information for troubleshooting:

1. Output from the `verify-free-access.js` script
2. Server logs showing the checkout session retrieval
3. The specific product slug and user email being used 