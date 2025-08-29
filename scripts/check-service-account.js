#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Checking Google Service Account Setup...\n');

async function checkServiceAccount() {
  try {
    console.log('📋 Current Environment Status:');
    
    const hasServiceAccountEmail = !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const hasPrivateKey = !!process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    
    console.log(`✅ Service Account Email: ${hasServiceAccountEmail ? 'Configured' : '❌ Missing'}`);
    if (hasServiceAccountEmail) {
      console.log(`   📧 ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}`);
    }
    
    console.log(`✅ Private Key: ${hasPrivateKey ? 'Configured' : '❌ Missing'}`);
    
    if (!hasServiceAccountEmail || !hasPrivateKey) {
      console.log('\n❌ Service account credentials are incomplete!');
      console.log('📝 Please add these to your .env.local file:');
      console.log('');
      console.log('# Google Service Account for Domain-Wide Delegation');
      console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL=bridge2us-gmail-service@your-project-id.iam.gserviceaccount.com');
      console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
      console.log('');
      return;
    }

    console.log('\n🔑 Getting Service Account Client ID...');
    console.log('To get the correct Client ID for Google Workspace admin console:');
    console.log('');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Select your project');
    console.log('3. Navigate to: APIs & Services > Credentials');
    console.log('4. Find your service account: "bridge2us-gmail-service"');
    console.log('5. Click on it to open details');
    console.log('6. Look for "Client ID" (it will be a long number like: 123456789012345678901)');
    console.log('7. Copy this Client ID (NOT the OAuth2 client ID from your app)');
    console.log('');
    console.log('🔐 Then in Google Workspace Admin Console:');
    console.log('1. Go to: https://admin.google.com/');
    console.log('2. Navigate to: Security > API controls > Domain-wide delegation');
    console.log('3. Click "Add new"');
    console.log('4. Paste the Service Account Client ID (the long number)');
    console.log('5. Add these scopes:');
    console.log('   https://www.googleapis.com/auth/gmail.send');
    console.log('   https://www.googleapis.com/auth/gmail.settings.basic');
    console.log('6. Click "Authorize"');
    console.log('');

    // Try to extract client ID from private key if it's a full JSON
    if (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
      try {
        // Check if it's a full JSON service account key
        const keyData = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
        if (keyData.includes('"client_id"')) {
          const jsonMatch = keyData.match(/"client_id":\s*"([^"]+)"/);
          if (jsonMatch) {
            console.log('🎯 Found Client ID in service account key:');
            console.log(`   ${jsonMatch[1]}`);
            console.log('');
            console.log('📋 Use this Client ID in Google Workspace admin console!');
          }
        } else if (keyData.includes('-----BEGIN PRIVATE KEY-----')) {
          console.log('📝 You have a private key only. You need the full service account JSON to get the client_id.');
          console.log('🔍 Please download the full JSON key file from Google Cloud Console and check the "client_id" field.');
        }
      } catch (error) {
        console.log('⚠️ Could not parse service account key for client_id');
      }
    }

    console.log('🧪 Testing Service Account Connection...');
    console.log('Run this command to test if everything is working:');
    console.log('');
    console.log('curl -X POST http://localhost:3000/api/email/send \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"to":"test@example.com","subject":"Service Account Test","text":"Testing domain-wide delegation"}\'');
    console.log('');

  } catch (error) {
    console.error('❌ Check failed:', error.message);
  }
}

checkServiceAccount();
