import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { addMinutes, startOfDay } from 'date-fns';
import type { PartnerSchedule, ScheduleBlock, OverlapSegment } from './types';

/**
 * Given Partner A's timezone and a date (anchor), return the UTC start and end
 * for A's local day (00:00..24:00).
 */
export function getUtcWindowForADay(dateInA: Date, aTz: string) {
  // Take dateInA (assumed already in A's calendar day context),
  // compute 00:00 in A's tz, then +24h, both converted to UTC.
  const aMidnightLocal = startOfDay(dateInA);
  const utcStart = fromZonedTime(aMidnightLocal, aTz);
  const utcEnd = addMinutes(utcStart, 1440);
  return { utcStart, utcEnd };
}

/**
 * Convert a partner's local block to absolute UTC interval (for the anchor day in partner's tz)
 */
export function blockLocalToUtc(dateInPartner: Date, partnerTz: string, b: ScheduleBlock) {
  const pMidnightLocal = startOfDay(dateInPartner);
  // Build two Date objects at partner local midnight + minutes, then convert to UTC.
  const startLocal = addMinutes(pMidnightLocal, b.startMin);
  const endLocal   = addMinutes(pMidnightLocal, b.endMin);
  const startUtc   = fromZonedTime(startLocal, partnerTz);
  const endUtc     = fromZonedTime(endLocal, partnerTz);
  return { startUtc, endUtc };
}

/**
 * Given Partner A's UTC day window, project Partner B's local blocks into that window,
 * then convert both partners' blocks into A's clock minutes (0..1440).
 */
export function projectBlocksToAClock(params: {
  dateInA: Date;
  aTz: string;
  aBlocksLocal: ScheduleBlock[];
  bSchedule: PartnerSchedule; // b.blocks are local to b.tz
}) {
  const { dateInA, aTz, aBlocksLocal, bSchedule } = params;
  const { utcStart, utcEnd } = getUtcWindowForADay(dateInA, aTz);

  // A: convert local blocks -> UTC -> clip to window -> back to A minutes
  const aProjected = aBlocksLocal.map(b => {
    const { startUtc, endUtc } = blockLocalToUtc(dateInA, aTz, b);
    return clipAndToMinutesA({ startUtc, endUtc, utcStart, aTz });
  }).filter(r => r !== null) as ScheduleBlock[];

  // B: blocks defined in B's tz, but we anchor to A's day window.
  const bProjected = bSchedule.blocks.map(b => {
    const { startUtc, endUtc } = blockLocalToUtc(dateInA, bSchedule.tz, b);
    return clipAndToMinutesA({ startUtc, endUtc, utcStart, aTz });
  }).filter(r => r !== null) as ScheduleBlock[];

  return { aProjected, bProjected };
}

/**
 * Clip UTC interval to A's UTC day window and convert to minutes in A's local day.
 */
function clipAndToMinutesA(args: {
  startUtc: Date; endUtc: Date; utcStart: Date; aTz: string;
}): ScheduleBlock | null {
  const { startUtc, endUtc, utcStart, aTz } = args;
  const startMs = Math.max(startUtc.getTime(), utcStart.getTime());
  const endMs   = Math.min(endUtc.getTime(),   addMinutes(utcStart, 1440).getTime());
  if (endMs <= startMs) return null;

  // Convert back to A's local time to get minutes-from-midnight
  const aStartLocal = toZonedTime(new Date(startMs), aTz);
  const aEndLocal   = toZonedTime(new Date(endMs),   aTz);

  const dayStartLocal = toZonedTime(utcStart, aTz);
  const startMin = Math.round((aStartLocal.getTime() - dayStartLocal.getTime()) / 60000);
  const endMin   = Math.round((aEndLocal.getTime()   - dayStartLocal.getTime())   / 60000);

  return { startMin, endMin, kind: 'other' }; // kind filled by caller if needed
}

/**
 * Invert busy blocks to compute "free" segments across 0..1440.
 * Blocks are assumed non-overlapping and within [0,1440].
 */
export function invertToFree(blocks: ScheduleBlock[], dayMinutes = 1440): OverlapSegment[] {
  const sorted = [...blocks].sort((a,b)=> a.startMin - b.startMin);
  const out: OverlapSegment[] = [];
  let cursor = 0;
  for (const b of sorted) {
    if (b.startMin > cursor) out.push({ startMin: cursor, endMin: b.startMin });
    cursor = Math.max(cursor, b.endMin);
  }
  if (cursor < dayMinutes) out.push({ startMin: cursor, endMin: dayMinutes });
  return out;
}

/** Intersect two sets of [start,end) minute segments */
export function intersectSegments(a: OverlapSegment[], b: OverlapSegment[]): OverlapSegment[] {
  const out: OverlapSegment[] = [];
  let i = 0, j = 0;
  while (i < a.length && j < b.length) {
    const s = Math.max(a[i].startMin, b[j].startMin);
    const e = Math.min(a[i].endMin,   b[j].endMin);
    if (e > s) out.push({ startMin: s, endMin: e });
    if (a[i].endMin < b[j].endMin) i++; else j++;
  }
  return out;
}
