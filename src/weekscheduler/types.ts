export type Kind = 'work'|'sleep'|'school'|'gym'|'free'|'other';

export type WeekBlock = {
  id: string; 
  day: 0|1|2|3|4|5|6; 
  startMin: number; 
  endMin: number; 
  kind: Kind;
};

// 1) Per-partner "Usual Week" template
export type UsualWeek = {
  userId: string;            // per user
  tz: string;                // IANA tz
  blocks: WeekBlock[];       // exactly 7 columns worth
  updatedAt: string;
};

// 2) Per-week data = template + overrides (diffs)
export type WeekOverrides = {
  userId: string;
  weekStartA: string;        // ISO Monday 00:00 in A's tz (or Sunday—just be consistent)
  overrides: {
    add?: WeekBlock[];       // new blocks for this week
    removeIds?: string[];    // ids from template to hide this week
    patch?: Array<Partial<WeekBlock> & { id: string }>; // minor adjustments
  };
  finalized?: boolean;       // optional lock after the week starts
  updatedAt: string;
};
