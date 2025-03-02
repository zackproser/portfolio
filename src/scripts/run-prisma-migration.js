#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env.local
const envPath = path.join(__dirname, '..', '..', '.env.local');
if (fs.existsSync(envPath)) {
  console.log(`Loading environment variables from ${envPath}`);
  dotenv.config({ path: envPath });
} else {
  console.warn('.env.local file not found, using existing environment variables');
}

console.log('Running Prisma migrations...');

try {
  // Generate Prisma client
  console.log('Generating Prisma client...');
  execSync('npx prisma generate --env-file .env.local', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', '..')
  });
  
  // Run migrations
  console.log('Applying migrations...');
  execSync('npx prisma migrate deploy --env-file .env.local', {
    stdio: 'inherit',
    cwd: path.join(__dirname, '..', '..')
  });
  
  console.log('Migrations completed successfully');
} catch (error) {
  console.error('Error running migrations:', error);
  process.exit(1);
} 