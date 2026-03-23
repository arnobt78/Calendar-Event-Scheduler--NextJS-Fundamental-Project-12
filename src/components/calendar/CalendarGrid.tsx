"use client";

import { useState, useEffect, useMemo } from "react";
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
    events,
  } = useEventContext();

  /**
   * today is set client-side only (via useEffect) to reflect the user's local timezone.
   * Using useMemo/new Date() here would run on Vercel's UTC servers and produce the
   * wrong date for users in timezones behind UTC.
   */
  const [today, setToday] = useState<Date | null>(null);

  /* After mount: set today in local timezone + allow event dots from localStorage. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setToday(new Date());
    setMounted(true);
  }, []);

  /** Events whose calendar day matches this cell (month view only). */
  const getEventsForDay = (day: number) => {
    if (!mounted) return [];
    return events.filter((e) => {
      const d = new Date(e.date);
      return (
        d.getDate() === day &&
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });
  };

  const emptySlots = useMemo(
    () => Array.from({ length: firstDayOfMonth }, (_, i) => i),
    [firstDayOfMonth],
  );

  const dayNumbers = useMemo(
    () => Array.from({ length: daysInMonth }, (_, i) => i + 1),
    [daysInMonth],
  );

  const isToday = (day: number): boolean => {
    if (!today) return false;
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  /** True if the cell is before today (still clickable visually; handleDayClick blocks new events). */
  const isPast = (day: number): boolean => {
    if (!today) return false;
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

        {dayNumbers.map((day) => {
          const dayEvents = getEventsForDay(day);
          // Outer span = click target; inner = circle. handleDayClick only opens popup for today/future.
          return (
            <span
              key={day}
              onClick={() => handleDayClick(day)}
              className={cn(
                "relative flex aspect-square w-[calc(100%/7)] cursor-pointer items-center justify-center",
                isPast(day) && !isToday(day) && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "relative flex h-10 w-10 items-center justify-center rounded-full text-sm transition-[color] sm:h-12 sm:w-12 sm:text-base",
                  isPast(day) && !isToday(day)
                    ? "text-white/25 hover:text-white/35"
                    : "text-white/80 hover:text-white",
                  isToday(day) &&
                    "bg-emerald-500 text-white shadow-[0_0_1.5rem_1rem_rgba(16,185,129,0.4)] ring-2 ring-emerald-400/30",
                  mounted &&
                    dayEvents.length > 0 &&
                    !isToday(day) &&
                    "ring-1 ring-sky-400/50",
                )}
              >
                {day}
              </span>
              {mounted && dayEvents.length > 1 && !isToday(day) && (
                <span className="absolute right-5 top-5 z-10 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold leading-none text-white shadow-sm">
                  {dayEvents.length}
                </span>
              )}
            </span>
          );
        })}
      </div>
    </AnimatedContainer>
  );
}
