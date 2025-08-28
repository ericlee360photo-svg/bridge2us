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
      const { data, error } = await supabase.storage.createBucket('avatars', {
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
    
    // Policy to allow authenticated users to upload
    const { error: uploadPolicyError } = await supabase.storage
      .from('avatars')
      .createPolicy('Allow authenticated uploads', {
        name: 'Allow authenticated uploads',
        definition: {
          role: 'authenticated',
          operation: 'INSERT'
        }
      });

    if (uploadPolicyError && !uploadPolicyError.message.includes('already exists')) {
      console.error('Error creating upload policy:', uploadPolicyError);
    } else {
      console.log('✅ Upload policy set');
    }

    // Policy to allow public read access
    const { error: readPolicyError } = await supabase.storage
      .from('avatars')
      .createPolicy('Allow public read access', {
        name: 'Allow public read access',
        definition: {
          role: 'anon',
          operation: 'SELECT'
        }
      });

    if (readPolicyError && !readPolicyError.message.includes('already exists')) {
      console.error('Error creating read policy:', readPolicyError);
    } else {
      console.log('✅ Read policy set');
    }

    console.log('🎉 Supabase Storage setup complete!');
    console.log('You can now upload avatar images to the "avatars" bucket.');

  } catch (error) {
    console.error('Setup failed:', error);
  }
}

setupStorage();
