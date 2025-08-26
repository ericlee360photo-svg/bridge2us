import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const meetups = await prisma.meetup.findMany({
      include: {
        user1: true,
        user2: true
      },
      orderBy: {
        startDate: 'asc'
      }
    });
    
    return NextResponse.json(meetups);
  } catch (error) {
    console.error('Error fetching meetups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meetups' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, location, user1Id, user2Id } = body;

    if (!title || !startDate || !user1Id || !user2Id) {
      return NextResponse.json(
        { error: 'Title, start date, and both user IDs are required' },
        { status: 400 }
      );
    }

    const meetup = await prisma.meetup.create({
      data: {
        title,
        description,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        user1Id,
        user2Id
      },
      include: {
        user1: true,
        user2: true
      }
    });

    return NextResponse.json(meetup, { status: 201 });
  } catch (error) {
    console.error('Error creating meetup:', error);
    return NextResponse.json(
      { error: 'Failed to create meetup' },
      { status: 500 }
    );
  }
}
