import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        email,
        first_name,
        last_name,
        timezone,
        avatar,
        country,
        language,
        measurement_system,
        temperature_unit,
        distance_unit,
        latitude,
        longitude,
        birthday,
        wake_up_time,
        bed_time,
        work_start_time,
        work_end_time,
        gym_time,
        school_time
      `)
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...updateData } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Convert field names to snake_case for Supabase
    const supabaseData: any = {};
    Object.keys(updateData).forEach(key => {
      switch (key) {
        case 'firstName':
          supabaseData.first_name = updateData[key];
          break;
        case 'lastName':
          supabaseData.last_name = updateData[key];
          break;
        case 'measurementSystem':
          supabaseData.measurement_system = updateData[key];
          break;
        case 'temperatureUnit':
          supabaseData.temperature_unit = updateData[key];
          break;
        case 'distanceUnit':
          supabaseData.distance_unit = updateData[key];
          break;
        case 'birthday':
          supabaseData.birthday = new Date(updateData[key]).toISOString();
          break;
        case 'wakeUpTime':
          supabaseData.wake_up_time = updateData[key];
          break;
        case 'bedTime':
          supabaseData.bed_time = updateData[key];
          break;
        case 'workStartTime':
          supabaseData.work_start_time = updateData[key];
          break;
        case 'workEndTime':
          supabaseData.work_end_time = updateData[key];
          break;
        case 'gymTime':
          supabaseData.gym_time = updateData[key];
          break;
        case 'schoolTime':
          supabaseData.school_time = updateData[key];
          break;
        default:
          supabaseData[key] = updateData[key];
      }
    });

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(supabaseData)
      .eq('id', userId)
      .select(`
        id,
        email,
        first_name,
        last_name,
        timezone,
        avatar,
        country,
        language,
        measurement_system,
        temperature_unit,
        distance_unit,
        latitude,
        longitude,
        birthday
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    }

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
