"use client";

import CalendarHeader from "@/components/calendar/CalendarHeader";
import CalendarGrid from "@/components/calendar/CalendarGrid";
import EventPopup from "@/components/calendar/EventPopup";
import EventList from "@/components/calendar/EventList";

/**
 * CalendarApp — Main calendar component that combines all sub-components.
 *
 * Layout (responsive):
 * - Mobile (< sm): Stacked vertically (flex-col, w-full)
 * - Desktop (sm+): Side-by-side (flex-row)
 *   - Left 50%: Calendar header + day grid + event popup
 *   - Right 50%: Event list
 *
 * Styling follows UI_STYLING_GUIDE.md:
 * - Dark glassmorphism card with subtle border
 * - Deep shadow for floating card effect
 */
export default function CalendarApp() {
  return (
    <div className="relative flex w-full flex-col gap-6 rounded-[2rem] border border-white/10 bg-[#1e242d] p-4 shadow-[0_30px_80px_rgba(15,23,42,0.5)] sm:flex-row sm:gap-16 sm:p-8">
      {/* Left side: Calendar */}
      <div className="relative w-full sm:w-[50%]">
        <CalendarHeader />
        <CalendarGrid />
      </div>

      {/* Right side: Event list */}
      <EventList />

      {/* Modal: rendered at root level so it overlays the full card */}
      <EventPopup />
    </div>
  );
}
