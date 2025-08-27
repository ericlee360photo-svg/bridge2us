import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch users with their relationships
    const { data: users, error } = await supabase
      .from('users')
      .select(`
        *,
        relationshipsAsUser1:relationships!relationships_user1_id_fkey(
          *,
          user2:users!relationships_user2_id_fkey(*)
        ),
        relationshipsAsUser2:relationships!relationships_user2_id_fkey(
          *,
          user1:users!relationships_user1_id_fkey(*)
        )
      `);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, firstName, lastName, timezone = 'UTC', avatar, bio } = body;

    if (!email || !firstName) {
      return NextResponse.json(
        { error: 'Email and firstName are required' },
        { status: 400 }
      );
    }

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName || '',
        timezone,
        avatar,
        bio
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
