#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

console.log('Setting up environment variables...')

const fs = require('fs')
const path = require('path')

const envLocalPath = path.join(__dirname, '..', '.env.local')

const defaults = `NEXTAUTH_URL=http://www.bridge2us.app
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
`

if (!fs.existsSync(envLocalPath)) {
  fs.writeFileSync(envLocalPath, defaults)
  console.log('.env.local created with defaults')
} else {
  console.log('.env.local already exists; not overwriting')
}
