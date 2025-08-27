import type { UsualWeek, WeekOverrides } from './types';

// Local storage persistence for demo (easy to swap to Supabase later)
export function saveUsualWeek(uw: UsualWeek) {
  localStorage.setItem(`usual-week-${uw.userId}`, JSON.stringify(uw));
}

export function loadUsualWeek(userId: string): UsualWeek | null {
  const stored = localStorage.getItem(`usual-week-${userId}`);
  return stored ? JSON.parse(stored) : null;
}

export function saveWeekOverrides(wo: WeekOverrides) {
  localStorage.setItem(`week-overrides-${wo.userId}-${wo.weekStartA}`, JSON.stringify(wo));
}

export function loadWeekOverrides(userId: string, weekStartIso: string): WeekOverrides | null {
  const stored = localStorage.getItem(`week-overrides-${userId}-${weekStartIso}`);
  return stored ? JSON.parse(stored) : null;
}

// Helper to create default usual week
export function createDefaultUsualWeek(userId: string, tz: string): UsualWeek {
  return {
    userId,
    tz,
    blocks: [
      // Sleep: 12 AM - 6 AM
      { id: 'sleep-0', day: 0, startMin: 0, endMin: 360, kind: 'sleep' },
      { id: 'sleep-1', day: 1, startMin: 0, endMin: 360, kind: 'sleep' },
      { id: 'sleep-2', day: 2, startMin: 0, endMin: 360, kind: 'sleep' },
      { id: 'sleep-3', day: 3, startMin: 0, endMin: 360, kind: 'sleep' },
      { id: 'sleep-4', day: 4, startMin: 0, endMin: 360, kind: 'sleep' },
      { id: 'sleep-5', day: 5, startMin: 0, endMin: 360, kind: 'sleep' },
      { id: 'sleep-6', day: 6, startMin: 0, endMin: 360, kind: 'sleep' },
      
      // Work: 9 AM - 5 PM (Mon-Fri)
      { id: 'work-1', day: 1, startMin: 540, endMin: 1020, kind: 'work' },
      { id: 'work-2', day: 2, startMin: 540, endMin: 1020, kind: 'work' },
      { id: 'work-3', day: 3, startMin: 540, endMin: 1020, kind: 'work' },
      { id: 'work-4', day: 4, startMin: 540, endMin: 1020, kind: 'work' },
      { id: 'work-5', day: 5, startMin: 540, endMin: 1020, kind: 'work' },
    ],
    updatedAt: new Date().toISOString()
  };
}
