"use client";

/**
 * ConfirmDialog — Small modal for destructive or important actions (edit/delete flow).
 * - `variant` picks icon, border, and confirm button styling from CONFIG.
 * - Backdrop click = cancel; inner card uses stopPropagation so clicks don't close accidentally.
 * - z-index 60 so it can stack above EventPopup (z-50) when both exist in the tree.
 */
import { AnimatePresence, motion } from "framer-motion";
import { PencilLine, Trash2 } from "lucide-react";
import RippleButton from "@/components/shared/RippleButton";

interface ConfirmDialogProps {
  open: boolean;
  variant: "edit" | "delete";
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/* Single source of truth for theming per variant — keeps JSX declarative. */
const CONFIG = {
  edit: {
    icon: PencilLine,
    iconClass: "text-sky-400",
    borderClass: "border-sky-500/30",
    accentClass: "bg-sky-500/10",
    confirmClass:
      "bg-sky-500 hover:bg-sky-400 shadow-[0_0_1.5rem_0.5rem_rgba(14,165,233,0.25)]",
    confirmLabel: "Yes, Update",
  },
  delete: {
    icon: Trash2,
    iconClass: "text-rose-400",
    borderClass: "border-rose-500/30",
    accentClass: "bg-rose-500/10",
    confirmClass:
      "bg-rose-500 hover:bg-rose-400 shadow-[0_0_1.5rem_0.5rem_rgba(244,63,94,0.25)]",
    confirmLabel: "Yes, Delete",
  },
};

export default function ConfirmDialog({
  open,
  variant,
  title,
  description,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const cfg = CONFIG[variant];
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onCancel}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 16 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-sm overflow-hidden rounded-3xl border bg-[#141920] shadow-[0_2rem_6rem_rgba(0,0,0,0.7)] ${cfg.borderClass}`}
          >
            {/* Icon header */}
            <div className={`flex justify-center px-6 pt-7 pb-4`}>
              <div className={`rounded-2xl p-3 ${cfg.accentClass}`}>
                <Icon className={`h-7 w-7 ${cfg.iconClass}`} />
              </div>
            </div>

            {/* Text */}
            <div className="px-6 pb-2 text-center">
              <h3 className="font-[family-name:var(--font-bebas-neue)] text-2xl tracking-wide text-white">
                {title}
              </h3>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-white/50">
                {description}
              </p>
            </div>

            {/* Divider */}
            <div className="mx-6 mt-4 h-px bg-white/[0.06]" />

            {/* Actions */}
            <div className="flex gap-3 p-5">
              <RippleButton
                onClick={onCancel}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-white/60 transition-colors hover:border-white/20 hover:text-white"
              >
                Cancel
              </RippleButton>
              <RippleButton
                onClick={onConfirm}
                className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors ${cfg.confirmClass}`}
              >
                {cfg.confirmLabel}
              </RippleButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
