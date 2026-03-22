"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, CalendarDays, CalendarCheck2 } from "lucide-react";
import { useEventContext } from "@/context/EventContext";
import { MONTHS_OF_YEAR } from "@/lib/constants";
import type { CalendarEvent } from "@/types";
import RippleButton from "@/components/shared/RippleButton";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import EventStatusBadge from "@/components/shared/EventStatusBadge";

function formatEventLabel(event: CalendarEvent) {
  const d = new Date(event.date);
  const date = `${MONTHS_OF_YEAR[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  const note =
    event.text.length > 30 ? event.text.slice(0, 30) + "…" : event.text;
  return { date, note };
}

export default function EventList() {
  const { events, handleEditEvent, handleDeleteEvent } = useEventContext();

  // Gate events-dependent UI until after hydration to avoid server/client mismatch.
  // Server + first client render both use empty placeholder; real events show after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [pendingEdit, setPendingEdit] = useState<CalendarEvent | null>(null);
  const [pendingDelete, setPendingDelete] = useState<CalendarEvent | null>(
    null,
  );

  // Use real events only after mount; before that, act as empty for hydration match
  const displayEvents = mounted ? events : [];

  // Group events by "Month YYYY" label, preserving sorted order
  const groupedEvents = displayEvents.reduce<
    { label: string; events: CalendarEvent[] }[]
  >((acc, event) => {
    const d = new Date(event.date);
    const label = `${MONTHS_OF_YEAR[d.getMonth()]} ${d.getFullYear()}`;
    const existing = acc.find((g) => g.label === label);
    if (existing) {
      existing.events.push(event);
    } else {
      acc.push({ label, events: [event] });
    }
    return acc;
  }, []);

  const confirmEdit = () => {
    if (pendingEdit) {
      handleEditEvent(pendingEdit);
      setPendingEdit(null);
    }
  };

  const confirmDelete = () => {
    if (pendingDelete) {
      handleDeleteEvent(pendingDelete.id);
      setPendingDelete(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-4 overflow-y-auto pr-1 [scrollbar-width:none] sm:w-[50%] sm:max-h-[calc(100vh-10rem)]">
      {/* Schedule count badge */}
      <div className="flex items-center gap-2">
        <CalendarCheck2 className="h-4 w-4 text-sky-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-white/40">
          Schedules
        </span>
        <span
          className={`ml-1 rounded-full px-2.5 py-0.5 text-xs font-bold tabular-nums ${
            displayEvents.length === 0
              ? "bg-white/10 text-white/30"
              : "bg-sky-500/20 text-sky-300"
          }`}
        >
          {displayEvents.length}
        </span>
      </div>

      {/* Empty state */}
      {displayEvents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-white/5 p-8 text-center backdrop-blur-sm"
        >
          <CalendarDays className="h-10 w-10 text-white/30" />
          <p className="text-sm text-white/50">
            No events yet. Click a date to add one!
          </p>
        </motion.div>
      )}

      {/* Event cards grouped by month */}
      <AnimatePresence mode="popLayout">
        {groupedEvents.map((group) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12, transition: { duration: 0.2 } }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            layout
            className="flex flex-col gap-3"
          >
            {/* Month group header */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold uppercase tracking-widest text-white/35">
                {group.label}
              </span>
              <span className="rounded-full bg-sky-500/15 px-2 py-0.5 text-[10px] font-bold tabular-nums text-sky-300 border border-sky-500/20">
                {group.events.length}
              </span>
              <span className="h-px flex-1 bg-white/8" />
            </div>

            {/* Cards in this group */}
            {group.events.map((event, index) => {
              const { date, note } = formatEventLabel(event);
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.06,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  layout
                  className="relative flex min-h-[4.5rem] overflow-hidden rounded-[20px] border border-sky-400/25 bg-gradient-to-br from-sky-500/20 via-sky-500/8 to-sky-500/3 shadow-[0_8px_32px_rgba(2,132,199,0.2)] backdrop-blur-sm transition-all hover:border-sky-300/40 hover:shadow-[0_12px_40px_rgba(2,132,199,0.3)]"
                >
                  {/* Left accent bar */}
                  <div className="w-1 shrink-0 bg-gradient-to-b from-sky-400 via-sky-500 to-sky-600" />

                  {/* Date + Time + Status */}
                  <div className="flex w-[38%] shrink-0 flex-col justify-center gap-1 border-r border-white/10 px-3 py-3">
                    <span className="text-[11px] leading-tight text-white/55">
                      {date}
                    </span>
                    <span className="text-base font-bold text-white">
                      {event.time}
                    </span>
                    <EventStatusBadge date={new Date(event.date)} />
                  </div>

                  {/* Event text */}
                  <div className="flex flex-1 items-center px-3 py-3 pr-10">
                    <p className="line-clamp-2 text-sm leading-relaxed text-white/80">
                      {note}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 flex-col gap-2">
                    <RippleButton
                      onClick={() => setPendingEdit(event)}
                      aria-label={`Edit event: ${event.text}`}
                      className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </RippleButton>
                    <RippleButton
                      onClick={() => setPendingDelete(event)}
                      aria-label={`Delete event: ${event.text}`}
                      className="rounded-full p-1.5 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                    >
                      <Trash2 className="h-4 w-4" />
                    </RippleButton>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Edit confirmation dialog */}
      {pendingEdit && (
        <ConfirmDialog
          open={!!pendingEdit}
          variant="edit"
          title="Update this event?"
          description={`${formatEventLabel(pendingEdit).date} · ${pendingEdit.time}\n"${formatEventLabel(pendingEdit).note}"`}
          onConfirm={confirmEdit}
          onCancel={() => setPendingEdit(null)}
        />
      )}

      {/* Delete confirmation dialog */}
      {pendingDelete && (
        <ConfirmDialog
          open={!!pendingDelete}
          variant="delete"
          title="Delete this event?"
          description={`${formatEventLabel(pendingDelete).date} · ${pendingDelete.time}\n"${formatEventLabel(pendingDelete).note}"`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  );
}
