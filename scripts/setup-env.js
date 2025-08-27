#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

const envTemplate = `# Environment Configuration Template
# Copy this file to .env.local and fill in your values

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Database
DATABASE_URL="file:./dev.db"

# OpenWeather API Key (optional - for weather features)
NEXT_PUBLIC_OPENWEATHER_API_KEY=your-openweather-api-key-here

# Socket.io Server URL (for video calls)
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Production Configuration (update these for production)
# NEXTAUTH_URL=https://yourdomain.com
# DATABASE_URL="your-production-database-url"
# NEXT_PUBLIC_SOCKET_URL=https://your-socket-server.com
`;

const envPath = path.join(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.example file');
  console.log('📝 Copy .env.example to .env.local and fill in your values');
} else {
  console.log('ℹ️  .env.example already exists');
}

console.log('\n🔐 Security Notes:');
console.log('- Never commit .env.local to version control');
console.log('- Use different credentials for development and production');
console.log('- Generate a new NEXTAUTH_SECRET for production');
console.log('- Update NEXTAUTH_URL for production deployment');
