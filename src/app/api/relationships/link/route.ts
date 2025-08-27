import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user1Id, user2Id } = body;

    if (!user1Id || !user2Id) {
      return NextResponse.json(
        { error: 'Both user IDs are required' },
        { status: 400 }
      );
    }

    // Check if relationship already exists
    const { data: existingRelationship, error: checkError } = await supabase
      .from('relationships')
      .select('id')
      .or(`and(user1_id.eq.${user1Id},user2_id.eq.${user2Id}),and(user1_id.eq.${user2Id},user2_id.eq.${user1Id})`)
      .single();

    if (existingRelationship) {
      return NextResponse.json(
        { error: 'Relationship already exists' },
        { status: 400 }
      );
    }

    // Create relationship
    const { data: relationship, error } = await supabase
      .from('relationships')
      .insert({
        user1_id: user1Id,
        user2_id: user2Id,
        status: 'ACTIVE'
      })
      .select(`
        *,
        user1:users!relationships_user1_id_fkey(*),
        user2:users!relationships_user2_id_fkey(*)
      `)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create relationship' },
        { status: 500 }
      );
    }

    return NextResponse.json(relationship, { status: 201 });
  } catch (error) {
    console.error('Relationship linking error:', error);
    return NextResponse.json(
      { error: 'Failed to link users' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user's relationships
    const { data: relationships, error: relationshipsError } = await supabase
      .from('relationships')
      .select(`
        *,
        user1:users!relationships_user1_id_fkey(*),
        user2:users!relationships_user2_id_fkey(*)
      `)
      .or(`user1_id.eq.${userId},user2_id.eq.${userId}`)
      .eq('status', 'ACTIVE');

    if (relationshipsError) {
      console.error('Supabase error:', relationshipsError);
      return NextResponse.json(
        { error: 'Failed to fetch relationships' },
        { status: 500 }
      );
    }

    // Format response to show partner info
    const formattedRelationships = relationships.map(rel => {
      const isUser1 = rel.user1_id === userId;
      const partner = isUser1 ? rel.user2 : rel.user1;
      
      return {
        id: rel.id,
        status: rel.status,
        partner: {
          id: partner.id,
          name: `${partner.first_name} ${partner.last_name}`,
          email: partner.email,
          timezone: partner.timezone,
          calendarSyncEnabled: partner.calendar_sync_enabled,
          schedule: {
            wakeUpTime: partner.wake_up_time,
            bedTime: partner.bed_time,
            workStartTime: partner.work_start_time,
            workEndTime: partner.work_end_time,
            gymTime: partner.gym_time,
            schoolTime: partner.school_time
          }
        },
        relationshipDetails: {
          relationshipType: rel.relationship_type,
          howLongTogether: rel.how_long_together,
          communicationStyle: rel.communication_style,
          loveLanguages: rel.love_languages,
          futurePlans: rel.future_plans
        }
      };
    });

    return NextResponse.json(formattedRelationships);
  } catch (error) {
    console.error('Relationship fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch relationships' },
      { status: 500 }
    );
  }
}
