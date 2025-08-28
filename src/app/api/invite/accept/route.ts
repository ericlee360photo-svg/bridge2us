import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { invitationToken, inviteeId, inviteeName, inviteeEmail } = await request.json();

    if (!invitationToken || !inviteeId || !inviteeName || !inviteeEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Find the invitation
    const { data: invitation, error: invitationError } = await supabase
      .from('partner_invitations')
      .select('*')
      .eq('invitation_token', invitationToken)
      .eq('status', 'pending')
      .single();

    if (invitationError || !invitation) {
      return NextResponse.json(
        { error: 'Invalid or expired invitation' },
        { status: 400 }
      );
    }

    // Check if invitation has expired
    if (new Date(invitation.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Invitation has expired' },
        { status: 400 }
      );
    }

    // Create the partnership
    const { data: partnership, error: partnershipError } = await supabase
      .from('partnerships')
      .insert({
        user1_id: invitation.inviter_id,
        user2_id: inviteeId,
        user1_name: invitation.inviter_name,
        user2_name: inviteeName,
        user1_email: invitation.inviter_email,
        user2_email: inviteeEmail,
        status: 'active',
        created_at: new Date().toISOString()
      });

    if (partnershipError) {
      console.error('Error creating partnership:', partnershipError);
      return NextResponse.json(
        { error: 'Failed to create partnership' },
        { status: 500 }
      );
    }

    // Update invitation status
    await supabase
      .from('partner_invitations')
      .update({ status: 'accepted' })
      .eq('invitation_token', invitationToken);

    return NextResponse.json({
      success: true,
      partnership,
      message: 'Partnership created successfully'
    });

  } catch (error) {
    console.error('Error accepting invitation:', error);
    return NextResponse.json(
      { error: 'Failed to accept invitation' },
      { status: 500 }
    );
  }
}
