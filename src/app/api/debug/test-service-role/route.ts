export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function GET() {
  try {
    console.log('Testing service role...');
    console.log('Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('Service role key length:', process.env.SUPABASE_SERVICE_ROLE_KEY?.length);
    
    // Test basic connection
    const { data: testData, error: testError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Service role test failed:', testError);
      return NextResponse.json({ 
        error: `Service role test failed: ${testError.message}`,
        details: testError,
        envCheck: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length
        }
      }, { status: 500 });
    }

    // Test insert into debug table
    const { data: debugData, error: debugError } = await supabaseAdmin
      .from('debug_insert_log')
      .insert({
        role: 'service_role_test',
        uid: null,
        note: 'testing service role access'
      })
      .select();

    console.log('Service role test results:', { testData, debugData, debugError });

    return NextResponse.json({ 
      success: true, 
      message: 'Service role is working',
      testData,
      debugData,
      debugError: debugError?.message,
      envCheck: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length
      }
    });

  } catch (error) {
    console.error('Service role test error:', error);
    return NextResponse.json({ 
      error: 'Service role test failed',
      details: error,
      envCheck: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length
      }
    }, { status: 500 });
  }
}
