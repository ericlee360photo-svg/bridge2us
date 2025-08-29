'use client';

import React, { useState, useEffect } from 'react';
import WeekScheduler from '../../weekscheduler/WeekScheduler';
import { loadUsualWeek, loadWeekOverrides, saveWeekOverrides } from '../../weekscheduler/store';
import { getWeekStart, materializeWeek } from '../../weekscheduler/materialize';
import type { UsualWeek, WeekOverrides, WeekBlock } from '../../weekscheduler/types';

export default function ScheduleWeekDemo() {
  const [usualWeek, setUsualWeek] = useState<UsualWeek | null>(null);
  const [weekOverrides, setWeekOverrides] = useState<WeekOverrides | null>(null);
  const [blocks, setBlocks] = useState<WeekBlock[]>([]);
  const [currentDate] = useState(new Date());

  useEffect(() => {
    const userId = "demo-user";
    const tz = "America/Los_Angeles";
    
    // Load usual week
    const uw = loadUsualWeek(userId);
    if (!uw) {
      // Redirect to onboarding if no usual week exists
      window.location.href = '/onboarding-week';
      return;
    }
    setUsualWeek(uw);

    // Calculate week start
    const weekStart = getWeekStart(currentDate, tz);
    const weekStartIso = weekStart.toISOString();

    // Load week overrides
    let wo = loadWeekOverrides(userId, weekStartIso);
    if (!wo) {
      // Create empty overrides for this week
      wo = {
        userId,
        weekStartA: weekStartIso,
        overrides: {},
        updatedAt: new Date().toISOString()
      };
      saveWeekOverrides(wo);
    }
    setWeekOverrides(wo);

    // Materialize the week
    const materializedBlocks = materializeWeek(uw, wo);
    setBlocks(materializedBlocks);
  }, [currentDate]);

  const handleBlocksChange = (newBlocks: WeekBlock[]) => {
    setBlocks(newBlocks);
    
    // For demo purposes, we'll just save the entire blocks as overrides
    // In a real app, you'd calculate the diff and save only the overrides
    if (weekOverrides) {
      const updatedOverrides = {
        ...weekOverrides,
        overrides: {
          ...weekOverrides.overrides,
          add: newBlocks // This is simplified - in reality you'd calculate the diff
        },
        updatedAt: new Date().toISOString()
      };
      setWeekOverrides(updatedOverrides);
      saveWeekOverrides(updatedOverrides);
    }
  };

  if (!usualWeek || !weekOverrides) {
    return <div style={{ padding: 16, background:'#0f1115', color: '#eaeef9' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: 16, background:'#0f1115', minHeight:'100vh', width: '100%' }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 16px' }}>
        <h2 style={{ color:'#eaeef9', textAlign:'center', marginBottom: '24px' }}>
          This Week&apos;s Schedule
        </h2>
        <p style={{ color:'#9fb0d0', textAlign:'center', marginBottom: '32px' }}>
          Based on your usual week with any adjustments for this specific week.
        </p>
        
        <div style={{ overflowX: 'auto', marginBottom: '32px' }}>
          <WeekScheduler 
            tzA={usualWeek.tz}
            value={blocks}
            onChange={handleBlocksChange}
          />
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={() => window.location.href = '/onboarding-week'}
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#eaeef9',
              border: '1px solid rgba(255,255,255,0.2)',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer',
              marginRight: '12px'
            }}
          >
            Edit Usual Week
          </button>
          <button
            onClick={() => window.location.href = '/schedule-demo'}
            style={{
              background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            View Shared Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
