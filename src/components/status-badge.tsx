import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/lib/mock-data";

export function StatusBadge({ status }: { status: LeadStatus }) {
  const map: Record<LeadStatus, string> = {
    Hot: "bg-hot/10 text-hot ring-1 ring-inset ring-hot/30",
    Warm: "bg-warning/15 text-warning ring-1 ring-inset ring-warning/30",
    Cold: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
  };
  const dot: Record<LeadStatus, string> = {
    Hot: "bg-hot",
    Warm: "bg-warning",
    Cold: "bg-muted-foreground",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        map[status],
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", dot[status])} />
      {status}
    </span>
  );
}
