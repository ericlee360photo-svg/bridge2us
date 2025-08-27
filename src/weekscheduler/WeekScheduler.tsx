import React from 'react';
import type { WeekBlock } from './types';
import { snap, clamp } from './time';

interface WeekSchedulerProps {
  tzA: string;
  value: WeekBlock[];
  onChange: (blocks: WeekBlock[]) => void;
}

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_MIN = 1440;

function minToY(min: number, barHeight: number) {
  return (min / DAY_MIN) * barHeight;
}

function Block({ b, h, kind }: { b: {startMin:number;endMin:number}, h: number, kind?: string }) {
  const top = minToY(b.startMin, h);
  const height = Math.max(2, minToY(b.endMin, h) - top);
  return <div className={`ss-block ${kind ?? ''}`} style={{ top, height }} />;
}

export default function WeekScheduler({ tzA, value, onChange }: WeekSchedulerProps) {
  const barHeight = 300;
  
  // Group blocks by day
  const blocksByDay = value.reduce((acc, block) => {
    if (!acc[block.day]) acc[block.day] = [];
    acc[block.day].push(block);
    return acc;
  }, {} as Record<number, WeekBlock[]>);

  // Generate hour lines (every 3 hours)
  const hours = Array.from({ length: 9 }, (_, i) => i * 3 * 60);

  return (
    <div className="ss-wrap" style={{ gridTemplateColumns: 'repeat(7, 1fr)', maxWidth: '1200px' }}>
      {DAY_NAMES.map((dayName, dayIndex) => (
        <div key={dayIndex} className="ss-col">
          <div className="ss-label">{dayName}</div>
          <div className="ss-bar" style={{ height: barHeight }}>
            {/* Hour grid */}
            {hours.map((m,i)=>(
              <div key={i} className="ss-hour" style={{ top: (m/DAY_MIN)*barHeight }} />
            ))}
            
            {/* Blocks for this day */}
            {(blocksByDay[dayIndex] || []).map((block,i)=>(
              <Block key={block.id} b={block} h={barHeight} kind={block.kind}/>
            ))}
          </div>
          <div className="ss-timeScale">
            <span>12a</span><span>6a</span><span>12p</span><span>6p</span><span>12a</span>
          </div>
        </div>
      ))}
    </div>
  );
}
