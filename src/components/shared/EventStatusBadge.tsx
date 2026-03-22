import { getEventStatus } from "@/lib/utils";

const STATUS_CONFIG = {
  passed: {
    label: "Passed",
    className: "bg-white/10 text-white/35 border-white/10",
  },
  today: {
    label: "Today ✦",
    className: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  tomorrow: {
    label: "Tomorrow",
    className: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  },
  someday: {
    label: "Someday",
    className: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  },
} as const;

interface EventStatusBadgeProps {
  date: Date;
}

export default function EventStatusBadge({ date }: EventStatusBadgeProps) {
  const status = getEventStatus(date);
  const { label, className } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold leading-none ${className}`}
    >
      {label}
    </span>
  );
}
