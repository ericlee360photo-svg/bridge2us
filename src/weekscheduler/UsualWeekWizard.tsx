'use client';

import React, { useCallback, useMemo, useRef, useState } from "react";

// -------------------------------------------------------------
// WeeklyScheduleWizard.tsx — single-file, drop-in component
// - 7 columns (Sun–Sat)
// - 24h vertical timeline (12a → 11p)
// - Click–drag to add a block (busy/free toggle)
// - Click a block to delete
// - 15‑min granularity
// - Responsive width; no mysterious max-width clamp
// -------------------------------------------------------------

// Types
export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6; // Sun..Sat
export type ScheduleKind = "busy" | "free";
export interface Block {
  id: string;
  day: DayIndex;           // 0=Sun
  startMin: number;        // minutes from 00:00
  endMin: number;          // minutes from 00:00 (exclusive)
  kind: ScheduleKind;      // busy or free
}

export interface WeeklyScheduleWizardProps {
  initialBlocks?: Block[];
  onChange?: (blocks: Block[]) => void;
  onSave?: (blocks: Block[]) => void;
  kind?: ScheduleKind; // which kind we're adding when you drag; default: "busy"
}

// Helpers
const HOURS = Array.from({ length: 24 }, (_, i) => i); // 0..23
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const SNAP = 15; // minutes
const COLS = 7;
const ROWS = 24 * (60 / SNAP); // 96 rows

// Create default sleep blocks for each day
const createDefaultSleepBlocks = (): Block[] => {
  const blocks: Block[] = [];
  const now = Date.now();
  
  // For each day (0-6, Sunday to Saturday)
  for (let day = 0; day < 7; day++) {
    // Sleep block 1: 12:00 AM - 5:00 AM (0 minutes to 300 minutes)
    blocks.push({
      id: `sleep-${day}-1-${now}`,
      day: day as DayIndex,
      startMin: 0, // 12:00 AM
      endMin: 300, // 5:00 AM
      kind: "busy"
    });
    
    // Sleep block 2: 11:00 PM - 12:00 AM (1320 minutes to 1440 minutes)
    blocks.push({
      id: `sleep-${day}-2-${now}`,
      day: day as DayIndex,
      startMin: 1320, // 11:00 PM
      endMin: 1440, // 12:00 AM (next day)
      kind: "busy"
    });
  }
  
  return blocks;
};

