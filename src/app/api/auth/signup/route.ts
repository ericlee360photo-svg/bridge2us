export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Received signup request with body:', body);
    
    const {
      email,
      password,
      firstName,
      lastName,
      gender,
      birthday,
      address,
      city,
      state,
      country,
      isAddressPublic,
      timezone,
      language,
      wakeUpTime,
      bedTime,
      workStartTime,
      workEndTime,
      gymTime,
      schoolTime,
      timeFormat,
      measurementSystem,
      temperatureUnit,
      distanceUnit,
      interests,
      relationshipType,
      howLongTogether,
      communicationStyle,
      loveLanguages,
      futurePlans,
      partnerEmail
    } = body;

    // Validate required fields
    if (!email || !password || !firstName || !birthday) {
      return NextResponse.json(
        { error: 'Email, password, firstName, and birthday are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabaseAdmin
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('Error checking existing user:', userCheckError);
      return NextResponse.json(
        { error: 'Failed to check existing user' },
        { status: 500 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // First, create the user in Supabase Auth using service role client
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for testing
      user_metadata: {
        first_name: firstName,
        last_name: lastName
      }
    });

    if (authError) {
      console.error('Auth user creation error:', authError);
      return NextResponse.json(
        { error: `Failed to create auth user: ${authError.message}` },
        { status: 400 }
      );
    }

    console.log('Auth user created successfully:', authUser.user.id);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Prepare user data for insert - start with minimal required fields only
    const userData = {
      id: authUser.user.id, // Use the auth user ID
      email,
      first_name: firstName,
      last_name: lastName,
      birthday: new Date(birthday).toISOString(),
      email_verified: true, // Bypass email verification for testing
      email_verification_token: emailVerificationToken,
      email_verification_expires: emailVerificationExpires.toISOString()
    };

    // Add optional fields only if they exist and have values
    if (gender) userData.gender = gender;
    if (timezone) userData.timezone = timezone;
    if (address) userData.address = address;
    if (country) userData.country = country;
    if (language) userData.language = language;
    if (isAddressPublic !== undefined) userData.is_address_public = isAddressPublic;
    if (wakeUpTime) userData.wake_up_time = wakeUpTime;
    if (bedTime) userData.bed_time = bedTime;
    if (workStartTime) userData.work_start_time = workStartTime;
    if (workEndTime) userData.work_end_time = workEndTime;
    if (gymTime) userData.gym_time = gymTime;
    if (schoolTime) userData.school_time = schoolTime;
    if (measurementSystem) userData.measurement_system = measurementSystem;
    if (temperatureUnit) userData.temperature_unit = temperatureUnit;
    if (distanceUnit) userData.distance_unit = distanceUnit;

    console.log('Attempting to insert user profile data:', userData);

    // Upsert into users table - service role bypasses RLS
    console.log('Upserting user profile with service role (RLS bypassed)...');
    
    // Debug: Check what client we're using
    console.log('Using supabaseAdmin client:', !!supabaseAdmin);
    console.log('Service role key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('Environment variables available:', {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      serviceKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length
    });
    
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .upsert({
        id: authUser.user.id,
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        gender: userData.gender || null,
        birthday: userData.birthday,
        email_verified: true,
        email_verification_token: emailVerificationToken,
        email_verification_expires: emailVerificationExpires.toISOString(),
        timezone: userData.timezone || 'UTC',
        address: userData.address || null,
        country: userData.country || null,
        language: userData.language || 'en',
        is_address_public: userData.is_address_public || false,
        wake_up_time: userData.wake_up_time || null,
        bed_time: userData.bed_time || null,
        work_start_time: userData.work_start_time || null,
        work_end_time: userData.work_end_time || null,
        gym_time: userData.gym_time || null,
        school_time: userData.school_time || null,
        measurement_system: userData.measurement_system || null,
        temperature_unit: userData.temperature_unit || null,
        distance_unit: userData.distance_unit || null
      }, { onConflict: 'id' })
      .select()
      .single();

    if (userError) {
      console.error('Error creating user:', userError);
      console.error('Error details:', {
        code: userError.code,
        message: userError.message,
        details: userError.details,
        hint: userError.hint
      });
      console.error('User data that failed:', {
        email,
        firstName,
        lastName,
        birthday,
        timezone,
        address,
        country,
        language,
        isAddressPublic,
        gender
      });
      return NextResponse.json(
        { error: `Failed to create user: ${userError.message}` },
        { status: 500 }
      );
    }

    // Create relationship if partner email is provided
    if (partnerEmail) {
      // Check if partner already exists
      const { data: partner, error: partnerError } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('email', partnerEmail)
        .single();

      if (partner) {
        // Create relationship immediately
        const { error: relationshipError } = await supabaseAdmin
          .from('relationships')
          .insert({
            user1_id: user.id,
            user2_id: partner.id,
            status: 'PENDING',
            relationship_type: relationshipType,
            how_long_together: howLongTogether,
            communication_style: communicationStyle,
            love_languages: loveLanguages,
            future_plans: futurePlans
          });

        if (relationshipError) {
          console.error('Error creating relationship:', relationshipError);
        }
      } else {
        // Create invitation for partner
        const invitationToken = crypto.randomBytes(32).toString('hex');
        const { error: invitationError } = await supabaseAdmin
          .from('invitations')
          .insert({
            sender_id: user.id,
            receiver_email: partnerEmail,
            token: invitationToken,
            expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
          });

        if (invitationError) {
          console.error('Error creating invitation:', invitationError);
        }

        // TODO: Send invitation email
        console.log(`Invitation sent to ${partnerEmail} with token: ${invitationToken}`);
      }
    }

    // TODO: Send email verification (bypassed for testing)
    console.log(`Email verification bypassed for testing. Token: ${emailVerificationToken}`);

    return NextResponse.json(
      { 
        message: 'User created successfully! Email verification bypassed for testing.',
        userId: user.id 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
