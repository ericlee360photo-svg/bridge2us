import { NextRequest, NextResponse } from 'next/server';
import { sendEmailServer, emailTemplates } from '@/lib/emailServer';

export async function POST(request: NextRequest) {
  try {
    const { email, inviterName, invitationLink, inviterEmail } = await request.json();

    if (!email || !inviterName || !invitationLink) {
      return NextResponse.json(
        { error: 'Email, inviterName, and invitationLink are required' },
        { status: 400 }
      );
    }

    // Send invitation email
    const emailResult = await sendEmailServer({
      to: email,
      ...emailTemplates.partnerInvitation(inviterName, invitationLink, inviterEmail)
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
      message: 'Invitation email sent successfully'
    });

  } catch (error) {
    console.error('Invitation email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
