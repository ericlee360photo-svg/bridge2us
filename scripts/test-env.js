#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

require('dotenv').config({ path: '.env.local' });

console.log('🔍 Testing Environment Variables...\n');

console.log('Service Account Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ? '✅ Set' : '❌ Missing');
console.log('Service Account Private Key:', process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY ? '✅ Set' : '❌ Missing');

if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
  console.log('Email:', process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
}

if (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
  console.log('Private Key Length:', process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.length, 'characters');
  console.log('Private Key Starts with:', process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY.substring(0, 50) + '...');
}

console.log('\nAll Environment Variables:');
Object.keys(process.env).filter(key => key.includes('GOOGLE')).forEach(key => {
  console.log(`${key}: ${process.env[key] ? 'Set' : 'Not Set'}`);
});
