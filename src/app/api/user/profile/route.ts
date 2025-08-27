import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        timezone: true,
        avatar: true,
        country: true,
        language: true,
        measurementSystem: true,
        temperatureUnit: true,
        distanceUnit: true,
        latitude: true,
        longitude: true,
        birthday: true,
        wakeUpTime: true,
        bedTime: true,
        workStartTime: true,
        workEndTime: true,
        gymTime: true,
        schoolTime: true,
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, ...updateData } = body
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Convert birthday string to Date if provided
    if (updateData.birthday) {
      updateData.birthday = new Date(updateData.birthday)
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        timezone: true,
        avatar: true,
        country: true,
        language: true,
        measurementSystem: true,
        temperatureUnit: true,
        distanceUnit: true,
        latitude: true,
        longitude: true,
        birthday: true,
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
