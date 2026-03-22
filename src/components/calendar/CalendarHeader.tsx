"use client";

import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEventContext } from "@/context/EventContext";
import { MONTHS_OF_YEAR } from "@/lib/constants";
import RippleButton from "@/components/shared/RippleButton";
import AnimatedContainer from "@/components/shared/AnimatedContainer";

/**
 * CalendarHeader — Displays the calendar title, current month/year,
 * and navigation buttons to move between months.
 *
 * Uses:
 * - Bebas Neue font for the "Calendar" heading
 * - Lucide icons for chevron arrows (replaced Boxicons CDN)
 * - RippleButton for interactive navigation buttons
 * - AnimatedContainer for slide-in-from-left entrance
 */
export default function CalendarHeader() {
  const { currentMonth, currentYear, prevMonth, nextMonth, events } =
    useEventContext();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* Badge next to month name: how many events fall in the currently displayed month/year. */
  const monthEventCount = useMemo(() => {
    if (!mounted) return 0;
    return events.filter((e) => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length;
  }, [events, currentMonth, currentYear, mounted]);

  return (
    <AnimatedContainer direction="left" delay={0.1}>
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-4xl tracking-wider text-white sm:text-5xl">
        Calendar
      </h1>

      <div className="mt-6 flex items-center gap-3 sm:mt-8">
        <h2 className="text-lg text-white/70 sm:text-xl">
          {MONTHS_OF_YEAR[currentMonth]},
        </h2>
        <h2 className="text-lg text-white/70 sm:text-xl">{currentYear}</h2>

        {monthEventCount > 0 && (
          <span className="rounded-full border border-sky-500/30 bg-sky-500/20 px-2.5 py-0.5 text-xs font-bold text-sky-300">
            {monthEventCount}
          </span>
        )}

        <div className="ml-auto flex gap-2">
          <RippleButton
            onClick={prevMonth}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2c3542] text-amber-500 transition-colors hover:bg-[#3a4556]"
          >
            <ChevronLeft className="h-5 w-5" />
          </RippleButton>
          <RippleButton
            onClick={nextMonth}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2c3542] text-amber-500 transition-colors hover:bg-[#3a4556]"
          >
            <ChevronRight className="h-5 w-5" />
          </RippleButton>
        </div>
      </div>
    </AnimatedContainer>
  );
}
