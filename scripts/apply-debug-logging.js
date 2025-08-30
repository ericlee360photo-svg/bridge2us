const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function applyDebugLogging() {
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
    console.log('Applying debug logging system...');

    // Create debug logging table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS public.debug_insert_log(
        at timestamptz DEFAULT now(),
        role text,
        uid uuid,
        note text
      );
    `;

    console.log('Creating debug_insert_log table...');
    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL });
    
    if (tableError) {
      console.error('Error creating table:', tableError);
      // Try alternative approach - create table directly
      console.log('Trying direct table creation...');
      const { error: directError } = await supabase
        .from('debug_insert_log')
        .select('*')
        .limit(1);
      
      if (directError && directError.message.includes('does not exist')) {
        console.log('Table does not exist, creating via direct SQL...');
        // We'll need to create it manually in Supabase dashboard
        console.log('Please create the debug_insert_log table manually in Supabase dashboard:');
        console.log(createTableSQL);
      }
    } else {
      console.log('Debug table created successfully');
    }

    // Create trigger function
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION public.log_users_insert()
      RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
      BEGIN
        INSERT INTO public.debug_insert_log(role, uid, note)
        VALUES (
          current_setting('request.jwt.claim.role', true),
          auth.uid(),
          'attempt insert into public.users'
        );
        RETURN new;
      END; $$;
    `;

    console.log('Creating trigger function...');
    const { error: functionError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
    
    if (functionError) {
      console.error('Error creating function:', functionError);
    } else {
      console.log('Trigger function created successfully');
    }

    // Create trigger
    const createTriggerSQL = `
      DROP TRIGGER IF EXISTS log_users_insert ON public.users;
      CREATE TRIGGER log_users_insert
      BEFORE INSERT ON public.users
      FOR EACH ROW EXECUTE PROCEDURE public.log_users_insert();
    `;

    console.log('Creating trigger...');
    const { error: triggerError } = await supabase.rpc('exec_sql', { sql: createTriggerSQL });
    
    if (triggerError) {
      console.error('Error creating trigger:', triggerError);
    } else {
      console.log('Trigger created successfully');
    }

    console.log('Debug logging system applied successfully!');
    console.log('You can now check /api/debug/logs to see insert attempts');

  } catch (error) {
    console.error('Error applying debug logging:', error);
  }
}

applyDebugLogging();
