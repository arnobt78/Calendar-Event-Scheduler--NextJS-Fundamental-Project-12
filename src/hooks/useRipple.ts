"use client";

import { useCallback, useRef } from "react";

/**
 * useRipple — Custom hook that adds a Material-style ripple effect to a button.
 *
 * How it works (per RIPPLE_BUTTON_EFFECT.md):
 * 1. On click, a <span> element is created at the pointer position.
 * 2. The span expands (scale animation) and fades out via CSS animation.
 * 3. On animation end, the span is removed from the DOM.
 * 4. The ripple uses `pointer-events: none` so it doesn't interfere with clicks.
 *
 * The button element must have `position: relative` and `overflow: hidden`
 * so the ripple stays contained within the button boundaries.
 *
 * @returns {Object} containerRef — Attach this ref to the <button> element
 * @returns {Function} createRipple — Call this in the button's onClick handler
 *
 * @example
 * const { containerRef, createRipple } = useRipple();
 * <button ref={containerRef} onClick={createRipple}>Click me</button>
 */
export function useRipple() {
  const containerRef = useRef<HTMLButtonElement>(null);

  const createRipple = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const button = containerRef.current;
    if (!button) return;

    /* Calculate click position relative to the button */
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    /* Determine ripple size — use the larger dimension for a circular effect */
    const size = Math.max(rect.width, rect.height);

    /* Create the ripple span element */
    const ripple = document.createElement("span");
    ripple.style.position = "absolute";
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${x - size / 2}px`;
    ripple.style.top = `${y - size / 2}px`;
    ripple.style.borderRadius = "50%";
    ripple.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    ripple.style.pointerEvents = "none";
    ripple.style.animation = "ripple-expand 0.6s ease-out forwards";

    button.appendChild(ripple);

    /* Remove the ripple element after the animation completes */
    ripple.addEventListener("animationend", () => {
      ripple.remove();
    });
  }, []);

  return { containerRef, createRipple };
}
