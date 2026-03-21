"use client";

import RippleButton from "@/components/shared/RippleButton";
import { cn } from "@/lib/utils";

/**
 * CTAShineButtonProps — Props for the CTA shine wrapper.
 */
interface CTAShineButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  /** Additional classes for the outer shine wrapper */
  wrapperClassName?: string;
}

/**
 * CTAShineButton — A CTA button with auto-playing shine sweep + ripple on click.
 *
 * Combines two effects (per RIPPLE_BUTTON_EFFECT.md):
 * 1. **Shine sweep**: A glossy highlight continuously sweeps across the button
 *    surface to draw attention (uses CSS ::after pseudo-element animation).
 * 2. **Ripple on click**: Standard ripple effect from RippleButton.
 *
 * Use this for primary call-to-action buttons like "Add Event", "Submit", etc.
 *
 * @example
 * <CTAShineButton className="px-8 py-3 bg-amber-500 text-white rounded-full">
 *   Add Event
 * </CTAShineButton>
 */
export default function CTAShineButton({
  children,
  className,
  wrapperClassName,
  ...props
}: CTAShineButtonProps) {
  return (
    <div className={cn("cta-shine-wrap", wrapperClassName)}>
      <RippleButton className={cn("cta-shine-button", className)} {...props}>
        {children}
      </RippleButton>
    </div>
  );
}
