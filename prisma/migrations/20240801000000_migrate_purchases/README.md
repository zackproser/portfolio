# Purchase Data Migration

This migration inserts purchase records from the old database schema into the new Prisma schema.

## What This Migration Does

1. Migrates article purchases from the `articlepurchases` table to the new unified `purchases` table
2. Migrates course enrollments from the `courseenrollments` table to the new `courseenrollments` table
3. Preserves all purchase data including:
   - User associations
   - Purchase dates
   - Stripe payment IDs
   - Purchase amounts
   - Content types and slugs

## Prerequisites

Before running this migration, ensure that:

1. The Prisma schema has been deployed to the production database
2. User records have been migrated with their IDs preserved
3. Course records have been migrated with their IDs preserved

## How to Apply This Migration

This migration will be applied automatically when you run:

```bash
npm run migrate:purchases
# or directly
npx prisma migrate deploy
```

## Verification

After applying the migration, verify that the data was correctly migrated by running:

```bash
npm run verify:purchases
# or directly
node scripts/verify-purchase-migration.js
```

This will check:
1. All article purchases have been migrated to the `purchases` table with `contentType = 'article'`
2. All course enrollments have been migrated to the `courseenrollments` table
3. User associations are correct

## Rollback

If you need to roll back this migration, you can use:

```bash
npx prisma migrate resolve --rolled-back 20240801000000_migrate_purchases
```

Then manually delete the inserted records if necessary. 