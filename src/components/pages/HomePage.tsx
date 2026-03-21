"use client";

import { Suspense } from "react";
import { EventProvider } from "@/context/EventContext";
import CalendarApp from "@/components/calendar/CalendarApp";
import CalendarSkeleton from "@/components/shared/CalendarSkeleton";
import AnimatedContainer from "@/components/shared/AnimatedContainer";

/**
 * HomePage — Client-side page component.
 *
 * This is the main "use client" page that renders the full calendar application.
 * Separated from the server-side page.tsx to follow Next.js best practices:
 * - SSR code stays in app/page.tsx (server component)
 * - CSR code stays here (client component)
 *
 * Wraps the calendar in EventProvider so all child components
 * can access shared calendar + event state via Context API.
 *
 * Background uses glassmorphism pattern from UI_STYLING_GUIDE.md:
 * - Radial gradient overlays for depth
 * - Pointer-events-none blur layer
 */
export default function HomePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.15),transparent_55%),radial-gradient(circle_at_bottom,_rgba(236,72,153,0.12),transparent_65%)] bg-[#2c3542]">
      {/* Glassmorphism overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.05),transparent_60%)]" />

      {/* Main content container */}
      <div className="relative z-10 mx-auto w-full max-w-9xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatedContainer direction="bottom" delay={0}>
          <EventProvider>
            <Suspense fallback={<CalendarSkeleton />}>
              <CalendarApp />
            </Suspense>
          </EventProvider>
        </AnimatedContainer>
      </div>
    </div>
  );
}
