/**
 * @file Shared contracts for calendar UI + `EventContext`.
 * Keeping types here avoids circular imports and documents the public shape of hooks/context.
 */

/**
 * CalendarEvent — Represents a single calendar event/todo item.
 * Each event has a unique id, associated date, time slot, and description text.
 *
 * @example
 * const event: CalendarEvent = {
 *   id: Date.now(),
 *   date: new Date(2026, 2, 20),
 *   time: "14:30",
 *   text: "Team standup meeting",
 * };
 */
export interface CalendarEvent {
  id: number;
  date: Date;
  time: string;
  text: string;
}

/**
 * EventTime — Represents hours and minutes as zero-padded strings.
 * Used by the event creation/edit form for time input fields.
 *
 * @example
 * const time: EventTime = { hours: "09", minutes: "30" };
 */
export interface EventTime {
  hours: string;
  minutes: string;
}

/**
 * CalendarContextType — Shape of the calendar context value.
 * Provides all state and actions needed by calendar sub-components.
 *
 * This follows the Context API pattern: a single context provides both
 * calendar navigation state (month/year) and event CRUD operations,
 * so child components can access shared state without prop drilling.
 */
export interface CalendarContextType {
  /* ── Calendar navigation state ── */
  currentMonth: number;
  currentYear: number;
  daysInMonth: number;
  firstDayOfMonth: number;
  prevMonth: () => void;
  nextMonth: () => void;

  /* ── Event CRUD state ── */
  events: CalendarEvent[];
  selectedDate: Date;
  showEventPopup: boolean;
  eventTime: EventTime;
  eventText: string;
  editingEvent: CalendarEvent | null;

  /* ── Event CRUD actions ── */
  handleDayClick: (day: number) => void;
  handleEventSubmit: () => void;
  handleEditEvent: (event: CalendarEvent) => void;
  handleDeleteEvent: (eventId: number) => void;
  handleTimeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTimeBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  setEventText: (text: string) => void;
  setShowEventPopup: (show: boolean) => void;
}

/**
 * AnimationDirection — Defines the direction from which
 * a component animates into view using framer-motion.
 */
export type AnimationDirection = "left" | "right" | "bottom";