function snapTo15(mins: number) {
  return Math.round(mins / SNAP) * SNAP;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

function minsToLabel(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h < 12 ? "a" : "p";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m === 0 ? "" : ":" + String(m).padStart(2, "0")} ${ampm}`;
}

// Main component
const WeeklyScheduleWizard: React.FC<WeeklyScheduleWizardProps> = ({
  initialBlocks = [],
  onChange,
  onSave,
  kind = "busy",
}) => {
  // Initialize with default sleep blocks if no initial blocks are provided
  const [blocks, setBlocks] = useState<Block[]>(() => {
    if (initialBlocks.length === 0) {
      return createDefaultSleepBlocks();
    }
    return initialBlocks;
  });
  const [drag, setDrag] = useState<null | {
    day: DayIndex;
    startMin: number; // snapped
    currentMin: number; // unsnapped while dragging
  }>(null);

  const gridRef = useRef<HTMLDivElement>(null);

  // Callbacks
  const commitBlocks = useCallback(
    (next: Block[]) => {
      setBlocks(next);
      onChange?.(next);
    },
    [onChange]
  );

  const startDrag = useCallback(
    (day: DayIndex, clientY: number) => {
      const grid = gridRef.current;
      if (!grid) return;
      const rect = grid.getBoundingClientRect();
      const y = clamp(clientY - rect.top, 0, rect.height);
      const minute = Math.floor((y / rect.height) * 24 * 60);
      setDrag({ day, startMin: snapTo15(minute), currentMin: minute });
    },
    []
  );

  const moveDrag = useCallback((clientY: number) => {
    if (!drag) return;
    const grid = gridRef.current;
    if (!grid) return;
    const rect = grid.getBoundingClientRect();
    const y = clamp(clientY - rect.top, 0, rect.height);
    const minute = Math.floor((y / rect.height) * 24 * 60);
    setDrag({ ...drag, currentMin: minute });
  }, [drag]);

  const endDrag = useCallback(() => {
    if (!drag) return;
    const start = drag.startMin;
    const end = snapTo15(drag.currentMin);
    const finalStart = Math.min(start, end);
    const finalEnd = Math.max(start, end);
    if (finalEnd - finalStart >= SNAP) {
      const block: Block = {
        id: `${drag.day}-${finalStart}-${finalEnd}-${Date.now()}`,
        day: drag.day,
        startMin: finalStart,
        endMin: finalEnd,
        kind,
      };
      commitBlocks([...blocks, block]);
    }
    setDrag(null);
  }, [blocks, drag, commitBlocks, kind]);

  const deleteBlock = useCallback((id: string) => {
    commitBlocks(blocks.filter(b => b.id !== id));
  }, [blocks, commitBlocks]);

  // Derived
  const byDay = useMemo(() => {
    const map: Record<number, Block[]> = {};
    blocks.forEach(b => {
      (map[b.day] ||= []).push(b);
    });
    return map;
  }, [blocks]);

  // Styles
  const columnWidth = "w-[min(140px,14vw)]"; // responsive columns that expand; adjust as needed
  const hourRowHeight = "h-10"; // 24 * 40px = 960px grid

  return (
    <div className="w-full max-w-none">
      {/* Header card */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200">
        <h2 className="text-xl font-semibold">Weekly Schedule</h2>
        <p className="text-sm text-slate-400">
          Default sleep blocks (12a-5a, 11p-12a) are pre-filled. Click‑drag to add more {kind} blocks. Click a block to delete. 15‑minute steps.
        </p>
      </div>

      {/* Grid wrapper */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0f1218] p-4">
        <div className="flex gap-4 overflow-x-auto">
          {/* Time labels column */}
          <div className="sticky left-0 shrink-0 pr-2">
            {HOURS.map(h => (
              <div key={h} className={`flex items-start justify-end text-xs text-slate-400 ${hourRowHeight}`}>
                {minsToLabel(h * 60)}
              </div>
            ))}
          </div>

          {/* Days columns */}
          {DAYS.map((d, dayIdx) => (
            <div key={d} className={`relative ${columnWidth} shrink-0`}>
              {/* Day header */}
              <div className="mb-2 text-center text-slate-200 font-medium">{d}</div>

              {/* Column grid */}
              <div
                className="relative rounded-xl border border-white/10 bg-white/5"
                onMouseDown={(e) => startDrag(dayIdx as DayIndex, e.clientY)}
                onMouseMove={(e) => moveDrag(e.clientY)}
                onMouseUp={endDrag}
                onMouseLeave={() => setDrag(null)}
              >
                {/* The vertical timeline area used for hit-testing */}
                <div ref={gridRef} className="relative">
                  {/* 24 hour rows */}
                  {HOURS.map(h => (
                    <div key={h} className={`relative ${hourRowHeight} border-t border-white/5`} />
                  ))}

                  {/* quarter-hour minor grid (optional subtle) */}
                  <div className="pointer-events-none absolute inset-0">
                    {Array.from({ length: ROWS }, (_, i) => (
                      <div key={i} className="h-[10px] border-t border-white/5/10" />
                    ))}
                  </div>

                  {/* Existing blocks */}
                  {(byDay[dayIdx] || []).map(b => {
                    const top = (b.startMin / (24 * 60)) * 100;
                    const height = ((b.endMin - b.startMin) / (24 * 60)) * 100;
                    const isBusy = b.kind === "busy";
                    return (
                      <button
                        key={b.id}
                        onClick={() => deleteBlock(b.id)}
                        title="Click to delete"
                        className={`absolute left-1 right-1 rounded-lg ${isBusy ? "bg-pink-500/80" : "bg-emerald-500/80"} text-[10px] text-white shadow-lg hover:brightness-110`}
                        style={{ top: `${top}%`, height: `${height}%` }}
                      >
                        <span className="px-1">
                          {minsToLabel(b.startMin)} – {minsToLabel(b.endMin)} {isBusy ? "Busy" : "Free"}
                        </span>
                      </button>
                    );
                  })}

                  {/* Dragging preview */}
                  {drag && drag.day === (dayIdx as DayIndex) && (
                    (() => {
                      const start = drag.startMin;
                      const end = snapTo15(drag.currentMin);
                      const a = Math.min(start, end);
                      const b = Math.max(start, end);
                      const top = (a / (24 * 60)) * 100;
                      const height = ((b - a) / (24 * 60)) * 100;
                      return (
                        <div
                          className="absolute left-1 right-1 rounded-lg bg-indigo-500/60 ring-1 ring-indigo-300/50"
                          style={{ top: `${top}%`, height: `${height}%` }}
                        />
                      );
                    })()
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Save button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => onSave?.(blocks)}
            className="rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 px-6 py-3 text-white shadow-lg hover:opacity-90"
          >
            Save Usual Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeeklyScheduleWizard;

// -------------------------------------------------------------
// Usage example (drop inside a page or step of signup flow):
// <WeeklyScheduleWizard
//   initialBlocks={[]}
//   onSave={(blocks) => fetch('/api/schedule', { method: 'POST', body: JSON.stringify(blocks) })}
// />
// -------------------------------------------------------------
