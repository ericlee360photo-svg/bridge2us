#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');

console.log('🔍 Service Account Client ID Extractor\n');

function extractClientId() {
  try {
    // Check if service account JSON file exists
    const possiblePaths = [
      './service-account-key.json',
      './bridge2us-gmail-service.json',
      './google-service-account.json'
    ];

    let jsonFilePath = null;
    for (const filePath of possiblePaths) {
      if (fs.existsSync(filePath)) {
        jsonFilePath = filePath;
        break;
      }
    }

    if (!jsonFilePath) {
      console.log('❌ No service account JSON file found!');
      console.log('');
      console.log('📁 Please place your service account JSON key file in the project root with one of these names:');
      console.log('   - service-account-key.json');
      console.log('   - bridge2us-gmail-service.json');
      console.log('   - google-service-account.json');
      console.log('');
      console.log('📥 Download the JSON key file from:');
      console.log('   https://console.cloud.google.com/apis/credentials');
      console.log('   → Find your service account → Keys → Download JSON');
      return;
    }

    console.log(`✅ Found service account file: ${jsonFilePath}`);
    
    const jsonContent = fs.readFileSync(jsonFilePath, 'utf8');
    const serviceAccount = JSON.parse(jsonContent);

    console.log('\n🎯 Service Account Details:');
    console.log(`📧 Email: ${serviceAccount.client_email}`);
    console.log(`🆔 Client ID: ${serviceAccount.client_id}`);
    console.log(`📋 Project ID: ${serviceAccount.project_id}`);
    
    console.log('\n🔐 For Google Workspace Admin Console:');
    console.log('1. Go to: https://admin.google.com/');
    console.log('2. Navigate to: Security > API controls > Domain-wide delegation');
    console.log('3. Click "Add new"');
    console.log(`4. Enter this Client ID: ${serviceAccount.client_id}`);
    console.log('5. Add these scopes:');
    console.log('   https://www.googleapis.com/auth/gmail.send');
    console.log('   https://www.googleapis.com/auth/gmail.settings.basic');
    console.log('6. Click "Authorize"');
    
    console.log('\n⚙️ Environment Variables to add to .env.local:');
    console.log('');
    console.log('# Google Service Account for Domain-Wide Delegation');
    console.log(`GOOGLE_SERVICE_ACCOUNT_EMAIL=${serviceAccount.client_email}`);
    console.log(`GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="${serviceAccount.private_key.replace(/\n/g, '\\n')}"`);
    console.log('');

    // Also show the full JSON for easy copying
    console.log('📄 Full Service Account JSON (for reference):');
    console.log(JSON.stringify(serviceAccount, null, 2));

  } catch (error) {
    console.error('❌ Error reading service account file:', error.message);
    console.log('');
    console.log('💡 Make sure the JSON file is valid and contains the service account credentials.');
  }
}

extractClientId();
