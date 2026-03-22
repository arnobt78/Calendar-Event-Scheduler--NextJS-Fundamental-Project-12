/**
 * Calendar constants — Used across calendar components.
 *
 * These are declared as `readonly` tuple types (`as const`) so TypeScript
 * infers literal types instead of `string[]`. This provides better
 * autocompletion and prevents accidental mutation.
 */

/** Days of the week — Sunday-first (matches JS Date.getDay()) */
export const DAYS_OF_WEEK = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
] as const;

/** Full month names — index matches JS Date.getMonth() (0 = January) */
export const MONTHS_OF_YEAR = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

/** Maximum characters allowed in an event description */
export const MAX_EVENT_TEXT_LENGTH = 60;

/** Empty strings until user types; blur handler in useEvents pads to "00" if left blank. */
export const DEFAULT_EVENT_TIME = { hours: "", minutes: "" } as const;
