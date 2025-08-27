'use client';

import React, { useState, useEffect } from 'react';
import WeekScheduler from './WeekScheduler';
import { loadUsualWeek, saveUsualWeek, createDefaultUsualWeek } from './store';
import { materializeWeek } from './materialize';
import type { UsualWeek, WeekBlock } from './types';

interface UsualWeekWizardProps {
  userId: string;
  tz: string;
  onComplete: () => void;
}

export default function UsualWeekWizard({ userId, tz, onComplete }: UsualWeekWizardProps) {
  const [usualWeek, setUsualWeek] = useState<UsualWeek | null>(null);
  const [blocks, setBlocks] = useState<WeekBlock[]>([]);

  useEffect(() => {
    // Load existing usual week or create default
    let uw = loadUsualWeek(userId);
    if (!uw) {
      uw = createDefaultUsualWeek(userId, tz);
      saveUsualWeek(uw);
    }
    setUsualWeek(uw);
    setBlocks(uw.blocks);
  }, [userId, tz]);

  const handleSave = () => {
    if (usualWeek) {
      const updatedUsualWeek = {
        ...usualWeek,
        blocks,
        updatedAt: new Date().toISOString()
      };
      saveUsualWeek(updatedUsualWeek);
      onComplete();
    }
  };

  if (!usualWeek) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: 16, background:'#0f1115', minHeight:'100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color:'#eaeef9', textAlign:'center', marginBottom: '24px' }}>
          Set Your Usual Week Schedule
        </h2>
        <p style={{ color:'#9fb0d0', textAlign:'center', marginBottom: '32px' }}>
          This will be your default schedule. You can adjust it week by week later.
        </p>
        
        <WeekScheduler 
          tzA={tz}
          value={blocks}
          onChange={setBlocks}
        />
        
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <button
            onClick={handleSave}
            style={{
              background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Save Usual Week
          </button>
        </div>
      </div>
    </div>
  );
}
