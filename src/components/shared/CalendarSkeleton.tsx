"use client";

/**
 * CalendarSkeleton — Loading placeholder that matches the calendar layout.
 *
 * Displays a pulse-animated skeleton with the same dimensions as the
 * real calendar + event list. This prevents layout shift and provides
 * a polished loading experience.
 *
 * The skeleton is static and stable — no flicker or flash on refresh.
 */
export default function CalendarSkeleton() {
  return (
    <div className="flex w-full flex-col gap-8 sm:flex-row">
      {/* Calendar side skeleton */}
      <div className="w-full space-y-4 sm:w-[50%]">
        <div className="h-12 w-40 animate-pulse rounded-lg bg-white/5" />
        <div className="flex items-center gap-3">
          <div className="h-8 w-28 animate-pulse rounded-lg bg-white/5" />
          <div className="h-8 w-16 animate-pulse rounded-lg bg-white/5" />
          <div className="ml-auto flex gap-2">
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/5" />
            <div className="h-9 w-9 animate-pulse rounded-full bg-white/5" />
          </div>
        </div>
        <div className="flex justify-between">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-5 w-8 animate-pulse rounded bg-white/5" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: 42 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-full bg-white/5"
            />
          ))}
        </div>
      </div>
      {/* Events side skeleton */}
      <div className="w-full space-y-4 sm:w-[50%]">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex h-[4.5rem] animate-pulse items-center gap-4 rounded-2xl bg-white/5 px-4"
          >
            <div className="h-10 w-20 rounded bg-white/5" />
            <div className="h-4 flex-1 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}
