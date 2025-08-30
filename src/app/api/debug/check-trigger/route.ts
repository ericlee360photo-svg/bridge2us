export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    // Check if trigger exists
    const { data: triggers, error: triggerError } = await supabaseAdmin
      .rpc('exec_sql', { 
        sql: `SELECT trigger_name, event_manipulation, event_object_table 
              FROM information_schema.triggers 
              WHERE event_object_table = 'users'` 
      });

    // Check RLS policies
    const { data: policies, error: policyError } = await supabaseAdmin
      .rpc('exec_sql', { 
        sql: `SELECT schemaname, tablename, policyname, permissive, roles, cmd 
              FROM pg_policies 
              WHERE tablename = 'users'` 
      });

    // Check if RLS is enabled
    const { data: rlsStatus, error: rlsError } = await supabaseAdmin
      .rpc('exec_sql', { 
        sql: `SELECT relrowsecurity FROM pg_class WHERE relname = 'users'` 
      });

    return NextResponse.json({
      triggers: triggers || [],
      policies: policies || [],
      rlsEnabled: rlsStatus?.[0]?.relrowsecurity || false,
      errors: {
        triggerError: triggerError?.message,
        policyError: policyError?.message,
        rlsError: rlsError?.message
      }
    });

  } catch (error) {
    console.error('Error checking trigger:', error);
    return NextResponse.json({ error: 'Failed to check trigger' }, { status: 500 });
  }
}
