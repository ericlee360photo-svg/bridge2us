import type { WeekBlock, UsualWeek, WeekOverrides } from './types';

export function getWeekStart(date: Date, timezone: string): Date {
  // Get the start of the week (Monday) for the given date in the specified timezone
  const start = new Date(date);
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

// combine template with overrides
export function applyAddRemovePatch(template: WeekBlock[], o?: WeekOverrides['overrides']): WeekBlock[] {
  if (!o) return template;
  
  let result = [...template];
  
  // Apply removes
  if (o.removeIds) {
    result = result.filter(block => !o.removeIds!.includes(block.id));
  }
  
  // Apply patches
  if (o.patch) {
    result = result.map(block => {
      const patch = o.patch!.find(p => p.id === block.id);
      return patch ? { ...block, ...patch } : block;
    });
  }
  
  // Apply adds
  if (o.add) {
    result = [...result, ...o.add];
  }
  
  return result;
}

export function materializeWeek(uw: UsualWeek, ov?: WeekOverrides): WeekBlock[] {
  // start from uw.blocks, apply overrides, return sorted non-overlapping blocks (0..1440 per day)
  const blocks = applyAddRemovePatch(uw.blocks, ov?.overrides);
  
  // Sort by day, then by start time
  return blocks.sort((a, b) => {
    if (a.day !== b.day) return a.day - b.day;
    return a.startMin - b.startMin;
  });
}
