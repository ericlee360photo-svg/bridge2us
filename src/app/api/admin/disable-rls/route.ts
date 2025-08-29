import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    console.log('Disabling RLS on users table...');

    // Disable RLS on users table
    const { error } = await supabaseAdmin.rpc('exec_sql', { 
      sql: 'ALTER TABLE users DISABLE ROW LEVEL SECURITY;' 
    });
    
    if (error) {
      console.error('Error disabling RLS:', error);
      return NextResponse.json({ error: `Failed to disable RLS: ${error.message}` }, { status: 500 });
    }

    console.log('RLS disabled successfully on users table!');
    return NextResponse.json({ success: true, message: 'RLS disabled on users table' });

  } catch (error) {
    console.error('Error disabling RLS:', error);
    return NextResponse.json({ error: 'Failed to disable RLS' }, { status: 500 });
  }
}
