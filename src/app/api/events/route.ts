import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let query = supabase
      .from('events')
      .select(`
        *,
        user:users(*)
      `)
      .order('start_time', { ascending: true });
    
    if (userId) {
      query = query.eq('user_id', userId);
    }
    
    if (startDate && endDate) {
      query = query
        .gte('start_time', new Date(startDate).toISOString())
        .lte('start_time', new Date(endDate).toISOString());
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch events' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, startTime, endTime, allDay, location, userId } = body;

    if (!title || !startTime || !userId) {
      return NextResponse.json(
        { error: 'Title, start time, and user ID are required' },
        { status: 400 }
      );
    }

    const { data: event, error } = await supabase
      .from('events')
      .insert({
        title,
        description,
        start_time: new Date(startTime).toISOString(),
        end_time: endTime ? new Date(endTime).toISOString() : null,
        all_day: allDay || false,
        location,
        user_id: userId
      })
      .select(`
        *,
        user:users(*)
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create event' },
        { status: 500 }
      );
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
