#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

require('dotenv').config({ path: '.env.local' });

console.log('🔧 Setting up Google Workspace Domain-Wide Delegation for Bridge2Us...\n');

async function setupServiceAccount() {
  try {
    console.log('📋 Prerequisites:');
    console.log('1. You must be a Google Workspace admin for bridge2us.app');
    console.log('2. You need access to Google Cloud Console');
    console.log('3. The domain bridge2us.app must be verified in Google Cloud Console\n');

    console.log('🚀 Step 1: Create Service Account in Google Cloud Console');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Select your project (or create one for Bridge2Us)');
    console.log('3. Navigate to: APIs & Services > Credentials');
    console.log('4. Click "Create Credentials" > "Service Account"');
    console.log('5. Fill in the details:');
    console.log('   - Service account name: bridge2us-gmail-service');
    console.log('   - Service account ID: bridge2us-gmail-service');
    console.log('   - Description: Service account for Bridge2Us email sending');
    console.log('6. Click "Create and Continue"');
    console.log('7. Skip role assignment (we\'ll use domain-wide delegation)');
    console.log('8. Click "Done"\n');

    console.log('🔑 Step 2: Generate Service Account Key');
    console.log('1. In the service account list, click on "bridge2us-gmail-service"');
    console.log('2. Go to the "Keys" tab');
    console.log('3. Click "Add Key" > "Create new key"');
    console.log('4. Choose "JSON" format');
    console.log('5. Click "Create" - this will download a JSON file');
    console.log('6. Copy the contents of this JSON file - you\'ll need it for the environment variables\n');

    console.log('🌐 Step 3: Enable Domain-Wide Delegation');
    console.log('1. In the service account details, click "Show Domain-wide Delegation"');
    console.log('2. Check "Enable Google Workspace Domain-wide Delegation"');
    console.log('3. Click "Save"\n');

    console.log('🔐 Step 4: Grant Domain-Wide Delegation in Google Workspace Admin Console');
    console.log('1. Go to: https://admin.google.com/');
    console.log('2. Navigate to: Security > API controls > Domain-wide delegation');
    console.log('3. Click "Add new"');
    console.log('4. Enter the Client ID from your service account (found in the JSON file)');
    console.log('5. Add these OAuth scopes:');
    console.log('   https://www.googleapis.com/auth/gmail.send');
    console.log('   https://www.googleapis.com/auth/gmail.settings.basic');
    console.log('6. Click "Authorize"\n');

    console.log('📧 Step 5: Set up Gmail Send-As Alias');
    console.log('1. Go to Gmail: https://mail.google.com/');
    console.log('2. Sign in as admin@bridge2us.app');
    console.log('3. Go to Settings > Accounts and Import');
    console.log('4. In "Send mail as" section, click "Add another email address"');
    console.log('5. Enter: admin@bridge2us.app');
    console.log('6. Check "Treat as an alias"');
    console.log('7. Click "Next Step"');
    console.log('8. Click "Send verification email"');
    console.log('9. Check admin@bridge2us.app inbox and click the verification link\n');

    console.log('⚙️ Step 6: Configure Environment Variables');
    console.log('Add these to your .env.local file:');
    console.log('');
    console.log('# Google Service Account for Domain-Wide Delegation');
    console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL=bridge2us-gmail-service@your-project-id.iam.gserviceaccount.com');
    console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
    console.log('');

    // Check if service account credentials are already configured
    const hasServiceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    
    if (hasServiceAccount) {
      console.log('✅ Service account credentials found in environment!');
      console.log('📧 Email: ' + process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
      console.log('🔑 Private key: ' + (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ? 'Configured' : 'Missing'));
    } else {
      console.log('❌ Service account credentials not found in environment');
      console.log('📝 Please add the environment variables shown above');
    }

    console.log('\n🧪 Step 7: Test the Setup');
    console.log('Run this command to test email sending:');
    console.log('curl -X POST http://localhost:3000/api/email/send \\');
    console.log('  -H "Content-Type: application/json" \\');
    console.log('  -d \'{"to":"test@example.com","subject":"Test Email","text":"This is a test email from Bridge2Us service account"}\'');

    console.log('\n📚 Additional Notes:');
    console.log('- The service account will impersonate admin@bridge2us.app');
    console.log('- No user interaction required for sending emails');
    console.log('- Perfect for automated emails, cron jobs, and background tasks');
    console.log('- The system will fall back to OAuth2 if service account fails');
    console.log('- Make sure to keep the private key secure and never commit it to version control');

    console.log('\n🎉 Domain-Wide Delegation setup instructions complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupServiceAccount();
