'use client';

import React, { useState, useEffect } from 'react';
import { formatInTimezone } from '@/lib/utils';

interface TimeOverlayProps {
  position: string;
  title: string;
  timezone: string;
  location: string;
  isPartner?: boolean;
}

export default function TimeOverlay({ position, title, timezone, location, isPartner = false }: TimeOverlayProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className={`absolute ${position} rounded-lg p-3 text-blue-400 z-50 pointer-events-none`}>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-lg font-bold">--:--</div>
        <div className="text-xs opacity-80">-- --- ----</div>
        <div className="text-xs opacity-80">{location}</div>
      </div>
    );
  }

  return (
    <div className={`absolute ${position} rounded-lg p-3 text-blue-400 z-50 pointer-events-none`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-lg font-bold">
        {isPartner 
          ? formatInTimezone(currentTime, timezone, "hh:mm a")
          : currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true 
            })
        }
      </div>
      <div className="text-xs opacity-80">
        {isPartner 
          ? formatInTimezone(currentTime, timezone, "dd MMM yyyy")
          : currentTime.toLocaleDateString('en-US', { 
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
        }
      </div>
      <div className="text-xs opacity-80">{location}</div>
    </div>
  );
}
