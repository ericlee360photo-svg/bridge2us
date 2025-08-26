import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, partnerId, calendarSource, calendarId } = body;

    if (!userId || !partnerId || !calendarSource || !calendarId) {
      return NextResponse.json(
        { error: 'User ID, partner ID, calendar source, and calendar ID are required' },
        { status: 400 }
      );
    }

    // Verify that users are in a relationship
    const relationship = await prisma.relationship.findFirst({
      where: {
        OR: [
          { user1Id: userId, user2Id: partnerId },
          { user1Id: partnerId, user2Id: userId }
        ],
        status: 'ACTIVE'
      }
    });

    if (!relationship) {
      return NextResponse.json(
        { error: 'Users must be in an active relationship to sync calendars' },
        { status: 403 }
      );
    }

    // Update user's calendar integration
    const updateData: any = {
      calendarSyncEnabled: true
    };

    switch (calendarSource) {
      case 'google':
        updateData.googleCalendarId = calendarId;
        break;
      case 'outlook':
        updateData.outlookCalendarId = calendarId;
        break;
      case 'apple':
        updateData.appleCalendarId = calendarId;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid calendar source. Must be google, outlook, or apple' },
          { status: 400 }
        );
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    return NextResponse.json(
      { message: 'Calendar sync enabled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Calendar sync error:', error);
    return NextResponse.json(
      { error: 'Failed to enable calendar sync' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const partnerId = searchParams.get('partnerId');

    if (!userId || !partnerId) {
      return NextResponse.json(
        { error: 'User ID and partner ID are required' },
        { status: 400 }
      );
    }

    // Get both users' schedules and calendar events
    const [user, partner] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          events: {
            where: {
              startTime: {
                gte: new Date(),
                lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
              }
            },
            orderBy: { startTime: 'asc' }
          }
        }
      }),
      prisma.user.findUnique({
        where: { id: partnerId },
        include: {
          events: {
            where: {
              startTime: {
                gte: new Date(),
                lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
              }
            },
            orderBy: { startTime: 'asc' }
          }
        }
      })
    ]);

    if (!user || !partner) {
      return NextResponse.json(
        { error: 'User or partner not found' },
        { status: 404 }
      );
    }

    // Calculate free/busy times based on schedules and events
    const userSchedule = {
      wakeUpTime: user.wakeUpTime,
      bedTime: user.bedTime,
      workStartTime: user.workStartTime,
      workEndTime: user.workEndTime,
      gymTime: user.gymTime,
      schoolTime: user.schoolTime,
      events: user.events
    };

    const partnerSchedule = {
      wakeUpTime: partner.wakeUpTime,
      bedTime: partner.bedTime,
      workStartTime: partner.workStartTime,
      workEndTime: partner.workEndTime,
      gymTime: partner.gymTime,
      schoolTime: partner.schoolTime,
      events: partner.events
    };

    // Find overlapping free times
    const overlappingFreeTimes = calculateOverlappingFreeTimes(userSchedule, partnerSchedule);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        timezone: user.timezone,
        schedule: userSchedule,
        calendarSyncEnabled: user.calendarSyncEnabled
      },
      partner: {
        id: partner.id,
        name: partner.name,
        timezone: partner.timezone,
        schedule: partnerSchedule,
        calendarSyncEnabled: partner.calendarSyncEnabled
      },
      overlappingFreeTimes
    });
  } catch (error) {
    console.error('Calendar sync error:', error);
    return NextResponse.json(
      { error: 'Failed to get calendar sync data' },
      { status: 500 }
    );
  }
}

function calculateOverlappingFreeTimes(userSchedule: any, partnerSchedule: any) {
  // This is a simplified calculation - in a real app, you'd want more sophisticated logic
  const freeTimes = [];
  
  // For now, return basic overlapping times based on wake/sleep schedules
  const userWakeHour = parseInt(userSchedule.wakeUpTime?.split(':')[0] || '7');
  const userBedHour = parseInt(userSchedule.bedTime?.split(':')[0] || '23');
  const partnerWakeHour = parseInt(partnerSchedule.wakeUpTime?.split(':')[0] || '7');
  const partnerBedHour = parseInt(partnerSchedule.bedTime?.split(':')[0] || '23');

  const overlapStart = Math.max(userWakeHour, partnerWakeHour);
  const overlapEnd = Math.min(userBedHour, partnerBedHour);

  if (overlapStart < overlapEnd) {
    freeTimes.push({
      startTime: `${overlapStart.toString().padStart(2, '0')}:00`,
      endTime: `${overlapEnd.toString().padStart(2, '0')}:00`,
      type: 'overlapping_free_time'
    });
  }

  return freeTimes;
}
