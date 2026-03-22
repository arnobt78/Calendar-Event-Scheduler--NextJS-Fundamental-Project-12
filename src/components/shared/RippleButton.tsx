"use client";

/**
 * RippleButton — Native <button> with Material-style ripple + forwarded props (aria, type, disabled).
 * Composes useRipple: must keep `relative overflow-hidden` on the button for clipping.
 */
import { useRipple } from "@/hooks/useRipple";
import { cn } from "@/lib/utils";

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function RippleButton({
  children,
  className,
  onClick,
  ...props
}: RippleButtonProps) {
  const { containerRef, createRipple } = useRipple();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(e); // visual feedback first
    onClick?.(e); // then parent handler (e.g. navigate, submit)
  };

  return (
    <button
      ref={containerRef}
      className={cn("relative overflow-hidden", className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}

export default RippleButton;
