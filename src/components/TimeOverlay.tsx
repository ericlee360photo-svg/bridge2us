'use client';

import React, { useState, useEffect } from 'react';
import { formatInTimezone } from '@/lib/utils';

interface TimeOverlayProps {
  position: string;
  title: string;
  timezone: string;
  location: string;
  isPartner?: boolean;
  style?: React.CSSProperties;
  textColor?: string;
}

export default function TimeOverlay({ position, title, timezone, location, isPartner = false, style, textColor = '#3b82f6' }: TimeOverlayProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute instead of every second

    return () => clearInterval(timer);
  }, []);

  // Get the appropriate time based on timezone
  const getDisplayTime = () => {
    // Use the provided timezone for both user and partner
    // The timezone prop should already be set correctly from the parent component
    return formatInTimezone(currentTime, timezone, "hh:mm a");
  };

  const getDisplayDate = () => {
    // Use the provided timezone for both user and partner
    // The timezone prop should already be set correctly from the parent component
    return formatInTimezone(currentTime, timezone, "dd MMM yyyy");
  };

  return (
    <div 
      className="rounded-lg p-3 pointer-events-none"
      style={{ ...style, color: textColor }}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-lg font-bold">
        {getDisplayTime()}
      </div>
      <div className="text-xs opacity-80">
        {getDisplayDate()}
      </div>
      <div className="text-xs opacity-80">{location}</div>
    </div>
  );
}
