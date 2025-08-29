import { NextRequest, NextResponse } from 'next/server';
import { sendEmailServer, emailTemplates } from '../../../../../lib/emailServer';

export async function POST(request: NextRequest) {
  try {
    const { email, userName, verificationLink } = await request.json();

    if (!email || !userName) {
      return NextResponse.json(
        { error: 'Email and userName are required' },
        { status: 400 }
      );
    }

    // Send welcome email
    const emailResult = await sendEmailServer({
      to: email,
      ...emailTemplates.welcome(userName, verificationLink)
    });

    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send welcome email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Welcome email sent successfully'
    });

  } catch (error) {
    console.error('Welcome email error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
