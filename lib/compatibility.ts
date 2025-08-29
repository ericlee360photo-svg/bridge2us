export type Lang = 'words_of_affirmation'|'acts_of_service'|'quality_time'|'receiving_gifts'|'physical_touch';

export const M: Record<Lang, Record<Lang, number>> = {
  words_of_affirmation:    { words_of_affirmation: 98, acts_of_service: 60, quality_time: 85, receiving_gifts: 62, physical_touch: 80 },
  acts_of_service:         { words_of_affirmation: 60, acts_of_service: 95, quality_time: 70, receiving_gifts: 85, physical_touch: 65 },
  quality_time:            { words_of_affirmation: 85, acts_of_service: 70, quality_time: 97, receiving_gifts: 68, physical_touch: 75 },
  receiving_gifts:         { words_of_affirmation: 62, acts_of_service: 85, quality_time: 68, receiving_gifts: 93, physical_touch: 65 },
  physical_touch:          { words_of_affirmation: 80, acts_of_service: 65, quality_time: 75, receiving_gifts: 65, physical_touch: 96 }
};

// Weight primaries most, secondaries some.
export function pairCompatibility(aPrimary: Lang, aSecondary: Lang, bPrimary: Lang, bSecondary: Lang) {
  const primaryPair = (M[aPrimary][bPrimary] + M[bPrimary][aPrimary]) / 2;
  const secondaryAvg =
    (M[aSecondary][bPrimary] + M[aPrimary][bSecondary] + M[aSecondary][bSecondary] + M[bSecondary][aSecondary]) / 4;

  // Base = 70% primary alignment, 30% secondary cross-support.
  let score = Math.round(0.7 * primaryPair + 0.3 * secondaryAvg);

  // Small harmony bonus if partners' primaries are different but complementary (>=85 in matrix)
  if (aPrimary !== bPrimary && primaryPair >= 85) score = Math.min(100, score + 3);

  // Small penalty if both partners have low cross-support (<65 average)
  if (secondaryAvg < 65) score = Math.max(0, score - 3);

  return score; // 0..100
}

// Simple, actionable tips per language to personalize output
export const TIPS: Record<Lang, {give: string[], avoid: string[]}> = {
  words_of_affirmation: {
    give: ["Say specific praise 3–5×/week","Send quick 'thinking of you' texts","Celebrate small wins verbally"],
    avoid: ["Sarcasm or long stretches of silence"]
  },
  acts_of_service: {
    give: ["Do a chore without asking","Prep coffee/lunch","Handle an errand on busy days"],
    avoid: ["Promises without follow-through"]
  },
  quality_time: {
    give: ["Schedule device-free time","Plan a weekly 60-min date","Try a shared hobby"],
    avoid: ["Multitasking when together"]
  },
  receiving_gifts: {
    give: ["Small, thoughtful tokens","Keep a note of gift ideas","Mark dates with tangible mementos"],
    avoid: ["Last-minute, generic gifts"]
  },
  physical_touch: {
    give: ["Daily hugs/kisses","Cuddle during shows","Offer reassuring touch when stressed"],
    avoid: ["Withholding touch after conflict"]
  }
};
