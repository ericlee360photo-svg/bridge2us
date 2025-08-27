'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import UsualWeekWizard from '../../weekscheduler/UsualWeekWizard';

export default function OnboardingWeekDemo() {
  const router = useRouter();

  const handleComplete = () => {
    router.push('/schedule-week');
  };

  return (
    <UsualWeekWizard 
      userId="demo-user"
      tz="America/Los_Angeles"
      onComplete={handleComplete}
    />
  );
}
