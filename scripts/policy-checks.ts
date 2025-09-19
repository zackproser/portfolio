#!/usr/bin/env tsx

/**
 * Policy checks for tool manifests
 * 
 * This script runs policy checks to ensure manifests meet quality standards
 * and flag potential issues for review.
 * 
 * Usage: tsx scripts/policy-checks.ts
 */

import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import YAML from 'yaml';

interface PolicyViolation {
  file: string;
  rule: string;
  message: string;
  severity: 'warning' | 'error';
}

async function runPolicyChecks() {
  try {
    console.log('🔍 Running policy checks...\n');
    
    const manifestsDir = join(process.cwd(), 'manifests');
    const files = await readdir(manifestsDir);
    const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    
    if (yamlFiles.length === 0) {
      console.log('⚠️  No YAML manifest files found in manifests/ directory');
      return;
    }
    
    console.log(`Found ${yamlFiles.length} manifest files to check\n`);
    
    const violations: PolicyViolation[] = [];
    
    for (const file of yamlFiles) {
      try {
        console.log(`📄 Checking policies in ${file}...`);
        
        const filePath = join(manifestsDir, file);
        const content = await readFile(filePath, 'utf-8');
        const doc = YAML.parse(content);
        
        // Check policies
        const fileViolations = checkManifestPolicies(doc, file);
        violations.push(...fileViolations);
        
        if (fileViolations.length === 0) {
          console.log(`  ✅ ${file} - No policy violations`);
        } else {
          console.log(`  ⚠️  ${file} - ${fileViolations.length} policy violations`);
        }
        
      } catch (error) {
        violations.push({
          file,
          rule: 'parse_error',
          message: `Failed to parse manifest: ${error}`,
          severity: 'error'
        });
      }
    }
    
    console.log(`\n📊 Policy Check Results:`);
    
    const errors = violations.filter(v => v.severity === 'error');
    const warnings = violations.filter(v => v.severity === 'warning');
    
    console.log(`  ❌ Errors: ${errors.length}`);
    console.log(`  ⚠️  Warnings: ${warnings.length}`);
    
    if (violations.length > 0) {
      console.log(`\n📋 Policy Violations:`);
      
      violations.forEach(violation => {
        const icon = violation.severity === 'error' ? '❌' : '⚠️';
        console.log(`  ${icon} ${violation.file}: ${violation.rule}`);
        console.log(`     ${violation.message}`);
      });
      
      if (errors.length > 0) {
        console.log(`\n💥 Policy check failed due to errors!`);
        process.exit(1);
      } else {
        console.log(`\n⚠️  Policy check completed with warnings (non-blocking)`);
      }
    } else {
      console.log(`\n🎉 All manifests pass policy checks!`);
    }
    
  } catch (error) {
    console.error('❌ Policy check failed:', error);
    process.exit(1);
  }
}

function checkManifestPolicies(doc: any, filename: string): PolicyViolation[] {
  const violations: PolicyViolation[] = [];
  
  // Policy 1: Check for reasonable pricing values
  if (doc.facts?.models) {
    doc.facts.models.forEach((model: any, index: number) => {
      if (model.pricing?.input_per_1k && model.pricing.input_per_1k > 1) {
        violations.push({
          file: filename,
          rule: 'unusual_pricing',
          message: `Model ${model.name} has unusually high input pricing: $${model.pricing.input_per_1k}/1K tokens`,
          severity: 'warning'
        });
      }
      
      if (model.pricing?.output_per_1k && model.pricing.output_per_1k > 1) {
        violations.push({
          file: filename,
          rule: 'unusual_pricing',
          message: `Model ${model.name} has unusually high output pricing: $${model.pricing.output_per_1k}/1K tokens`,
          severity: 'warning'
        });
      }
    });
  }
  
  // Policy 2: Check for reasonable context window sizes
  if (doc.facts?.models) {
    doc.facts.models.forEach((model: any, index: number) => {
      if (model.context_tokens_max && model.context_tokens_max > 1000000) {
        violations.push({
          file: filename,
          rule: 'unusual_context_window',
          message: `Model ${model.name} has unusually large context window: ${model.context_tokens_max.toLocaleString()} tokens`,
          severity: 'warning'
        });
      }
    });
  }
  
  // Policy 3: Check for recent verification dates
  const asOfDate = new Date(doc.as_of);
  const now = new Date();
  const daysSinceVerification = (now.getTime() - asOfDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (daysSinceVerification > 90) {
    violations.push({
      file: filename,
      rule: 'stale_verification',
      message: `Manifest verification is ${Math.round(daysSinceVerification)} days old (${doc.as_of})`,
      severity: 'warning'
    });
  }
  
  // Policy 4: Check for missing required URLs
  if (!doc.homepage_url || doc.homepage_url === 'https://api.example.com') {
    violations.push({
      file: filename,
      rule: 'placeholder_url',
      message: 'Homepage URL appears to be a placeholder',
      severity: 'error'
    });
  }
  
  // Policy 5: Check for reasonable rate limits
  if (doc.facts?.models) {
    doc.facts.models.forEach((model: any, index: number) => {
      if (model.rate_limits?.rpm && model.rate_limits.rpm > 100000) {
        violations.push({
          file: filename,
          rule: 'unusual_rate_limits',
          message: `Model ${model.name} has unusually high RPM limit: ${model.rate_limits.rpm.toLocaleString()}`,
          severity: 'warning'
        });
      }
    });
  }
  
  // Policy 6: Check for consistent vendor information
  if (doc.facts?.vendor === 'other' && doc.name.toLowerCase().includes('openai')) {
    violations.push({
      file: filename,
      rule: 'vendor_mismatch',
      message: 'Tool appears to be OpenAI but vendor is marked as "other"',
      severity: 'warning'
    });
  }
  
  return violations;
}

// Run checks if called directly
if (require.main === module) {
  runPolicyChecks();
}

export { runPolicyChecks };
