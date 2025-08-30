const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function applyRLSPolicies() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing required environment variables');
    console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
    console.log('SUPABASE_SERVICE_ROLE_KEY:', !!serviceRoleKey);
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  try {
    console.log('Applying RLS policies...');

    // Apply the new RLS policies
    const policies = [
      // Allow service role full access to users table
      `CREATE POLICY IF NOT EXISTS "Service role full access to users" ON users FOR ALL TO service_role USING (true) WITH CHECK (true);`,
      
      // Allow user registration for authenticated users
      `CREATE POLICY IF NOT EXISTS "Allow user registration" ON users FOR INSERT TO authenticated WITH CHECK (true);`,
      
      // Allow service role to insert users
      `CREATE POLICY IF NOT EXISTS "Allow service role to insert users" ON users FOR INSERT TO service_role WITH CHECK (true);`
    ];

    for (const policy of policies) {
      console.log('Executing:', policy);
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      
      if (error) {
        console.error('Error applying policy:', error);
      } else {
        console.log('Policy applied successfully');
      }
    }

    console.log('RLS policies applied successfully!');
  } catch (error) {
    console.error('Error applying RLS policies:', error);
  }
}

applyRLSPolicies();
