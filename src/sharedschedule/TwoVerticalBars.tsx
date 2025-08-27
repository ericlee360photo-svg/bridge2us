'use client';

import React, { useMemo } from 'react';
import './schedule.css';
import type { PartnerSchedule } from './types';
import { projectBlocksToAClock, invertToFree, intersectSegments } from './timeUtils';
// ✅ Safe imports
import { daylightSegmentsInAClock, nowMinutesInAClock } from './solar';

const DAY_MIN = 1440;
const clamp = (n:number,min=0,max=1440)=> Math.max(min, Math.min(max, n));

function minToY(min: number, barHeight: number) {
  // ✅ guard
  if (!Number.isFinite(min) || !Number.isFinite(barHeight) || barHeight <= 0) return 0;
  return (clamp(min) / DAY_MIN) * barHeight;
}

function Block({ b, h, kind }: { b: {startMin:number;endMin:number}, h: number, kind?: string }) {
  const top = minToY(b.startMin, h);
  const height = Math.max(2, minToY(b.endMin, h) - top);
  return <div className={`ss-block ${kind ?? ''}`} style={{ top, height }} />;
}

export default function TwoVerticalBars({
  date,
  partnerA,
  partnerB,
  barHeight = 420,
  aLoc,
  bLoc,
  now = new Date()
}: {
  date: Date;
  partnerA: PartnerSchedule;
  partnerB: PartnerSchedule;
  barHeight?: number;
  aLoc?: {lat:number; lon:number};   // ✅ optional now
  bLoc?: {lat:number; lon:number};   // ✅ optional now
  now?: Date;
}) {
  // ✅ early sanity: fallback blocks array
  const aBlocks = Array.isArray(partnerA.blocks) ? partnerA.blocks : [];
  const bBlocks = Array.isArray(partnerB.blocks) ? partnerB.blocks : [];

  const { aProjected, bProjected } = useMemo(() => {
    const { aProjected, bProjected } = projectBlocksToAClock({
      dateInA: date,
      aTz: partnerA.tz,
      aBlocksLocal: aBlocks,
      bSchedule: { ...partnerB, blocks: bBlocks },
    });

    // Map kinds safely
    const _a = aProjected.map((p, i) => ({ ...p, kind: aBlocks[i]?.kind ?? 'other' }));
    const _b = bProjected.map((p, i) => ({ ...p, kind: bBlocks[i]?.kind ?? 'other' }));
    return { aProjected: _a, bProjected: _b };
  }, [date, partnerA.tz, partnerB.tz, aBlocks, bBlocks]);

  // ✅ Daylight segments with hard fallback if loc or solar fails
  const safeSegs = (lightDark?: {light:{startMin:number;endMin:number}[];dark:{startMin:number;endMin:number}[]}) => ({
    light: lightDark?.light ?? [],
    dark:  lightDark?.dark  ?? [],
  });

  let aLightDark = { light: [] as any[], dark: [] as any[] };
  let bLightDark = { light: [] as any[], dark: [] as any[] };
  try {
    if (aLoc && Number.isFinite(aLoc.lat) && Number.isFinite(aLoc.lon)) {
      aLightDark = safeSegs(daylightSegmentsInAClock({
        dateInA: date, aTz: partnerA.tz, partnerTz: partnerA.tz, lat: aLoc.lat, lon: aLoc.lon
      }));
    }
    if (bLoc && Number.isFinite(bLoc.lat) && Number.isFinite(bLoc.lon)) {
      bLightDark = safeSegs(daylightSegmentsInAClock({
        dateInA: date, aTz: partnerA.tz, partnerTz: partnerB.tz, lat: bLoc.lat, lon: bLoc.lon
      }));
    }
  } catch { /* ignore solar errors in safe mode */ }

  // ✅ Now line minutes
  let nowMinA = 0;
  try { nowMinA = clamp(nowMinutesInAClock(now, partnerA.tz)); } catch { nowMinA = 0; }
  const nowY = minToY(nowMinA, barHeight);

  // helper
  const segStyle = (s:{startMin:number;endMin:number}) => ({
    top: minToY(s.startMin, barHeight),
    height: Math.max(1, minToY(s.endMin, barHeight) - minToY(s.startMin, barHeight))
  });

  // Busy/free/overlap
  const busyKinds: Record<string, true> = { work: true, sleep: true, school: true, commute: true, gym: true, meal: true, other: true };
  const aBusy = aProjected.filter(b => busyKinds[b.kind]);
  const bBusy = bProjected.filter(b => busyKinds[b.kind]);
  const aFree = invertToFree(aBusy);
  const bFree = invertToFree(bBusy);
  const bothFree = intersectSegments(aFree, bFree);

  const hours = Array.from({ length: 9 }, (_, i) => i * 180);

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
