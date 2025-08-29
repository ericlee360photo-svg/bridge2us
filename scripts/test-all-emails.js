#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing All Bridge2Us Email Functionality...\n');

async function testAllEmails() {
  const testEmail = 'ericbegley@gmail.com'; // Replace with your email for testing
  
  console.log('📧 Available Email Templates:');
  console.log('1. Welcome Email (with verification link)');
  console.log('2. Partner Invitation');
  console.log('3. Email Verification');
  console.log('4. Password Reset');
  console.log('5. Meetup Reminder');
  console.log('');

  console.log('🔧 Environment Check:');
  const hasServiceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  console.log(`   Service Account: ${hasServiceAccount ? '✅ Configured' : '❌ Missing'}`);
  console.log('');

  if (!hasServiceAccount) {
    console.log('❌ Service account not configured!');
    console.log('📝 Please set up the service account first.');
    return;
  }

  console.log('🧪 Test Commands:');
  console.log('Replace "your-email@example.com" with your actual email address\n');

  // Test 1: Welcome Email
  console.log('1. Welcome Email (with verification link):');
  console.log('curl -X POST http://localhost:3000/api/email/welcome \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log(`  -d '{"email":"${testEmail}","userName":"John","verificationLink":"https://www.bridge2us.app/verify-email?token=test123"}'`);
  console.log('');

  // Test 2: Partner Invitation
  console.log('2. Partner Invitation:');
  console.log('curl -X POST http://localhost:3000/api/email/invite \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log(`  -d '{"email":"${testEmail}","inviterName":"Sarah","invitationLink":"https://www.bridge2us.app/accept-invitation?token=invite123","inviterEmail":"sarah@example.com"}'`);
  console.log('');

  // Test 3: Email Verification
  console.log('3. Email Verification:');
  console.log('curl -X POST http://localhost:3000/api/auth/verify-email \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log(`  -d '{"email":"${testEmail}"}'`);
  console.log('');

  // Test 4: Password Reset
  console.log('4. Password Reset:');
  console.log('curl -X POST http://localhost:3000/api/auth/reset-password \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log(`  -d '{"email":"${testEmail}"}'`);
  console.log('');

  // Test 5: Meetup Reminder
  console.log('5. Meetup Reminder:');
  console.log('curl -X POST http://localhost:3000/api/email/send \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log(`  -d '{"to":"${testEmail}","subject":"Test: Meetup Reminder","text":"This is a test meetup reminder","from":"NOREPLY"}'`);
  console.log('');

  console.log('📋 Expected Results:');
  console.log('- Each email should be sent from the appropriate alias:');
  console.log('  • Welcome/Invitation: notifications@bridge2us.app');
  console.log('  • Verification/Reminders: NOREPLY@bridge2us.app');
  console.log('  • Password Reset: support@bridge2us.app');
  console.log('- All emails should have professional styling');
  console.log('- Magic links should work for verification and password reset');
  console.log('- No user interaction required (fully automated)');

  console.log('\n💡 Tips:');
  console.log('- Check your spam folder if emails don\'t arrive');
  console.log('- The verification and reset links will be real and functional');
  console.log('- All emails use your domain aliases for professional appearance');
  console.log('- The system automatically handles token generation and expiration');

  console.log('\n🎉 Email System Features:');
  console.log('✅ Domain-Wide Delegation (no user interaction)');
  console.log('✅ Multiple professional email aliases');
  console.log('✅ Beautiful HTML email templates');
  console.log('✅ Magic link verification system');
  console.log('✅ Password reset functionality');
  console.log('✅ Secure token management');
  console.log('✅ Automatic fallback to OAuth2 if needed');
}

testAllEmails();
