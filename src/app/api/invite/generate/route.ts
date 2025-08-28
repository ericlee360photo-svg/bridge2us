import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { inviterId, inviterName, inviterEmail } = await request.json();

    if (!inviterId || !inviterName || !inviterEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Store the invitation in Supabase
    const { data, error } = await supabase
      .from('partner_invitations')
      .insert({
        invitation_token: invitationToken,
        inviter_id: inviterId,
        inviter_name: inviterName,
        inviter_email: inviterEmail,
        expires_at: expiresAt.toISOString(),
        status: 'pending'
      });

    if (error) {
      console.error('Error creating invitation:', error);
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }

    // Generate the magic link
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.bridge2us.app';
    const magicLink = `${baseUrl}/signup?invite=${invitationToken}`;

    return NextResponse.json({
      success: true,
      invitationToken,
      magicLink,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    console.error('Error generating invitation:', error);
    return NextResponse.json(
      { error: 'Failed to generate invitation' },
      { status: 500 }
    );
  }
}
