/* eslint-disable @typescript-eslint/no-require-imports */
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorage() {
  try {
    console.log('Setting up Supabase Storage...');

    // Create avatars bucket if it doesn't exist
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }

    const avatarsBucket = buckets.find(bucket => bucket.name === 'avatars');
    
    if (!avatarsBucket) {
      console.log('Creating avatars bucket...');
      const { error } = await supabase.storage.createBucket('avatars', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        fileSizeLimit: 5242880 // 5MB
      });

      if (error) {
        console.error('Error creating bucket:', error);
        return;
      }

      console.log('✅ Avatars bucket created successfully');
    } else {
      console.log('✅ Avatars bucket already exists');
    }

    // Set up bucket policies for public access
    console.log('Setting up bucket policies...');
    
    // Note: Storage policies need to be set up manually in Supabase Dashboard
    // Go to Storage > Policies and add these policies:
    console.log('📝 Manual setup required:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to Storage > Policies');
    console.log('3. Add policy for "avatars" bucket:');
    console.log('   - Name: "Allow authenticated uploads"');
    console.log('   - Operation: INSERT');
    console.log('   - Role: authenticated');
    console.log('4. Add policy for "avatars" bucket:');
    console.log('   - Name: "Allow public read access"');
    console.log('   - Operation: SELECT');
    console.log('   - Role: anon');
    console.log('');
    console.log('✅ Bucket created successfully!');
    console.log('⚠️  Please set up policies manually in Supabase Dashboard');

    console.log('🎉 Supabase Storage setup complete!');
    console.log('You can now upload avatar images to the "avatars" bucket.');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupStorage();
