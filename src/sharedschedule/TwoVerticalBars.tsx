import React, { useMemo } from 'react';
import './schedule.css';
import type { PartnerSchedule, ScheduleBlock } from './types';
import {
  projectBlocksToAClock, invertToFree, intersectSegments
} from './timeUtils';
import { daylightSegmentsInAClock, nowMinutesInAClock } from './solar';

const DAY_MIN = 1440;

function minToY(min: number, barHeight: number) {
  return (min / DAY_MIN) * barHeight;
}

function Block({ b, h, kind }: { b: {startMin:number;endMin:number}, h: number, kind?: string }) {
  const top = minToY(b.startMin, h);
  const height = Math.max(2, minToY(b.endMin, h) - top);
  return <div className={`ss-block ${kind ?? ''}`} style={{ top, height }} />;
}

export default function TwoVerticalBars({
  date, // anchor date in Partner A's local calendar
  partnerA,
  partnerB,
  barHeight = 420,
  aLoc, // {lat,lon} for A
  bLoc, // {lat,lon} for B
  now = new Date()
}: {
  date: Date;
  partnerA: PartnerSchedule;
  partnerB: PartnerSchedule;
  barHeight?: number;
  aLoc: {lat:number; lon:number};
  bLoc: {lat:number; lon:number};
  now?: Date;
}) {
  const { aProjected, bProjected } = useMemo(() => {
    // Keep kinds when projecting (fill back in)
    const { aProjected, bProjected } = projectBlocksToAClock({
      dateInA: date,
      aTz: partnerA.tz,
      aBlocksLocal: partnerA.blocks,
      bSchedule: partnerB,
    });

    // Put kinds back by naive mapping (same index order as source).
    const _a = aProjected.map((p, i) => ({ ...p, kind: partnerA.blocks[i]?.kind ?? 'other' }));
    const _b = bProjected.map((p, i) => ({ ...p, kind: partnerB.blocks[i]?.kind ?? 'other' }));
    return { aProjected: _a, bProjected: _b };
  }, [date, partnerA, partnerB]);

  // Daylight segments mapped to A's clock
  const aLightDark = useMemo(() => daylightSegmentsInAClock({
    dateInA: date, aTz: partnerA.tz, partnerTz: partnerA.tz, lat: aLoc.lat, lon: aLoc.lon
  }), [date, partnerA.tz, aLoc.lat, aLoc.lon]);

  const bLightDark = useMemo(() => daylightSegmentsInAClock({
    dateInA: date, aTz: partnerA.tz, partnerTz: partnerB.tz, lat: bLoc.lat, lon: bLoc.lon
  }), [date, partnerA.tz, partnerB.tz, bLoc.lat, bLoc.lon]);

  // Current time line (minutes in A's day)
  const nowMinA = nowMinutesInAClock(now, partnerA.tz);
  const nowY = Math.min(Math.max(0, nowMinA), 1440); // clamp

  // helper
  const segStyle = (s:{startMin:number;endMin:number}) => ({
    top: (s.startMin/1440)*barHeight,
    height: Math.max(1, ((s.endMin-s.startMin)/1440)*barHeight)
  });

  // Compute "free" segments by inverting busy (non-free) kinds
  const busyKinds: Record<string, true> = { work: true, sleep: true, school: true, commute: true, gym: true, meal: true, other: true };
  const aBusy = aProjected.filter(b => busyKinds[b.kind]); // treat everything except 'free' as busy
  const bBusy = bProjected.filter(b => busyKinds[b.kind]);

  const aFree = invertToFree(aBusy);
  const bFree = invertToFree(bBusy);
  const bothFree = intersectSegments(aFree, bFree);

  // Generate hour lines (every 3 hours to reduce clutter)
  const hours = Array.from({ length: 9 }, (_, i) => i * 3 * 60); // 0..1440 step 180

  return (
    <div className="ss-wrap">
      {/* LEFT: Partner A */}
      <div className="ss-col">
        <div className="ss-label">{partnerA.name} • {partnerA.tz}</div>
        <div className="ss-bar" style={{ height: barHeight }}>
          {/* Day/Night background */}
          {aLightDark.dark.map((s,i)=>(<div key={'ad'+i} className="ss-daylayer ss-night" style={segStyle(s)} />))}
          {aLightDark.light.map((s,i)=>(<div key={'al'+i} className="ss-daylayer ss-day"   style={segStyle(s)} />))}

          {/* Hour grid */}
          {hours.map((m,i)=>(
            <div key={i} className="ss-hour" style={{ top: (m/1440)*barHeight }} />
          ))}
          {aProjected.map((b,i)=>(
            <Block key={i} b={b} h={barHeight} kind={b.kind}/>
          ))}

          {/* NOW line */}
          <div className="ss-nowline" style={{ top: (nowY/1440)*barHeight }} />
          <div className="ss-nowlabel" style={{ top: (nowY/1440)*barHeight }}>{`${new Intl.DateTimeFormat('en-US',{ hour:'numeric', minute:'2-digit' }).format(now)} (A)`}</div>
        </div>
        <div className="ss-timeScale">
          <span>12a</span><span>3a</span><span>6a</span><span>9a</span>
          <span>12p</span><span>3p</span><span>6p</span><span>9p</span><span>12a</span>
        </div>
      </div>

      {/* RIGHT: Partner B */}
      <div className="ss-col">
        <div className="ss-label">{partnerB.name} • {partnerB.tz}</div>
        <div className="ss-bar" style={{ height: barHeight, position:'relative' }}>
          {/* Day/Night background */}
          {bLightDark.dark.map((s,i)=>(<div key={'bd'+i} className="ss-daylayer ss-night" style={segStyle(s)} />))}
          {bLightDark.light.map((s,i)=>(<div key={'bl'+i} className="ss-daylayer ss-day"   style={segStyle(s)} />))}

          {/* Hour grid */}
          {hours.map((m,i)=>(
            <div key={i} className="ss-hour" style={{ top: (m/1440)*barHeight }} />
          ))}
          {bProjected.map((b,i)=>(
            <Block key={i} b={b} h={barHeight} kind={b.kind}/>
          ))}

          {/* Overlap glow over the RIGHT bar (so it's visually obvious) */}
          {bothFree.map((seg,i)=>(
            <div key={`ov-${i}`} className="ss-overlap"
                 style={{ top: (seg.startMin/1440)*barHeight, height: Math.max(2, ((seg.endMin-seg.startMin)/1440)*barHeight) }} />
          ))}

          {/* Same NOW line for visual sync */}
          <div className="ss-nowline" style={{ top: (nowY/1440)*barHeight }} />
        </div>
        <div className="ss-timeScale">
          <span>12a</span><span>3a</span><span>6a</span><span>9a</span>
          <span>12p</span><span>3p</span><span>6p</span><span>9p</span><span>12a</span>
        </div>
      </div>
    </div>
  );
}
