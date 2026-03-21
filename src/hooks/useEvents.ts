"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { CheckCircle2, PencilLine, Trash2, AlertCircle } from "lucide-react";
import { createElement } from "react";
import type { CalendarEvent, EventTime } from "@/types";
import { isSameDay } from "@/lib/utils";
import { DEFAULT_EVENT_TIME } from "@/lib/constants";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatToastDate(date: Date, time: string) {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} · ${time}`;
}

function truncate(text: string, max = 36) {
  return text.length > max ? text.slice(0, max) + "…" : text;
}

function showToast(
  variant: "add" | "edit" | "delete" | "error",
  title: string,
  subtitle: string,
) {
  const styles = {
    add: {
      bg: "bg-emerald-950/90 border-emerald-500/40",
      icon: "text-emerald-400",
      title: "text-emerald-300",
      sub: "text-emerald-200/60",
      lucide: CheckCircle2,
    },
    edit: {
      bg: "bg-sky-950/90 border-sky-500/40",
      icon: "text-sky-400",
      title: "text-sky-300",
      sub: "text-sky-200/60",
      lucide: PencilLine,
    },
    delete: {
      bg: "bg-violet-950/90 border-violet-500/40",
      icon: "text-violet-400",
      title: "text-violet-300",
      sub: "text-violet-200/60",
      lucide: Trash2,
    },
    error: {
      bg: "bg-rose-950/90 border-rose-500/40",
      icon: "text-rose-400",
      title: "text-rose-300",
      sub: "text-rose-200/60",
      lucide: AlertCircle,
    },
  }[variant];

  toast.custom(() =>
    createElement(
      "div",
      {
        className: `flex items-start gap-3 w-[22rem] rounded-2xl border p-4 shadow-2xl backdrop-blur-sm ${styles.bg}`,
      },
      createElement(styles.lucide, {
        className: `mt-0.5 h-5 w-5 shrink-0 ${styles.icon}`,
      }),
      createElement(
        "div",
        { className: "flex flex-col gap-0.5" },
        createElement(
          "span",
          { className: `font-semibold leading-snug ${styles.title}` },
          title,
        ),
        createElement(
          "span",
          { className: `text-xs leading-snug ${styles.sub}` },
          subtitle,
        ),
      ),
    ),
  );
}

/**
 * useEvents — Custom hook for event CRUD operations.
 *
 * Manages the list of calendar events and all related UI state
 * (selected date, popup visibility, form fields, editing state).
 *
 * Extracted from the main CalendarApp to keep event logic
 * separate from calendar navigation (useCalendar hook).
 *
 * @param currentMonth - Currently displayed month (0-11)
 * @param currentYear  - Currently displayed year
 *
 * @example
 * const { events, handleDayClick, handleEventSubmit } = useEvents(month, year);
 */
const STORAGE_KEY = "calendar-todo-events";

/** Stable empty list for SSR + hydration (getServerSnapshot must keep same identity). */
const EMPTY_EVENTS: CalendarEvent[] = [];

const listeners = new Set<() => void>();

let cacheValid = false;
let cacheKey: string | null = null;
let cacheEvents: CalendarEvent[] = EMPTY_EVENTS;

function parseStored(raw: string | null): CalendarEvent[] {
  if (!raw) return EMPTY_EVENTS;
  try {
    const parsed = JSON.parse(raw) as CalendarEvent[];
    if (!parsed.length) return EMPTY_EVENTS;
    return parsed.map((e) => ({ ...e, date: new Date(e.date) }));
  } catch {
    return EMPTY_EVENTS;
  }
}

function readEventsFromStorage(): CalendarEvent[] {
  if (typeof window === "undefined") return EMPTY_EVENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return parseStored(raw);
  } catch {
    return EMPTY_EVENTS;
  }
}

function getSnapshot(): CalendarEvent[] {
  if (typeof window === "undefined") return EMPTY_EVENTS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (cacheValid && raw === cacheKey) return cacheEvents;
  cacheKey = raw;
  cacheEvents = parseStored(raw);
  cacheValid = true;
  return cacheEvents;
}

/**
 * Used only during SSR and during the *hydration* render on the client.
 * Must match server HTML — never read localStorage here.
 * @see https://react.dev/reference/react/useSyncExternalStore
 */
function getServerSnapshot(): CalendarEvent[] {
  return EMPTY_EVENTS;
}

function emitChange() {
  cacheValid = false;
  listeners.forEach((l) => l());
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  listeners.add(onStoreChange);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) {
      cacheValid = false;
      onStoreChange();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function persistEvents(next: CalendarEvent[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    emitChange();
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

export function useEvents(currentMonth: number, currentYear: number) {
  const events = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const setEvents = useCallback(
    (
      updater: CalendarEvent[] | ((prev: CalendarEvent[]) => CalendarEvent[]),
    ) => {
      if (typeof window === "undefined") return;
      const prev = readEventsFromStorage();
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistEvents(next);
    },
    [],
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [eventTime, setEventTime] = useState<EventTime>({
    ...DEFAULT_EVENT_TIME,
  });
  const [eventText, setEventText] = useState("");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  /**
   * handleDayClick — Called when a user clicks a day in the calendar grid.
   * Only allows selecting today or future dates (prevents adding events to the past).
   * Opens the event popup with a fresh form.
   */
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const today = new Date();

    if (clickedDate >= today || isSameDay(clickedDate, today)) {
      setSelectedDate(clickedDate);
      setShowEventPopup(true);
      setEventTime({ ...DEFAULT_EVENT_TIME });
      setEventText("");
      setEditingEvent(null);
    }
  };

  /**
   * handleEventSubmit — Creates a new event or updates an existing one.
   * Events are sorted by date after each change to keep the list ordered.
   */
  const handleEventSubmit = () => {
    if (!eventText.trim()) {
      showToast(
        "error",
        "Event note is empty",
        "Please write something before saving.",
      );
      return;
    }

    const time = `${eventTime.hours.padStart(2, "0")}:${eventTime.minutes.padStart(2, "0")}`;
    const newEvent: CalendarEvent = {
      id: editingEvent ? editingEvent.id : Date.now(),
      date: selectedDate,
      time,
      text: eventText,
    };

    const isEdit = !!editingEvent;

    setEvents((prev) => {
      let updatedEvents = [...prev];
      if (isEdit) {
        updatedEvents = updatedEvents.map((event) =>
          event.id === editingEvent!.id ? newEvent : event,
        );
      } else {
        updatedEvents.push(newEvent);
      }
      updatedEvents.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      return updatedEvents;
    });
    setEventTime({ ...DEFAULT_EVENT_TIME });
    setEventText("");
    setShowEventPopup(false);
    setEditingEvent(null);

    if (isEdit) {
      showToast(
        "edit",
        "Event updated",
        `${formatToastDate(selectedDate, time)} · ${truncate(eventText)}`,
      );
    } else {
      showToast(
        "add",
        "Event added",
        `${formatToastDate(selectedDate, time)} · ${truncate(eventText)}`,
      );
    }
  };

  /**
   * handleEditEvent — Populates the event form with existing event data
   * and opens the popup in "edit mode".
   */
  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedDate(new Date(event.date));
    setEventTime({
      hours: event.time.split(":")[0],
      minutes: event.time.split(":")[1],
    });
    setEventText(event.text);
    setEditingEvent(event);
    setShowEventPopup(true);
  };

  /**
   * handleDeleteEvent — Removes an event from the list by its unique id.
   */
  const handleDeleteEvent = (eventId: number) => {
    let target: CalendarEvent | undefined;
    setEvents((prev) => {
      target = prev.find((e) => e.id === eventId);
      return prev.filter((event) => event.id !== eventId);
    });
    if (target) {
      showToast(
        "delete",
        "Event deleted",
        `${formatToastDate(new Date(target.date), target.time)} · ${truncate(target.text)}`,
      );
    }
  };

  /**
   * handleTimeChange — Updates hours or minutes in the event time state.
   * Pads single-digit values with a leading zero (e.g., "9" → "09").
   */
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/\D/g, "").slice(0, 2);
    // Clamp in real-time: hours 0–23, minutes 0–59
    if (cleaned.length === 2) {
      const num = parseInt(cleaned, 10);
      const max = name === "hours" ? 23 : 59;
      if (num > max) return; // reject the keystroke silently
    }
    setEventTime((prev) => ({ ...prev, [name]: cleaned }));
  };

  const handleTimeBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Pad to 2 digits on blur so display stays clean
    const num = parseInt(value || "0", 10);
    const clamped = name === "hours" ? Math.min(num, 23) : Math.min(num, 59);
    setEventTime((prev) => ({
      ...prev,
      [name]: String(clamped).padStart(2, "0"),
    }));
  };

  return {
    events,
    selectedDate,
    showEventPopup,
    eventTime,
    eventText,
    editingEvent,
    handleDayClick,
    handleEventSubmit,
    handleEditEvent,
    handleDeleteEvent,
    handleTimeChange,
    handleTimeBlur,
    setEventText,
    setShowEventPopup,
  };
}
