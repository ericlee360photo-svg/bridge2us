const { google } = require('googleapis');
require('dotenv').config({ path: '.env.local' });

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

async function setupGmail() {
  try {
    console.log('🔧 Setting up Gmail API for Bridge2Us...\n');

    // Check if required environment variables are set
    const requiredEnvVars = [
      'GMAIL_CLIENT_ID',
      'GMAIL_CLIENT_SECRET', 
      'GMAIL_REDIRECT_URI'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Missing required environment variables:');
      missingVars.forEach(varName => console.log(`   - ${varName}`));
      console.log('\n📝 Please add these to your .env.local file:');
      console.log('GMAIL_CLIENT_ID=your_gmail_client_id_here');
      console.log('GMAIL_CLIENT_SECRET=your_gmail_client_secret_here');
      console.log('GMAIL_REDIRECT_URI=http://localhost:3000/api/auth/gmail/callback');
      console.log('\n🔗 Get these from: https://console.cloud.google.com/apis/credentials');
      console.log('📧 Create a separate OAuth 2.0 client for Gmail API access');
      return;
    }

    console.log('✅ Environment variables found');
    console.log('📧 Gmail API will be used for sending emails from admin@bridge2us.app');

    // Generate authorization URL for getting refresh token
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/gmail.send',
        'https://www.googleapis.com/auth/gmail.readonly',
        'https://www.googleapis.com/auth/gmail.modify'
      ],
      prompt: 'consent' // Force consent to get refresh token
    });

    console.log('\n🔐 To complete setup, you need to:');
    console.log('1. Visit this URL to authorize Gmail access:');
    console.log(`   ${authUrl}`);
    console.log('\n2. After authorization, you\'ll get a code. Use it to get a refresh token:');
    console.log('   curl -X POST "https://oauth2.googleapis.com/token" \\');
    console.log('     -d "client_id=YOUR_GMAIL_CLIENT_ID" \\');
    console.log('     -d "client_secret=YOUR_GMAIL_CLIENT_SECRET" \\');
    console.log('     -d "code=AUTHORIZATION_CODE" \\');
    console.log('     -d "grant_type=authorization_code" \\');
    console.log('     -d "redirect_uri=YOUR_GMAIL_REDIRECT_URI"');
    console.log('\n3. Add the refresh token to your .env.local:');
    console.log('   GMAIL_REFRESH_TOKEN=your_gmail_refresh_token_here');
    console.log('\n4. Set up your Gmail alias:');
    console.log('   - Go to Gmail Settings > Accounts and Import');
    console.log('   - Add "admin@bridge2us.app" as a "Send mail as" address');
    console.log('   - Verify the alias by clicking the verification link sent to admin@bridge2us.app');

    console.log('\n📋 Email templates available:');
    console.log('   - Welcome emails');
    console.log('   - Partner invitations');
    console.log('   - Meetup reminders');
    console.log('\n🎉 Gmail setup instructions complete!');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  }
}

setupGmail();
