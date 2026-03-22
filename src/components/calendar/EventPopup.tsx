"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, Clock, CalendarDays, Sparkles } from "lucide-react";
import { useEventContext } from "@/context/EventContext";
import { MAX_EVENT_TEXT_LENGTH, MONTHS_OF_YEAR } from "@/lib/constants";
import RippleButton from "@/components/shared/RippleButton";
import CTAShineButton from "@/components/shared/CTAShineButton";

/**
 * EventPopup — Full-screen modal (fixed overlay) for create/edit.
 * - Controlled by `showEventPopup` from context; backdrop click closes.
 * - Time fields are text + numeric inputMode (custom validation in useEvents).
 * - `editingEvent` switches title and primary button label.
 */
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function EventPopup() {
  const {
    showEventPopup,
    eventTime,
    eventText,
    editingEvent,
    selectedDate,
    handleTimeChange,
    handleTimeBlur,
    handleEventSubmit,
    setEventText,
    setShowEventPopup,
  } = useEventContext();

  /* Character counter UX: warn when close to MAX_EVENT_TEXT_LENGTH (from constants). */
  const remaining = MAX_EVENT_TEXT_LENGTH - eventText.length;
  const isNearLimit = remaining <= 15;
  const isAtLimit = remaining === 0;

  const dayName = DAY_NAMES[selectedDate.getDay()];
  const monthName = MONTHS_OF_YEAR[selectedDate.getMonth()];
  const dateNum = selectedDate.getDate();
  const year = selectedDate.getFullYear();

  return (
    <AnimatePresence>
      {showEventPopup && (
        /* Backdrop */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setShowEventPopup(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        >
          {/* Dialog card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#141920] shadow-[0_2rem_6rem_rgba(0,0,0,0.6)]"
          >
            {/* Gradient top bar */}
            <div className="h-1 w-full bg-gradient-to-r from-sky-500 via-violet-500 to-amber-500" />

            {/* Header */}
            <div className="flex items-start justify-between px-6 pt-5 pb-4">
              <div>
                <div className="flex items-center gap-2 text-white/40 text-xs uppercase tracking-widest mb-1">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {editingEvent ? "Edit Event" : "New Event"}
                </div>
                <h2 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-wide text-white leading-none">
                  {dayName},&nbsp;
                  <span className="text-sky-400">
                    {monthName} {dateNum}
                  </span>
                </h2>
                <p className="text-white/30 text-xs mt-1">{year}</p>
              </div>
              <RippleButton
                onClick={() => setShowEventPopup(false)}
                aria-label="Close event popup"
                className="rounded-xl p-2 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </RippleButton>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px bg-white/[0.06]" />

            {/* Body */}
            <div className="flex flex-col gap-5 px-6 py-5">
              {/* Time row */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
                  <Clock className="h-3.5 w-3.5" />
                  Time
                  <span className="rounded-md bg-sky-500/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-sky-400 normal-case">
                    24H
                  </span>
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      name="hours"
                      maxLength={2}
                      placeholder="00"
                      value={eventTime.hours}
                      onChange={handleTimeChange}
                      onBlur={handleTimeBlur}
                      onFocus={(e) => e.target.select()}
                      aria-label="Event hours"
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#0d1117] text-center text-xl font-semibold text-white transition-colors focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                    />
                    <span className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-white/30">
                      HH
                    </span>
                  </div>
                  <span className="mb-0 text-2xl font-bold text-white/30">
                    :
                  </span>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      name="minutes"
                      maxLength={2}
                      placeholder="00"
                      value={eventTime.minutes}
                      onChange={handleTimeChange}
                      onBlur={handleTimeBlur}
                      onFocus={(e) => e.target.select()}
                      aria-label="Event minutes"
                      className="h-12 w-full rounded-xl border border-white/10 bg-[#0d1117] text-center text-xl font-semibold text-white transition-colors focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                    />
                    <span className="absolute -bottom-5 left-0 right-0 text-center text-[10px] text-white/30">
                      MM
                    </span>
                  </div>
                </div>
              </div>

              {/* Textarea */}
              <div className="mt-2">
                <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-white/40">
                  <Sparkles className="h-3.5 w-3.5" />
                  Event Note
                </label>
                <div className="relative">
                  <textarea
                    placeholder="What's happening? Describe your event..."
                    value={eventText}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX_EVENT_TEXT_LENGTH) {
                        setEventText(e.target.value);
                      }
                    }}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-white/10 bg-[#0d1117] p-4 pb-8 text-sm text-white/80 transition-colors placeholder:text-white/25 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/30"
                  />
                  {/* Character counter */}
                  <span
                    className={`absolute bottom-2.5 right-3 text-xs font-medium tabular-nums transition-colors ${
                      isAtLimit
                        ? "text-rose-400"
                        : isNearLimit
                          ? "text-amber-400"
                          : "text-white/30"
                    }`}
                  >
                    {eventText.length}/{MAX_EVENT_TEXT_LENGTH}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <CTAShineButton
                onClick={handleEventSubmit}
                wrapperClassName="rounded-xl mt-1"
                className="h-12 w-full bg-gradient-to-r from-sky-500 to-violet-500 font-[family-name:var(--font-bebas-neue)] text-xl tracking-widest text-white shadow-[0_0_2rem_0.5rem_rgba(99,102,241,0.25)] transition-all hover:from-sky-400 hover:to-violet-400 hover:shadow-[0_0_2.5rem_1rem_rgba(99,102,241,0.35)]"
              >
                {editingEvent ? "Update Event" : "Add Event"}
              </CTAShineButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
