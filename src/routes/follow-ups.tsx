import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { leads, formatAED } from "@/lib/mock-data";
import { Phone, Mail, MessageSquare, CalendarClock } from "lucide-react";

export const Route = createFileRoute("/follow-ups")({
  head: () => ({
    meta: [
      { title: "Follow Ups — Mirage Realty" },
      { name: "description", content: "Stay on top of every scheduled follow-up with your leads." },
    ],
  }),
  component: FollowUpsPage,
});

function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date("2026-06-17");
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return { label: "Overdue", tone: "bg-hot/10 text-hot ring-hot/30" };
  if (diff === 0) return { label: "Today", tone: "bg-gold/20 text-gold-foreground ring-gold/40" };
  if (diff === 1) return { label: "Tomorrow", tone: "bg-primary/10 text-primary ring-primary/30" };
  return { label: `In ${diff} days`, tone: "bg-muted text-muted-foreground ring-border" };
}

function FollowUpsPage() {
  const items = leads
    .filter((l) => l.nextFollowUp)
    .sort((a, b) => (a.nextFollowUp || "").localeCompare(b.nextFollowUp || ""));

  const overdue = items.filter((l) => new Date(l.nextFollowUp!) < new Date("2026-06-17")).length;
  const today = items.filter(
    (l) => new Date(l.nextFollowUp!).toDateString() === new Date("2026-06-17").toDateString(),
  ).length;

  return (
    <div>
      <PageHeader
        title="Follow Ups"
        description="Reach out at the right time. Every conversation logged and prioritized."
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Overdue</p>
            <p className="mt-2 text-3xl font-semibold text-hot">{overdue}</p>
            <p className="mt-1 text-xs text-muted-foreground">Contact today to avoid losing</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Due Today</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{today}</p>
            <p className="mt-1 text-xs text-muted-foreground">Scheduled for 17 June 2026</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Upcoming</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{items.length - overdue - today}</p>
            <p className="mt-1 text-xs text-muted-foreground">In the next 14 days</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-5 py-4">
            <h2 className="text-base font-semibold text-foreground">Scheduled follow-ups</h2>
            <p className="text-xs text-muted-foreground">Sorted by due date</p>
          </div>
          <ul className="divide-y divide-border">
            {items.map((l) => {
              const due = dayLabel(l.nextFollowUp!);
              return (
                <li key={l.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                      {l.name
                        .split(" ")
                        .map((p) => p[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{l.name}</p>
                        <StatusBadge status={l.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {l.interest} · {formatAED(l.budget)} · {l.stage}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${due.tone}`}
                    >
                      <CalendarClock className="h-3 w-3" />
                      {due.label} ·{" "}
                      {new Date(l.nextFollowUp!).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                    <div className="flex items-center gap-1">
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                        <Phone className="h-3.5 w-3.5" />
                      </button>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                        <MessageSquare className="h-3.5 w-3.5" />
                      </button>
                      <button className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                        <Mail className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
