import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — Utility for merging Tailwind CSS classes.
 * Combines `clsx` (conditional class joining) with `tailwind-merge`
 * (deduplicates conflicting Tailwind utilities like `p-2 p-4` → `p-4`).
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-blue-500", "px-6")
 * // → "py-2 px-6 bg-blue-500" (px-4 is overridden by px-6)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * getEventStatus — Returns the temporal status of a calendar event date
 * relative to today: "passed", "today", "tomorrow", or "someday".
 */
export function getEventStatus(
  eventDate: Date,
): "passed" | "today" | "tomorrow" | "someday" {
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const eventMidnight = new Date(
    new Date(eventDate).getFullYear(),
    new Date(eventDate).getMonth(),
    new Date(eventDate).getDate(),
  );
  const diff = eventMidnight.getTime() - todayMidnight.getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  if (diff < 0) return "passed";
  if (diff === 0) return "today";
  if (diff === ONE_DAY) return "tomorrow";
  return "someday";
}

/**
 * isSameDay — Checks if two Date objects represent the same calendar day.
 * Compares year, month, and date (ignores time).
 *
 * @example
 * isSameDay(new Date(2026, 2, 20), new Date(2026, 2, 20)) // true
 * isSameDay(new Date(2026, 2, 20), new Date(2026, 2, 21)) // false
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * getDaysInMonth — Returns the number of days in a given month/year.
 *
 * Uses the "day 0 of next month" trick:
 * `new Date(year, month + 1, 0)` gives the last day of `month`.
 *
 * @example
 * getDaysInMonth(2026, 1) // 28 (February 2026)
 * getDaysInMonth(2024, 1) // 29 (February 2024 — leap year)
 */
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * getFirstDayOfMonth — Returns the weekday index (0=Sun ... 6=Sat)
 * of the first day in a given month/year.
 *
 * Used to calculate how many empty cells to render before day 1
 * in the calendar grid.
 *
 * @example
 * getFirstDayOfMonth(2026, 2) // 0 (March 1, 2026 is Sunday)
 */
export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}
