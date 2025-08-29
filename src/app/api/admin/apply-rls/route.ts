import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Applying RLS policies...');

    // Apply the new RLS policies using direct SQL
    const policies = [
      // Drop existing policies first
      `DROP POLICY IF EXISTS "Service role full access to users" ON users;`,
      `DROP POLICY IF EXISTS "Allow user registration" ON users;`,
      `DROP POLICY IF EXISTS "Allow service role to insert users" ON users;`,
      
      // Create new policies
      `CREATE POLICY "Service role full access to users" ON users FOR ALL TO service_role USING (true) WITH CHECK (true);`,
      `CREATE POLICY "Allow user registration" ON users FOR INSERT TO authenticated WITH CHECK (true);`,
      `CREATE POLICY "Allow service role to insert users" ON users FOR INSERT TO service_role WITH CHECK (true);`
    ];

    for (const policy of policies) {
      console.log('Executing:', policy);
      const { error } = await supabaseAdmin.rpc('exec_sql', { sql: policy });
      
      if (error) {
        console.error('Error applying policy:', error);
        return NextResponse.json({ error: `Failed to apply policy: ${error.message}` }, { status: 500 });
      }
    }

    console.log('RLS policies applied successfully!');
    return NextResponse.json({ success: true, message: 'RLS policies applied successfully' });

  } catch (error) {
    console.error('Error applying RLS policies:', error);
    return NextResponse.json({ error: 'Failed to apply RLS policies' }, { status: 500 });
  }
}
