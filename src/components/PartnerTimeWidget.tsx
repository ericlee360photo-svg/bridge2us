'use client';

import React, { useState, useEffect } from 'react';
import { formatInTimezone } from '@/lib/utils';

interface PartnerTimeWidgetProps {
  partnerName: string;
  partnerTimezone: string;
}

export default function PartnerTimeWidget({ partnerName, partnerTimezone }: PartnerTimeWidgetProps) {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
          {partnerName}&apos;s Time
        </h2>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
            --:--
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            -- ---
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {partnerTimezone.replace('_', ' ')}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border border-gray-100 dark:border-gray-700">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">
        {partnerName}&apos;s Time
      </h2>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-1">
          {formatInTimezone(currentTime, partnerTimezone, "HH:mm")}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {formatInTimezone(currentTime, partnerTimezone, "MMM d")}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {partnerTimezone.replace('_', ' ')}
        </div>
      </div>
    </div>
  );
}
