# Portfolio Scripts

## Grant Free Access Script

The `grant-free-access.js` script allows you to grant free access to paid products for students or others who can't afford to pay.

### Installation

First, ensure you have the required dependencies:

```bash
pnpm add commander
```

### Usage

The script can be run in several ways:

#### Via npm script (recommended)

```bash
# List available paid products
npm run grant-access -- -l

# Grant access to a specific product for one or more emails
npm run grant-access -- -p rag-pipeline-tutorial -e student@example.com

# Grant access to multiple emails (comma-separated)
npm run grant-access -- -p rag-pipeline-tutorial -e student1@example.com,student2@example.com
```

#### Via direct node execution

```bash
# List available paid products
node scripts/grant-free-access.js -l

# Grant access to a specific product for an email
node scripts/grant-free-access.js -p rag-pipeline-tutorial -e student@example.com

# Interactive mode (prompts for email and product)
node scripts/grant-free-access.js
```

### Running Against Production Database

To run the script against your production database (rather than your local development database), you have a few options:

#### Using the provided shell script

```bash
# Make sure the script is executable
chmod +x scripts/grant-free-access-prod.sh

# Run it with the same parameters as the regular script
./scripts/grant-free-access-prod.sh -p rag-pipeline-tutorial -e student@example.com
```

This script will attempt to read your production database URL from `.env.production` and ask for confirmation before proceeding.

#### Manually specifying the production database URL

```bash
# Replace YOUR_PRODUCTION_DB_URL with your actual production database URL
POSTGRES_URL="YOUR_PRODUCTION_DB_URL" node scripts/grant-free-access.js -p rag-pipeline-tutorial -e student@example.com
```

#### Production URL from Vercel

If you're deploying on Vercel, you can get your production database URL from the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Find the POSTGRES_URL value
4. Use that value in the command above

⚠️ **Warning**: Always be careful when running scripts against your production database!

### Options

- `-e, --emails <emails>`: Comma-separated list of emails to grant access
- `-p, --product <slug>`: Product slug to grant access to
- `-l, --list-products`: List available paid product slugs
- `-h, --help`: Display help information

### How It Works

The script scans the content directories for articles with `isPaid: true` in their metadata, which identifies them as paid products. It then creates purchase records in the database with a phony Stripe payment ID, effectively granting free access to the specified product. When the user logs in with their email, they'll have access to the product as if they had purchased it. 