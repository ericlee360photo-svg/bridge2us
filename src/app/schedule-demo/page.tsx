import React from 'react';
import TwoVerticalBars from '../../sharedschedule/TwoVerticalBars';
import type { PartnerSchedule } from '../../sharedschedule/types';

const A: PartnerSchedule = {
  name: 'You',
  tz: 'America/Los_Angeles',
  blocks: [
    { startMin: 0,   endMin: 360, kind: 'sleep' },     // 12a-6a
    { startMin: 540, endMin: 1020, kind: 'work' },     // 9a-5p
    { startMin: 1080,endMin: 1200, kind: 'gym' },      // 6p-8p
    // free time is implicit via inversion
  ],
};

const B: PartnerSchedule = {
  name: 'Partner',
  tz: 'America/New_York',
  blocks: [
    { startMin: 60,  endMin: 420,  kind: 'sleep' },    // 1a-7a local
    { startMin: 540, endMin: 960,  kind: 'work' },     // 9a-4p local
    { startMin: 1140,endMin: 1260, kind: 'meal' },     // 7p-9p local
  ],
};

export default function ScheduleDemo() {
  // Anchor day = today in A's calendar
  const date = new Date();
  return (
    <div style={{ padding: 16, background:'#0f1115', minHeight:'100vh' }}>
      <h2 style={{ color:'#eaeef9', textAlign:'center' }}>Synced Schedule Demo</h2>
      <p style={{ color:'#9fb0d0', textAlign:'center', marginBottom: '24px' }}>
        Two vertical bars showing 12a→12a of Partner A&apos;s timezone. Partner B&apos;s blocks are shifted to match.
      </p>
      <TwoVerticalBars 
        date={date} 
        partnerA={A} 
        partnerB={B} 
        aLoc={{ lat: 34.0522, lon: -118.2437 }}   // Los Angeles
        bLoc={{ lat: 40.7128, lon: -74.0060 }}   // New York
      />
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <a 
          href="/dashboard" 
          style={{
            background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Back to Dashboard
        </a>
      </div>
    </div>
  );
}
