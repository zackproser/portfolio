/**
 * Script to backfill slug fields for existing tools and vector databases
 * Run with: npx ts-node src/scripts/backfill-slugs.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function backfillSlugs() {
  console.log('Starting slug backfill...\n');

  // Backfill tool slugs
  console.log('Backfilling tool slugs...');
  const tools = await prisma.tool.findMany({
    where: { slug: null }
  });

  for (const tool of tools) {
    const slug = generateSlug(tool.name);
    try {
      await prisma.tool.update({
        where: { id: tool.id },
        data: { slug }
      });
      console.log(`  ✓ ${tool.name} -> ${slug}`);
    } catch (error) {
      // Handle duplicate slugs by appending a suffix
      const uniqueSlug = `${slug}-${tool.id.slice(-4)}`;
      await prisma.tool.update({
        where: { id: tool.id },
        data: { slug: uniqueSlug }
      });
      console.log(`  ✓ ${tool.name} -> ${uniqueSlug} (unique)`);
    }
  }
  console.log(`Updated ${tools.length} tools\n`);

  // Backfill vector database slugs
  console.log('Backfilling vector database slugs...');
  const databases = await prisma.vectorDatabase.findMany({
    where: { slug: null }
  });

  for (const db of databases) {
    const slug = generateSlug(db.name);
    try {
      await prisma.vectorDatabase.update({
        where: { id: db.id },
        data: { slug }
      });
      console.log(`  ✓ ${db.name} -> ${slug}`);
    } catch (error) {
      const uniqueSlug = `${slug}-${db.id.slice(-4)}`;
      await prisma.vectorDatabase.update({
        where: { id: db.id },
        data: { slug: uniqueSlug }
      });
      console.log(`  ✓ ${db.name} -> ${uniqueSlug} (unique)`);
    }
  }
  console.log(`Updated ${databases.length} vector databases\n`);

  console.log('Slug backfill complete!');
}

backfillSlugs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
