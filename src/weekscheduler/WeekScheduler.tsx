import React, { useState, useRef } from 'react';
import type { WeekBlock } from './types';
import { snap, clamp } from './time';
import '../sharedschedule/schedule.css';

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

function yToMin(y: number, barHeight: number) {
  return (y / barHeight) * DAY_MIN;
}

function Block({ 
  b, 
  h, 
  kind, 
  onDragStart, 
  onDragMove, 
  onDragEnd 
}: { 
  b: {id: string, startMin:number;endMin:number}, 
  h: number, 
  kind?: string;
  onDragStart?: (e: React.MouseEvent, blockId: string) => void;
  onDragMove?: (e: MouseEvent, blockId: string, deltaY: number) => void;
  onDragEnd?: (e: MouseEvent, blockId: string) => void;
}) {
  const top = minToY(b.startMin, h);
  const height = Math.max(2, minToY(b.endMin, h) - top);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (onDragStart) {
      onDragStart(e, b.id);
    }
  };

  return (
    <div 
      className={`ss-block ${kind ?? ''}`} 
      style={{ top, height }}
      onMouseDown={handleMouseDown}
    />
  );
}

export default function WeekScheduler({ tzA, value, onChange }: WeekSchedulerProps) {
  const barHeight = 300;
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [dragStartMin, setDragStartMin] = useState(0);
  
  // Group blocks by day
  const blocksByDay = value.reduce((acc, block) => {
    if (!acc[block.day]) acc[block.day] = [];
    acc[block.day].push(block);
    return acc;
  }, {} as Record<number, WeekBlock[]>);

  // Generate hour lines (every 3 hours)
  const hours = Array.from({ length: 9 }, (_, i) => i * 3 * 60);

  const handleDragStart = (e: React.MouseEvent, blockId: string) => {
    e.preventDefault();
    const block = value.find(b => b.id === blockId);
    if (!block) return;
    
    setDragging(blockId);
    setDragStartY(e.clientY);
    setDragStartMin(block.startMin);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (dragging) {
        const deltaY = e.clientY - dragStartY;
        const deltaMin = yToMin(deltaY, barHeight);
        const newStartMin = clamp(snap(dragStartMin + deltaMin));
        const newEndMin = clamp(snap(block.endMin + deltaMin));
        
        const updatedBlocks = value.map(b => 
          b.id === blockId 
            ? { ...b, startMin: newStartMin, endMin: newEndMin }
            : b
        );
        onChange(updatedBlocks);
      }
    };
    
    const handleMouseUp = (e: MouseEvent) => {
      setDragging(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="ss-wrap" style={{ 
      gridTemplateColumns: 'repeat(7, 1fr)', 
      maxWidth: '1200px',
      gap: '8px'
    }}>
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
              <Block 
                key={block.id} 
                b={block} 
                h={barHeight} 
                kind={block.kind}
                onDragStart={handleDragStart}
              />
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
