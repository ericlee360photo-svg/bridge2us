import { startOfWeek, addDays, addMinutes } from 'date-fns';
import { toZonedTime, utcToZonedTime } from 'date-fns-tz';
import type { WeekBlock } from './types';

// return Monday 00:00 for a given date in tzA (or Sunday, your choice)
export function getWeekStart(date: Date, tzA: string): Date {
  // Get Monday of the week in the specified timezone
  const weekStart = startOfWeek(date, { weekStartsOn: 1 }); // Monday = 1
  return toZonedTime(weekStart, tzA);
}

// clip block to day bounds, split if needed
export function clipBlockToDay(b: WeekBlock): WeekBlock[] {
  const blocks: WeekBlock[] = [];
  
  // If block spans midnight, split it
  if (b.startMin < b.endMin && b.endMin <= 1440) {
    // Normal case - block within day
    blocks.push(b);
  } else if (b.startMin < 1440 && b.endMin > 1440) {
    // Block spans midnight - split into two
    blocks.push({
      ...b,
      startMin: b.startMin,
      endMin: 1440
    });
    
    // Add continuation to next day (would need to be handled by caller)
    // This is a simplified version - in practice you'd need to handle day boundaries
  }
  
  return blocks;
}

// Snap minutes to 15-minute increments
export function snap(min: number, step = 15): number {
  return Math.max(0, Math.min(1440, Math.round(min / step) * step));
}

// Clamp minutes to valid range
export function clamp(min: number): number {
  return Math.max(0, Math.min(1440, min));
}
