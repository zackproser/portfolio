#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the migrations directory
const migrationsDir = path.join(__dirname, '..', 'migrations');

// Read all migration files
const migrationFiles = fs.readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort(); // Sort to ensure migrations run in order

console.log(`Found ${migrationFiles.length} migration files`);

// Run each migration
migrationFiles.forEach(file => {
  const migrationPath = path.join(migrationsDir, file);
  const migrationSql = fs.readFileSync(migrationPath, 'utf8');
  
  console.log(`Running migration: ${file}`);
  
  try {
    // Use Vercel Postgres CLI to run the migration
    // This assumes you have the Vercel CLI installed and configured
    execSync(`echo "${migrationSql}" | vercel env pull .env.local && psql $DATABASE_URL -f -`, {
      stdio: 'inherit'
    });
    
    console.log(`Migration ${file} completed successfully`);
  } catch (error) {
    console.error(`Error running migration ${file}:`, error);
    process.exit(1);
  }
});

console.log('All migrations completed successfully'); 