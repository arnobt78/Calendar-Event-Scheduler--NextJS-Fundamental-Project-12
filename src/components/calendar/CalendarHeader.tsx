"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEventContext } from "@/context/EventContext";
import { MONTHS_OF_YEAR } from "@/lib/constants";
import RippleButton from "@/components/shared/RippleButton";
import AnimatedContainer from "@/components/shared/AnimatedContainer";

/**
 * CalendarHeader — Displays the calendar title, current month/year,
 * and navigation buttons to move between months.
 *
 * Uses:
 * - Bebas Neue font for the "Calendar" heading
 * - Lucide icons for chevron arrows (replaced Boxicons CDN)
 * - RippleButton for interactive navigation buttons
 * - AnimatedContainer for slide-in-from-left entrance
 */
export default function CalendarHeader() {
  const { currentMonth, currentYear, prevMonth, nextMonth } = useEventContext();

  return (
    <AnimatedContainer direction="left" delay={0.1}>
      <h1 className="font-[family-name:var(--font-bebas-neue)] text-5xl tracking-wider text-white sm:text-6xl lg:text-7xl">
        Calendar
      </h1>

      <div className="mt-6 flex items-center gap-3 sm:mt-8">
        <h2 className="text-lg text-white/70 sm:text-xl">
          {MONTHS_OF_YEAR[currentMonth]},
        </h2>
        <h2 className="text-lg text-white/70 sm:text-xl">{currentYear}</h2>

        <div className="ml-auto flex gap-2">
          <RippleButton
            onClick={prevMonth}
            aria-label="Previous month"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2c3542] text-amber-500 transition-colors hover:bg-[#3a4556]"
          >
            <ChevronLeft className="h-5 w-5" />
          </RippleButton>
          <RippleButton
            onClick={nextMonth}
            aria-label="Next month"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2c3542] text-amber-500 transition-colors hover:bg-[#3a4556]"
          >
            <ChevronRight className="h-5 w-5" />
          </RippleButton>
        </div>
      </div>
    </AnimatedContainer>
  );
}
