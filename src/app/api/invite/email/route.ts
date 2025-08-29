import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmailServer, emailTemplates } from '../../../../../lib/emailServer';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const { userId, partnerEmail, senderName } = await request.json();

    if (!userId || !partnerEmail || !senderName) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, partnerEmail, senderName' },
        { status: 400 }
      );
    }

    // Generate a unique invitation token
    const invitationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    // Store the invitation in Supabase
    const { data, error } = await supabase
      .from('invitations')
      .insert({
        sender_id: userId,
        receiver_email: partnerEmail,
        token: invitationToken,
        status: 'PENDING',
        expires_at: expiresAt.toISOString()
      });

    if (error) {
      console.error('Error creating invitation:', error);
      return NextResponse.json(
        { error: 'Failed to create invitation' },
        { status: 500 }
      );
    }

    // Generate the invitation link
    const baseUrl = process.env.NEXTAUTH_URL || 'https://www.bridge2us.app';
    const invitationLink = `${baseUrl}/signup?invite=${invitationToken}`;

    // Send invitation email
    const emailResult = await sendEmailServer({
      to: partnerEmail,
      ...emailTemplates.partnerInvitation(senderName, invitationLink)
    });

    if (!emailResult.success) {
      console.error('Failed to send invitation email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send invitation email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation email sent successfully',
      invitationToken,
      invitationLink
    });

  } catch (error) {
    console.error('Invitation email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
