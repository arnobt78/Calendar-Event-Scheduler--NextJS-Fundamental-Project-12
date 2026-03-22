"use client";

import { useState, useMemo } from "react";
import { getDaysInMonth, getFirstDayOfMonth } from "@/lib/utils";

/**
 * useCalendar — Custom hook for calendar navigation state.
 *
 * Manages the currently displayed month/year and provides
 * navigation functions (prevMonth / nextMonth). Also computes
 * derived values like daysInMonth and firstDayOfMonth.
 *
 * This hook is extracted from the main CalendarApp component
 * to separate navigation concerns from event management.
 *
 * @example
 * const { currentMonth, currentYear, prevMonth, nextMonth } = useCalendar();
 */
export function useCalendar() {
  /* Initial view = user's current month/year when the provider first mounts. */
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  /**
   * Navigate to the previous month.
   * When going from January (0) → wraps to December (11) of the previous year.
   */
  const prevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  /**
   * Navigate to the next month.
   * When going from December (11) → wraps to January (0) of the next year.
   */
  const nextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  /**
   * Memoized computed values — only recalculate when month/year changes.
   * - daysInMonth: Total number of days in the current month
   * - firstDayOfMonth: Weekday index (0=Sun) of the 1st day
   */
  const daysInMonth = useMemo(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  const firstDayOfMonth = useMemo(
    () => getFirstDayOfMonth(currentYear, currentMonth),
    [currentYear, currentMonth],
  );

  return {
    currentMonth,
    currentYear,
    daysInMonth,
    firstDayOfMonth,
    prevMonth,
    nextMonth,
  };
}
