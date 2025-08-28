# Bridge2Us - Prisma to Supabase Migration

## ✅ Completed Tasks

- [x] Removed Prisma dependencies
- [x] Installed Supabase client (@supabase/supabase-js, @supabase/ssr)
- [x] Created Supabase client configuration (src/lib/supabase.ts)
- [x] Created TypeScript types (src/lib/database.types.ts)
- [x] Updated all API routes to use Supabase
- [x] Environment variables are already configured

## 🔧 Manual Steps Required

### 1. Create Database Schema in Supabase

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/nuthyrydfkbduuvzulyp
2. Navigate to **SQL Editor** (left sidebar)
3. Copy the contents of `supabase-migration/schema.sql`
4. Paste and **Run** the SQL to create all tables

### 2. Update Environment Variables for Production

Copy these variables from `.env.local` to your Vercel dashboard:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://your-production-domain.com
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### 3. Test the Migration

Run these commands to test:

```bash
npm run dev
```

Dev test URLs:
- http://localhost:3000 (local only)

Prod test URLs:
- http://www.bridge2us.app
- http://www.bridge2us.app/signup
- http://www.bridge2us.app/dashboard

## 📊 Database Schema Changes

### Field Name Mapping (Prisma → Supabase)

| Prisma Field | Supabase Field |
|--------------|----------------|
| firstName | first_name |
| lastName | last_name |
| isAddressPublic | is_address_public |
| wakeUpTime | wake_up_time |
| bedTime | bed_time |
| workStartTime | work_start_time |
| workEndTime | work_end_time |
| gymTime | gym_time |
| schoolTime | school_time |
| googleCalendarId | google_calendar_id |
| outlookCalendarId | outlook_calendar_id |
| appleCalendarId | apple_calendar_id |
| calendarSyncEnabled | calendar_sync_enabled |
| measurementSystem | measurement_system |
| temperatureUnit | temperature_unit |
| distanceUnit | distance_unit |
| emailVerified | email_verified |
| emailVerificationToken | email_verification_token |
| emailVerificationExpires | email_verification_expires |

### ID Changes

- **Prisma**: Used `cuid()` for IDs
- **Supabase**: Uses `uuid_generate_v4()` for IDs

## 🔍 Files Changed

### New Files
- `src/lib/supabase.ts` - Supabase client configuration
- `src/lib/database.types.ts` - TypeScript types for Supabase
- `supabase-migration/schema.sql` - Database schema
- `supabase-migration/env.supabase.template` - Environment template

### Updated Files
- `src/app/api/users/route.ts`
- `src/app/api/auth/signup/route.ts`
- `src/app/api/meetups/route.ts`
- `src/app/api/events/route.ts`
- `src/app/api/user/profile/route.ts`
- `src/app/api/relationships/link/route.ts`
- `src/app/api/calendar/sync/route.ts`
- `src/lib/auth.ts` (removed Prisma adapter)
- `src/lib/storage.ts` (updated import)
- `package.json` (dependencies updated)

### Deleted Files
- `prisma/` directory
- `src/lib/prisma.ts`

## 🐛 Potential Issues

1. **Field name mismatches**: All camelCase fields are now snake_case
2. **Date formats**: Ensure dates are properly converted to ISO strings
3. **Relations**: Supabase uses different syntax for joining tables
4. **Authentication**: May need to update NextAuth.js configuration

## 🎯 Next Actions

1. Run the SQL schema in Supabase
2. Test all API endpoints
3. Update any remaining localStorage usage
4. Deploy to Vercel with updated environment variables
