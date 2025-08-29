import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing service role functionality...');
    
    // Test basic connection
    const { data: testData, error: testError } = await supabaseAdmin
      .from('users')
      .select('count')
      .limit(1);
    
    if (testError) {
      console.error('Service role test failed:', testError);
      return NextResponse.json({ 
        error: `Service role test failed: ${testError.message}`,
        details: testError
      }, { status: 500 });
    }

    console.log('Service role test successful:', testData);
    return NextResponse.json({ 
      success: true, 
      message: 'Service role is working',
      data: testData
    });

  } catch (error) {
    console.error('Service role test error:', error);
    return NextResponse.json({ 
      error: 'Service role test failed',
      details: error
    }, { status: 500 });
  }
}
