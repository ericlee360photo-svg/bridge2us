import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, emailTemplates } from '../../../../../lib/email';

export async function POST(req: NextRequest) {
  try {
    const { userEmail, userName } = await req.json();

    if (!userEmail || !userName) {
      return NextResponse.json(
        { error: 'Missing userEmail or userName' },
        { status: 400 }
      );
    }

    // Send welcome email using template
    const welcomeEmail = emailTemplates.welcome(userName);
    const result = await sendEmail({
      to: userEmail,
      ...welcomeEmail
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send welcome email', details: result.error },
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
