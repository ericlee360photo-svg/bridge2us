import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmailServer, emailTemplates } from '../../../../../lib/emailServer';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, first_name, email_verified')
      .eq('email', email)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.email_verified) {
      return NextResponse.json(
        { message: 'Email is already verified' },
        { status: 200 }
      );
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Store verification token
    const { error: tokenError } = await supabase
      .from('email_verification_tokens')
      .upsert({
        user_id: user.id,
        token: verificationToken,
        expires_at: expiresAt.toISOString()
      });

    if (tokenError) {
      console.error('Error storing verification token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create verification token' },
        { status: 500 }
      );
    }

    // Create verification link
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    // Send verification email
    const emailResult = await sendEmailServer({
      to: email,
      ...emailTemplates.emailVerification(user.first_name, verificationLink)
    });

    if (!emailResult.success) {
      console.error('Failed to send verification email:', emailResult.error);
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Verification email sent successfully',
      expiresIn: '24 hours'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      );
    }

    // Find and validate token
    const { data: tokenData, error: tokenError } = await supabase
      .from('email_verification_tokens')
      .select('user_id, expires_at')
      .eq('token', token)
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      );
    }

    // Check if token is expired
    if (new Date(tokenData.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Verification token has expired' },
        { status: 400 }
      );
    }

    // Update user email verification status
    const { error: updateError } = await supabase
      .from('users')
      .update({ email_verified: true })
      .eq('id', tokenData.user_id);

    if (updateError) {
      console.error('Error updating user verification status:', updateError);
      return NextResponse.json(
        { error: 'Failed to verify email' },
        { status: 500 }
      );
    }

    // Delete the used token
    await supabase
      .from('email_verification_tokens')
      .delete()
      .eq('token', token);

    return NextResponse.json({
      message: 'Email verified successfully',
      redirectUrl: '/dashboard'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
