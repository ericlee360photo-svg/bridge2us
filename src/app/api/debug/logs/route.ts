export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    // Get the latest debug logs
    const { data: logs, error } = await supabaseAdmin
      .from('debug_insert_log')
      .select('*')
      .order('at', { ascending: false })
      .limit(10);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      logs,
      count: logs?.length || 0,
      message: 'Debug logs retrieved successfully'
    });

  } catch (error) {
    console.error('Error fetching debug logs:', error);
    return NextResponse.json({ error: 'Failed to fetch debug logs' }, { status: 500 });
  }
}
