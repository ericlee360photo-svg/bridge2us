import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      password,
      firstName,
      lastName,
      birthday,
      address,
      isAddressPublic,
      wakeUpTime,
      bedTime,
      workStartTime,
      workEndTime,
      gymTime,
      schoolTime,
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
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        timezone: 'UTC', // Will be updated based on location
        address,
        isAddressPublic,
        birthday: new Date(birthday),
        wakeUpTime,
        bedTime,
        workStartTime,
        workEndTime,
        gymTime,
        schoolTime,
        emailVerified: true, // Bypass email verification for testing
        emailVerificationToken,
        emailVerificationExpires
      }
    });

    // Create relationship if partner email is provided
    if (partnerEmail) {
      // Check if partner already exists
      const partner = await prisma.user.findUnique({
        where: { email: partnerEmail }
      });

      if (partner) {
        // Create relationship immediately
        await prisma.relationship.create({
          data: {
            user1Id: user.id,
            user2Id: partner.id,
            status: 'PENDING',
            relationshipType,
            howLongTogether,
            communicationStyle,
            loveLanguages,
            futurePlans
          }
        });
      } else {
        // Create invitation for partner
        const invitationToken = crypto.randomBytes(32).toString('hex');
        await prisma.invitation.create({
          data: {
            senderId: user.id,
            receiverEmail: partnerEmail,
            token: invitationToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
          }
        });

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
