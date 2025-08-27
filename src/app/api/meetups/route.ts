import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: meetups, error } = await supabase
      .from('meetups')
      .select(`
        *,
        user1:users!meetups_user1_id_fkey(*),
        user2:users!meetups_user2_id_fkey(*)
      `)
      .order('start_date', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch meetups' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(meetups);
  } catch (error) {
    console.error('Error fetching meetups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, location, user1Id, user2Id } = body;

    if (!title || !startDate || !user1Id || !user2Id) {
      return NextResponse.json(
        { error: 'Title, start date, and both user IDs are required' },
        { status: 400 }
      );
    }

    const { data: meetup, error } = await supabase
      .from('meetups')
      .insert({
        title,
        description,
        start_date: new Date(startDate).toISOString(),
        end_date: endDate ? new Date(endDate).toISOString() : null,
        location,
        user1_id: user1Id,
        user2_id: user2Id
      })
      .select(`
        *,
        user1:users!meetups_user1_id_fkey(*),
        user2:users!meetups_user2_id_fkey(*)
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create meetup' },
        { status: 500 }
      );
    }

    return NextResponse.json(meetup, { status: 201 });
  } catch (error) {
    console.error('Error creating meetup:', error);
    return NextResponse.json(
      { error: 'Failed to create meetup' },
      { status: 500 }
    );
  }
}
