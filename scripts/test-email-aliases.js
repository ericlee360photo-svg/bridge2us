#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

require('dotenv').config({ path: '.env.local' });

console.log('🧪 Testing Email Aliases for Bridge2Us...\n');

async function testEmailAliases() {
  try {
    const testEmails = [
      {
        name: 'Welcome Email (NOTIFICATIONS)',
        data: {
          to: 'test@example.com',
          subject: 'Test: Welcome Email from Bridge2Us',
          text: 'This is a test welcome email sent from notifications@bridge2us.app',
          from: 'NOTIFICATIONS'
        }
      },
      {
        name: 'Meetup Reminder (NOREPLY)',
        data: {
          to: 'test@example.com',
          subject: 'Test: Meetup Reminder from Bridge2Us',
          text: 'This is a test meetup reminder sent from NOREPLY@bridge2us.app',
          from: 'NOREPLY'
        }
      },
      {
        name: 'Support Email (SUPPORT)',
        data: {
          to: 'test@example.com',
          subject: 'Test: Support Email from Bridge2Us',
          text: 'This is a test support email sent from support@bridge2us.app',
          from: 'SUPPORT'
        }
      },
      {
        name: 'Admin Email (ADMIN)',
        data: {
          to: 'test@example.com',
          subject: 'Test: Admin Email from Bridge2Us',
          text: 'This is a test admin email sent from admin@bridge2us.app',
          from: 'ADMIN'
        }
      }
    ];

    console.log('📧 Available Email Aliases:');
    console.log('   - NOREPLY@bridge2us.app (for automated emails)');
    console.log('   - notifications@bridge2us.app (for user notifications)');
    console.log('   - support@bridge2us.app (for support emails)');
    console.log('   - admin@bridge2us.app (for admin communications)');
    console.log('');

    console.log('🔧 Environment Check:');
    const hasServiceAccount = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
    console.log(`   Service Account: ${hasServiceAccount ? '✅ Configured' : '❌ Missing'}`);
    
    if (!hasServiceAccount) {
      console.log('\n❌ Service account not configured!');
      console.log('📝 Please add these to your .env.local file:');
      console.log('GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com');
      console.log('GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"');
      return;
    }

    console.log('\n🧪 Test Commands:');
    console.log('Run these commands to test each alias:');
    console.log('');

    testEmails.forEach((test, index) => {
      console.log(`${index + 1}. ${test.name}:`);
      console.log('curl -X POST http://localhost:3000/api/email/send \\');
      console.log('  -H "Content-Type: application/json" \\');
      console.log(`  -d '${JSON.stringify(test.data)}'`);
      console.log('');
    });

    console.log('📋 Expected Results:');
    console.log('- Each email should be sent from the appropriate alias');
    console.log('- Reply-To should default to support@bridge2us.app');
    console.log('- Service account should impersonate admin@bridge2us.app');
    console.log('- No user interaction required (fully automated)');

    console.log('\n💡 Tips:');
    console.log('- Replace "test@example.com" with your actual email for testing');
    console.log('- Check your spam folder if emails don\'t arrive');
    console.log('- Verify all aliases are properly configured in Gmail');
    console.log('- Make sure domain-wide delegation is set up correctly');

  } catch (error) {
    console.error('❌ Test setup failed:', error.message);
  }
}

testEmailAliases();
