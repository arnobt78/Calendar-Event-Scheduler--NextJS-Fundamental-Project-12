"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, CalendarDays, CalendarCheck2 } from "lucide-react";
import { useEventContext } from "@/context/EventContext";
import { MONTHS_OF_YEAR } from "@/lib/constants";
import type { CalendarEvent } from "@/types";
import RippleButton from "@/components/shared/RippleButton";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

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
    <div className="flex w-full flex-col gap-4 overflow-y-auto pr-1 [scrollbar-width:none] sm:w-[60%]">
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

      {/* Event cards */}
      <AnimatePresence mode="popLayout">
        {displayEvents.map((event, index) => {
          const { date, note } = formatEventLabel(event);
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60, transition: { duration: 0.2 } }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              layout
              className="relative flex items-center rounded-2xl border border-sky-400/20 bg-gradient-to-r from-sky-500/80 via-sky-500/70 to-sky-600/60 py-4 shadow-[0_10px_30px_rgba(2,132,199,0.25)] backdrop-blur-sm transition-all hover:border-sky-300/40 hover:shadow-[0_15px_40px_rgba(2,132,199,0.35)]"
            >
              {/* Date + Time column */}
              <div className="flex w-[30%] flex-col items-center border-r border-white/30 px-2">
                <span className="text-xs text-white/80 sm:text-sm">{date}</span>
                <span className="mt-1 text-base font-bold text-white sm:text-lg">
                  {event.time}
                </span>
              </div>

              {/* Event text */}
              <div className="w-[50%] break-words px-3 text-sm text-white sm:text-base">
                {note}
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
