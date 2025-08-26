import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { toZonedTime } from "date-fns-tz"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Timezone utilities
export function convertToUserTimezone(date: Date, timezone: string): Date {
  return toZonedTime(date, timezone)
}

export function convertToUTC(date: Date, timezone: string): Date {
  // Compute the timezone offset (in minutes) at this date and subtract from local time to get UTC equivalent
  const offsetMinutes = getTimezoneOffsetMinutes(timezone, date)
  return new Date(date.getTime() - offsetMinutes * 60000)
}

// Accurate timezone offset calculation (in minutes) at a given Date
export function getTimezoneOffsetMinutes(timezone: string, date: Date = new Date()): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  })
  const parts = dtf.formatToParts(date)
  const map = Object.fromEntries(parts.map(p => [p.type, p.value])) as Record<string, string>
  const asUTC = Date.UTC(
    Number(map.year), Number(map.month) - 1, Number(map.day),
    Number(map.hour), Number(map.minute), Number(map.second)
  )
  // Positive if timezone is ahead of UTC
  return (asUTC - date.getTime()) / 60000
}

export function getTimezoneDifference(partnerTimezone: string, userTimezone?: string): { minutes: number, hours: number } {
  const now = new Date()
  const userTz = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  const partnerOffset = getTimezoneOffsetMinutes(partnerTimezone, now)
  const userOffset = getTimezoneOffsetMinutes(userTz, now)
  const diffMinutes = partnerOffset - userOffset
  return { minutes: diffMinutes, hours: diffMinutes / 60 }
}

export function formatInTimezone(date: Date, timezone: string, formatString: string): string {
  const zonedDate = toZonedTime(date, timezone)
  // Simple formatting for common patterns
  if (formatString === "HH:mm") {
    return zonedDate.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone 
    })
  }
  if (formatString === "hh:mm a") {
    return zonedDate.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: '2-digit', 
      minute: '2-digit',
      timeZone: timezone 
    })
  }
  if (formatString === "EEEE, MMMM d") {
    return zonedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      timeZone: timezone 
    })
  }
  if (formatString === "PPP") {
    return zonedDate.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: timezone 
    })
  }
  if (formatString === "MMM d, yyyy") {
    return zonedDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      timeZone: timezone 
    })
  }
  if (formatString === "MMM d") {
    return zonedDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      timeZone: timezone 
    })
  }
  if (formatString === "dd MMM yyyy") {
    return zonedDate.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: 'short', 
      year: 'numeric',
      timeZone: timezone 
    })
  }
  if (formatString === "EEE, MMM d • HH:mm") {
    return `${zonedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: timezone })} • ${zonedDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', timeZone: timezone })}`
  }
  return zonedDate.toLocaleDateString('en-US', { timeZone: timezone })
}

// Countdown utilities
export function getTimeUntil(date: Date): {
  days: number
  hours: number
  minutes: number
  seconds: number
} {
  const now = new Date()
  const diff = date.getTime() - now.getTime()
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  return { days, hours, minutes, seconds }
}

export function getTimeUntilString(date: Date): string {
  const { days, hours, minutes } = getTimeUntil(date)
  
  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}

// Partner time utilities
export function getPartnerCurrentTime(partnerTimezone: string): Date {
  return toZonedTime(new Date(), partnerTimezone)
}

export function isPartnerAwake(partnerTimezone: string, wakeTime: string = "07:00", sleepTime: string = "23:00"): boolean {
  const partnerTime = getPartnerCurrentTime(partnerTimezone)
  const currentHour = partnerTime.getHours()
  const wakeHour = parseInt(wakeTime.split(":")[0])
  const sleepHour = parseInt(sleepTime.split(":")[0])
  
  if (wakeHour <= sleepHour) {
    return currentHour >= wakeHour && currentHour < sleepHour
  } else {
    // Handles cases where sleep time is after midnight
    return currentHour >= wakeHour || currentHour < sleepHour
  }
}

// Date formatting utilities
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'today'
  if (diffInDays === 1) return 'yesterday'
  if (diffInDays > 1) return `${diffInDays} days ago`
  if (diffInDays < -1) return `in ${Math.abs(diffInDays)} days`
  return 'tomorrow'
}

export function formatDate(date: Date | string, formatString: string = "PPP"): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return formatInTimezone(dateObj, 'UTC', formatString)
}
