import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    const existingRelationship = await prisma.relationship.findFirst({
      where: {
        OR: [
          { user1Id, user2Id },
          { user1Id: user2Id, user2Id: user1Id }
        ]
      }
    });

    if (existingRelationship) {
      return NextResponse.json(
        { error: 'Relationship already exists' },
        { status: 400 }
      );
    }

    // Create relationship
    const relationship = await prisma.relationship.create({
      data: {
        user1Id,
        user2Id,
        status: 'ACTIVE'
      },
      include: {
        user1: true,
        user2: true
      }
    });

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
    const relationships = await prisma.relationship.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId }
        ],
        status: 'ACTIVE'
      },
      include: {
        user1: true,
        user2: true
      }
    });

    // Format response to show partner info
    const formattedRelationships = relationships.map(rel => {
      const isUser1 = rel.user1Id === userId;
      const partner = isUser1 ? rel.user2 : rel.user1;
      
      return {
        id: rel.id,
        status: rel.status,
        partner: {
          id: partner.id,
          name: partner.name,
          email: partner.email,
          timezone: partner.timezone,
          calendarSyncEnabled: partner.calendarSyncEnabled,
          schedule: {
            wakeUpTime: partner.wakeUpTime,
            bedTime: partner.bedTime,
            workStartTime: partner.workStartTime,
            workEndTime: partner.workEndTime,
            gymTime: partner.gymTime,
            schoolTime: partner.schoolTime
          }
        },
        relationshipDetails: {
          relationshipType: rel.relationshipType,
          howLongTogether: rel.howLongTogether,
          communicationStyle: rel.communicationStyle,
          loveLanguages: rel.loveLanguages,
          futurePlans: rel.futurePlans
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
