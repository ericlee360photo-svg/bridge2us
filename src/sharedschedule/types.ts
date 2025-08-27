export type TZ = string; // e.g. "America/New_York"

export type Kind =
  | 'sleep'
  | 'work'
  | 'school'
  | 'gym'
  | 'commute'
  | 'meal'
  | 'free'
  | 'other';

export type ScheduleBlock = {
  /** local minutes since 00:00 in the partner's timezone */
  startMin: number; // 0..1439
  endMin: number;   // 1..1440 (end-exclusive)
  kind: Kind;
};

export type PartnerSchedule = {
  name: string;
  tz: TZ;
  /** Template blocks for a typical day in the partner's local time */
  blocks: ScheduleBlock[];
};

export type OverlapSegment = { startMin: number; endMin: number };
