import { prisma } from './prisma'

// Determine if we should use localStorage (for demo) or database (for production)
const useLocalStorage = () => {
  // Use localStorage for demo/development, database for production
  return typeof window !== 'undefined' && (
    window.location.hostname === 'localhost' || 
    process.env.NODE_ENV === 'development' ||
    window.location.pathname.includes('demo')
  )
}

export interface UserData {
  id: string
  firstName: string
  lastName: string
  email: string
  timezone: string
  avatar?: string
  country?: string
  language?: string
  timeFormat?: string
  measurementSystem?: string
  temperatureUnit?: string
  distanceUnit?: string
}

export interface UserSettings {
  firstName: string
  lastName: string
  email: string
  birthday: string
  timezone: string
  country: string
  language: string
  timeFormat: string
  measurementSystem: string
  temperatureUnit: string
  distanceUnit: string
  spotifySharing: boolean
  horoscopeSharing: boolean
  shareHoroscope: boolean
  showHoroscope: boolean
  weeklySchedule: any // Keep this flexible for now
}

export class DataStorage {
  // User Authentication
  static async getUser(): Promise<UserData | null> {
    if (useLocalStorage()) {
      const stored = localStorage.getItem('user')
      return stored ? JSON.parse(stored) : null
    }
    
    // For production, we'd get user from session/auth
    // This is a placeholder - implement proper session management
    return null
  }

  static async setUser(userData: UserData): Promise<void> {
    if (useLocalStorage()) {
      localStorage.setItem('user', JSON.stringify(userData))
      return
    }
    
    // For production, update user in database
    try {
      await prisma.user.upsert({
        where: { id: userData.id },
        update: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          timezone: userData.timezone,
          avatar: userData.avatar,
          country: userData.country,
          language: userData.language,
        },
        create: {
          id: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          timezone: userData.timezone,
          avatar: userData.avatar,
          country: userData.country,
          language: userData.language,
        }
      })
    } catch (error) {
      console.error('Failed to save user to database:', error)
      throw error
    }
  }

  // User Settings
  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    if (useLocalStorage()) {
      const stored = localStorage.getItem('userSettings')
      return stored ? JSON.parse(stored) : null
    }
    
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      })
      
      if (!user) return null
      
      return {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        birthday: user.birthday?.toISOString().split('T')[0] || '',
        timezone: user.timezone,
        country: user.country || '',
        language: user.language || '',
        timeFormat: '12h', // Add this to schema if needed
        measurementSystem: user.measurementSystem,
        temperatureUnit: user.temperatureUnit,
        distanceUnit: user.distanceUnit,
        spotifySharing: true, // Add these to schema if needed
        horoscopeSharing: true,
        shareHoroscope: true,
        showHoroscope: true,
        weeklySchedule: {} // Implement this later
      }
    } catch (error) {
      console.error('Failed to get user settings from database:', error)
      return null
    }
  }

  static async setUserSettings(userId: string, settings: UserSettings): Promise<void> {
    if (useLocalStorage()) {
      localStorage.setItem('userSettings', JSON.stringify(settings))
      return
    }
    
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          firstName: settings.firstName,
          lastName: settings.lastName,
          email: settings.email,
          birthday: settings.birthday ? new Date(settings.birthday) : null,
          timezone: settings.timezone,
          country: settings.country,
          language: settings.language,
          measurementSystem: settings.measurementSystem,
          temperatureUnit: settings.temperatureUnit,
          distanceUnit: settings.distanceUnit,
        }
      })
    } catch (error) {
      console.error('Failed to save user settings to database:', error)
      throw error
    }
  }

  // Location Data
  static async getUserLocation(userId: string): Promise<{lat: number, lon: number} | null> {
    if (useLocalStorage()) {
      const stored = localStorage.getItem('userLocation')
      return stored ? JSON.parse(stored) : null
    }
    
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { latitude: true, longitude: true }
      })
      
      if (user?.latitude && user?.longitude) {
        return { lat: user.latitude, lon: user.longitude }
      }
      return null
    } catch (error) {
      console.error('Failed to get user location from database:', error)
      return null
    }
  }

  static async setUserLocation(userId: string, location: {lat: number, lon: number}): Promise<void> {
    if (useLocalStorage()) {
      localStorage.setItem('userLocation', JSON.stringify(location))
      return
    }
    
    try {
      await prisma.user.update({
        where: { id: userId },
        data: {
          latitude: location.lat,
          longitude: location.lon
        }
      })
    } catch (error) {
      console.error('Failed to save user location to database:', error)
      throw error
    }
  }

  // Generic data storage for features like journal, horoscope, etc.
  static async getData(key: string): Promise<any> {
    if (useLocalStorage()) {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : null
    }
    
    // For production, implement a generic key-value store or specific tables
    // This is a placeholder for now
    return null
  }

  static async setData(key: string, data: any): Promise<void> {
    if (useLocalStorage()) {
      localStorage.setItem(key, JSON.stringify(data))
      return
    }
    
    // For production, implement a generic key-value store or specific tables
    // This is a placeholder for now
    console.log(`Would save ${key} to database:`, data)
  }

  // Clear all data (for logout/account deletion)
  static async clearAll(): Promise<void> {
    if (useLocalStorage()) {
      localStorage.clear()
      return
    }
    
    // For production, implement proper user data deletion
    console.log('Would clear user data from database')
  }
}
