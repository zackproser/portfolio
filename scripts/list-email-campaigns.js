#!/usr/bin/env node

// This script fetches and lists all campaigns from EmailOctopus API
// It uses the API key directly from .env to troubleshoot authentication issues

require('dotenv').config();
const chalk = require('chalk');
const axios = require('axios');

// Get API key from environment
const apiKey = process.env.EMAIL_OCTOPUS_API_KEY;

if (!apiKey) {
  console.error(chalk.red('❌ Error: EMAIL_OCTOPUS_API_KEY not found in environment'));
  console.log(chalk.yellow('Make sure you have a .env file with EMAIL_OCTOPUS_API_KEY=your_api_key'));
  process.exit(1);
}

async function listCampaigns() {
  console.log(chalk.blue('🔍 Starting EmailOctopus campaign list operation'));
  console.log(chalk.dim('API Key format check:', `${apiKey.substring(0, 4)}...${apiKey.length} characters`));
  
  // Try different auth approaches to diagnose the issue
  try {
    // Approach 1: Using Authorization header with Bearer token
    console.log(chalk.yellow('\n📋 Approach 1: Using Authorization header with Bearer token'));
    console.log(chalk.dim('Making request to:', 'https://api.emailoctopus.com/campaigns'));
    console.log(chalk.dim('Using header:', `Authorization: Bearer ${apiKey.substring(0, 4)}...`));
    
    const response1 = await axios({
      method: 'get',
      url: 'https://api.emailoctopus.com/campaigns',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    displayResults(response1.data, 'Approach 1');
    
  } catch (error1) {
    console.log(chalk.red(`❌ Approach 1 failed: ${error1.message}`));
    console.log(chalk.dim('Response status:', error1.response?.status));
    console.log(chalk.dim('Response data:', JSON.stringify(error1.response?.data, null, 2)));
    
    // Try a fallback approach
    try {
      // Approach 2: Using api_key as query parameter
      console.log(chalk.yellow('\n📋 Approach 2: Using api_key as query parameter'));
      console.log(chalk.dim('Making request to:', `https://api.emailoctopus.com/campaigns?api_key=${apiKey.substring(0, 4)}...`));
      
      const response2 = await axios({
        method: 'get',
        url: `https://api.emailoctopus.com/campaigns?api_key=${apiKey}`
      });
      
      displayResults(response2.data, 'Approach 2');
      
    } catch (error2) {
      console.log(chalk.red(`❌ Approach 2 failed: ${error2.message}`));
      console.log(chalk.dim('Response status:', error2.response?.status));
      console.log(chalk.dim('Response data:', JSON.stringify(error2.response?.data, null, 2)));
      
      // Try one more approach
      try {
        // Approach 3: Using v1.6 API endpoint with api_key
        console.log(chalk.yellow('\n📋 Approach 3: Using v1.6 API endpoint with api_key'));
        console.log(chalk.dim('Making request to:', `https://emailoctopus.com/api/1.6/campaigns?api_key=${apiKey.substring(0, 4)}...`));
        
        const response3 = await axios({
          method: 'get',
          url: `https://emailoctopus.com/api/1.6/campaigns?api_key=${apiKey}`
        });
        
        displayResults(response3.data, 'Approach 3 (v1.6 API)');
        
      } catch (error3) {
        console.log(chalk.red(`❌ Approach 3 failed: ${error3.message}`));
        console.log(chalk.dim('Response status:', error3.response?.status));
        console.log(chalk.dim('Response data:', JSON.stringify(error3.response?.data, null, 2)));
        
        console.log(chalk.red('\n❌ All API connection attempts failed'));
        process.exit(1);
      }
    }
  }
}

function displayResults(data, approachName) {
  console.log(chalk.green(`\n✅ ${approachName} succeeded!`));
  
  if (data.data && Array.isArray(data.data)) {
    console.log(chalk.blue(`\n📊 Found ${data.data.length} campaigns:`));
    
    data.data.forEach((campaign, index) => {
      console.log(chalk.cyan(`\n[${index + 1}] Campaign ${campaign.id}`));
      console.log(chalk.white(`    Subject: ${campaign.subject}`));
      console.log(chalk.white(`    Status: ${campaign.status}`));
      console.log(chalk.white(`    Created: ${campaign.createdAt || 'Unknown'}`));
      console.log(chalk.white(`    Sent: ${campaign.sentAt || 'Not sent'}`));
    });
  } else if (data.campaigns && Array.isArray(data.campaigns)) {
    // Handle v1.6 API response format
    console.log(chalk.blue(`\n📊 Found ${data.campaigns.length} campaigns:`));
    
    data.campaigns.forEach((campaign, index) => {
      console.log(chalk.cyan(`\n[${index + 1}] Campaign ${campaign.id}`));
      console.log(chalk.white(`    Subject: ${campaign.subject}`));
      console.log(chalk.white(`    Status: ${campaign.status}`));
      console.log(chalk.white(`    Created: ${campaign.created_at || 'Unknown'}`));
      console.log(chalk.white(`    Sent: ${campaign.sent_at || 'Not sent'}`));
    });
  } else {
    console.log(chalk.blue('\n📊 Response data structure:'));
    console.log(data);
  }
}

// Run the script
listCampaigns().catch(err => {
  console.error(chalk.red('Unhandled error:'), err);
  process.exit(1);
}); 