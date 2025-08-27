import SunCalc from "suncalc";
import { startOfDay, addMinutes } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";

/**
 * Build sunrise/sunset minutes for a partner and map them into Partner A's clock (0..1440).
 * If polar day/night occurs, we fall back to full-day light or dark.
 */
export function daylightSegmentsInAClock(opts: {
  dateInA: Date,            // anchor day (A's calendar context)
  aTz: string,              // Partner A tz
  partnerTz: string,        // Partner B (or A) tz
  lat: number, lon: number  // partner location
}): { light: Array<{startMin:number,endMin:number}>, dark: Array<{startMin:number,endMin:number}> } {
  const { dateInA, aTz, partnerTz, lat, lon } = opts;

  // Build "noon" of the partner's *local* day that corresponds to A's anchor day.
  const pLocalMidnight = startOfDay(toZonedTime(fromZonedTime(startOfDay(dateInA), aTz), partnerTz));
  const pLocalNoon = addMinutes(pLocalMidnight, 12*60);

  // Convert that local noon to an absolute UTC instant and ask SunCalc for that day's times.
  const noonUtc = fromZonedTime(pLocalNoon, partnerTz);
  const times = SunCalc.getTimes(noonUtc, lat, lon); // returns Dates (absolute instants)

  // Helper: convert an absolute instant to "minutes since A's midnight"
  const aMidUtc = fromZonedTime(startOfDay(dateInA), aTz);
  const toAmins = (d: Date) => {
    const aLocal = toZonedTime(d, aTz);
    const aMidLocal = toZonedTime(aMidUtc, aTz);
    return Math.round((aLocal.getTime() - aMidLocal.getTime())/60000); // can be <0 or >1440; we'll clip
  };

  const sr = toAmins(times.sunrise);
  const ss = toAmins(times.sunset);

  // If sunrise/sunset reversed or far outside the window, detect polar day/night by sun altitude at local noon.
  const light: Array<{startMin:number,endMin:number}> = [];
  const dark:  Array<{startMin:number,endMin:number}> = [];
  const clip = (s:number,e:number) => ({startMin: Math.max(0,s), endMin: Math.min(1440,e)});
  if (Number.isFinite(sr) && Number.isFinite(ss) && sr < ss && ss - sr > 10) {
    // Night [0..sr), Day [sr..ss), Night (ss..1440)
    const a = clip(0, sr);           if (a.endMin > a.startMin) dark.push(a);
    const b = clip(sr, ss);          if (b.endMin > b.startMin) light.push(b);
    const c = clip(ss, 1440);        if (c.endMin > c.startMin) dark.push(c);
  } else {
    // Polar edge case: check solar altitude at local noon
    const noonLocal = toZonedTime(noonUtc, partnerTz);
    const pos = SunCalc.getPosition(noonUtc, lat, lon); // altitude in radians
    if (pos.altitude > 0) {
      light.push({ startMin: 0, endMin: 1440 }); // continuous daylight
    } else {
      dark.push({ startMin: 0, endMin: 1440 });  // continuous night
    }
  }
  return { light, dark };
}

/** Minutes since A's midnight for "now", respecting A's timezone */
export function nowMinutesInAClock(now: Date, aTz: string) {
  const aMidUtc = fromZonedTime(startOfDay(now), aTz);
  const aLocalNow = toZonedTime(now, aTz);
  const aLocalMid = toZonedTime(aMidUtc, aTz);
  return Math.round((aLocalNow.getTime()-aLocalMid.getTime())/60000);
}
