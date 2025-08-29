"use client";

import WeeklyScheduleWizard from "@/weekscheduler/UsualWeekWizard";

export default function UsualWeek() {
  return (
    <div className="p-6">
      <WeeklyScheduleWizard
        initialBlocks={[]}
        onSave={(blocks) =>
          fetch("/api/schedule", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blocks),
          })
        }
      />
    </div>
  );
}
