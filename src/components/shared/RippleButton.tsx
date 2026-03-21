"use client";

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
    createRipple(e);
    onClick?.(e);
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
