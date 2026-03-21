"use client";

import { createContext, useContext } from "react";
import type { CalendarContextType } from "@/types";
import { useCalendar } from "@/hooks/useCalendar";
import { useEvents } from "@/hooks/useEvents";

/**
 * EventContext — React Context for sharing calendar + event state.
 *
 * The Context API lets us avoid "prop drilling" — instead of passing
 * state through multiple layers of components, any child component
 * can access shared state directly via `useEventContext()`.
 *
 * This context combines two hooks:
 * - useCalendar: month/year navigation
 * - useEvents: event CRUD operations
 *
 * @see https://react.dev/reference/react/createContext
 */
const EventContext = createContext<CalendarContextType | null>(null);

/**
 * EventProvider — Wraps children with calendar + event state.
 * Place this high in the component tree (e.g., in HomePage)
 * so all calendar components can access the shared state.
 *
 * @example
 * <EventProvider>
 *   <CalendarApp />
 * </EventProvider>
 */
export function EventProvider({ children }: { children: React.ReactNode }) {
  const calendar = useCalendar();
  const events = useEvents(calendar.currentMonth, calendar.currentYear);

  /* Combine both hook values into a single context value */
  const value: CalendarContextType = {
    ...calendar,
    ...events,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
}

/**
 * useEventContext — Consumer hook for accessing calendar + event state.
 *
 * Must be called inside an <EventProvider>. Throws a helpful error
 * if used outside the provider (a common beginner mistake).
 *
 * @example
 * const { events, currentMonth, handleDayClick } = useEventContext();
 */
export function useEventContext(): CalendarContextType {
  const context = useContext(EventContext);

  if (!context) {
    throw new Error(
      "useEventContext must be used within an <EventProvider>. " +
        "Wrap your component tree with <EventProvider> in a parent component.",
    );
  }

  return context;
}
