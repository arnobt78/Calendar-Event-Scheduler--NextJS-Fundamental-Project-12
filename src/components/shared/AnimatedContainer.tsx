"use client";

import { motion } from "framer-motion";
import type { AnimationDirection } from "@/types";
import { cn } from "@/lib/utils";

/**
 * AnimatedContainerProps — Configuration for entrance animations.
 */
interface AnimatedContainerProps {
  children: React.ReactNode;
  /** Direction the element slides in from */
  direction?: AnimationDirection;
  /** Delay before animation starts (seconds) */
  delay?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * getInitialPosition — Maps a direction to framer-motion initial values.
 * Returns the x/y offset the element starts at before animating to position.
 */
function getInitialPosition(direction: AnimationDirection) {
  switch (direction) {
    case "left":
      return { x: -60, y: 0 };
    case "right":
      return { x: 60, y: 0 };
    case "bottom":
      return { x: 0, y: 60 };
  }
}

/**
 * AnimatedContainer — Wraps children with a framer-motion entrance animation.
 *
 * Elements slide in from the specified direction and fade in simultaneously.
 * Used throughout the app to give each UI element a dramatic appearance:
 * - Calendar header: slides from left
 * - Calendar grid: slides from bottom
 * - Event cards: slide from right with stagger
 *
 * The animation triggers once when the component first mounts.
 *
 * @example
 * <AnimatedContainer direction="right" delay={0.2}>
 *   <EventCard />
 * </AnimatedContainer>
 */
export default function AnimatedContainer({
  children,
  direction = "bottom",
  delay = 0,
  className,
}: AnimatedContainerProps) {
  const initial = getInitialPosition(direction);

  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...initial }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}
