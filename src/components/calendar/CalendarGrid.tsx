"use client";

import { useMemo } from "react";
import { useEventContext } from "@/context/EventContext";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { cn } from "@/lib/utils";
import AnimatedContainer from "@/components/shared/AnimatedContainer";

/**
 * CalendarGrid — Renders the weekday header and day number grid.
 *
 * Layout:
 * - 7-column grid for days of the week
 * - Empty cells before the 1st day (based on firstDayOfMonth)
 * - Day numbers 1 through daysInMonth
 * - Today's date gets an amber highlight with glow effect
 * - Clicking a day opens the event popup (via handleDayClick from context)
 */
export default function CalendarGrid() {
  const {
    currentMonth,
    currentYear,
    daysInMonth,
    firstDayOfMonth,
    handleDayClick,
  } = useEventContext();

  const today = useMemo(() => new Date(), []);

  const emptySlots = useMemo(
    () => Array.from({ length: firstDayOfMonth }, (_, i) => i),
    [firstDayOfMonth],
  );

  const dayNumbers = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  const isToday = (day: number): boolean =>
    day === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const isPast = (day: number): boolean => {
    const date = new Date(currentYear, currentMonth, day);
    const todayMidnight = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    return date < todayMidnight;
  };

  return (
    <AnimatedContainer direction="bottom" delay={0.2}>
      {/* Weekday labels */}
      <div className="mt-6 flex sm:mt-8">
        {DAYS_OF_WEEK.map((day) => (
          <span
            key={day}
            className="flex w-[calc(100%/7)] items-center justify-center text-xs font-bold uppercase tracking-wider text-white/40 sm:text-sm"
          >
            {day}
          </span>
        ))}
      </div>

      {/* Day number grid */}
      <div className="mt-4 flex flex-wrap sm:mt-6">
        {emptySlots.map((_, index) => (
          <span
            key={`empty-${index}`}
            className="aspect-square w-[calc(100%/7)]"
          />
        ))}

        {dayNumbers.map((day) => (
          <span
            key={day}
            onClick={() => handleDayClick(day)}
            className={cn(
              "flex aspect-square w-[calc(100%/7)] cursor-pointer items-center justify-center text-sm transition-all sm:text-base",
              isPast(day) && !isToday(day)
                ? "cursor-default text-white/25 hover:text-white/35"
                : "text-white/80 hover:text-white",
              isToday(day) &&
                "rounded-full bg-amber-500 text-white shadow-[0_0_1.5rem_1rem_rgba(239,144,17,0.3)]",
            )}
          >
            {day}
          </span>
        ))}
      </div>
    </AnimatedContainer>
  );
}
