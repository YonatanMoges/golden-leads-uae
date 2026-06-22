import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { leads, formatAED } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import {
  CalendarClock,
  CheckCircle2,
  Phone,
  MessageSquare,
  Mail,
  Eye,
  RotateCw,
  ExternalLink,
  Check,
} from "lucide-react";

export const Route = createFileRoute("/follow-ups")({
  head: () => ({
    meta: [
      { title: "Follow Ups — Mirage Realty" },
      { name: "description", content: "Stay on top of every scheduled follow-up with your leads." },
    ],
  }),
  component: FollowUpsPage,
});

type FollowUpType = "Call" | "WhatsApp" | "Email" | "Viewing";
type Priority = "High" | "Medium" | "Low";
type FollowUpStatus = "Pending" | "Completed";
type Bucket = "today" | "overdue" | "upcoming" | "completed";

interface FollowUpTask {
  id: string;
  leadId: string;
  leadName: string;
  agent: string;
  type: FollowUpType;
  dueAt: string; // ISO
  priority: Priority;
  status: FollowUpStatus;
  note: string;
  interest: string;
  budget: number;
}

const TODAY = new Date("2026-06-22T09:00:00");

const TYPE_META: Record<FollowUpType, { icon: typeof Phone; tone: string }> = {
  Call: { icon: Phone, tone: "bg-primary/10 text-primary ring-primary/30" },
  WhatsApp: { icon: MessageSquare, tone: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30" },
  Email: { icon: Mail, tone: "bg-blue-500/10 text-blue-600 ring-blue-500/30" },
  Viewing: { icon: Eye, tone: "bg-violet-500/10 text-violet-600 ring-violet-500/30" },
};

const PRIORITY_TONE: Record<Priority, string> = {
  High: "bg-hot/10 text-hot ring-hot/30",
  Medium: "bg-gold/20 text-gold-foreground ring-gold/40",
  Low: "bg-muted text-muted-foreground ring-border",
};

function makeTasks(): FollowUpTask[] {
  // Build tasks from leads with nextFollowUp + add curated UAE samples
  const fromLeads: FollowUpTask[] = leads
    .filter((l) => l.nextFollowUp)
    .map((l, i) => {
      const types: FollowUpType[] = ["Call", "WhatsApp", "Email", "Viewing"];
      const priorities: Priority[] = l.status === "Hot" ? ["High"] : l.status === "Warm" ? ["Medium"] : ["Low"];
      const hour = 9 + (i % 8);
      return {
        id: `F-${l.id}`,
        leadId: l.id,
        leadName: l.name,
        agent: l.agent,
        type: types[i % types.length],
        dueAt: `${l.nextFollowUp}T${String(hour).padStart(2, "0")}:00:00`,
        priority: priorities[0],
        status: "Pending",
        note: `Follow up on ${l.interest}`,
        interest: l.interest,
        budget: l.budget,
      };
    });

  const completed: FollowUpTask[] = [
    {
      id: "F-C-1033",
      leadId: "L-1033",
      leadName: "Sophie Laurent",
      agent: "Layla Hassan",
      type: "Call",
      dueAt: "2026-06-20T14:00:00",
      priority: "High",
      status: "Completed",
      note: "Closing call — JBR Bahar deal signed",
      interest: "JBR · Bahar",
      budget: 3_900_000,
    },
    {
      id: "F-C-1028",
      leadId: "L-1028",
      leadName: "Rajesh Patel",
      agent: "Layla Hassan",
      type: "Viewing",
      dueAt: "2026-06-18T11:30:00",
      priority: "High",
      status: "Completed",
      note: "Viewing completed at Jumeirah Golf Estates",
      interest: "Jumeirah Golf Estates · Earth",
      budget: 9_500_000,
    },
    {
      id: "F-C-1034",
      leadId: "L-1034",
      leadName: "Yusuf Demir",
      agent: "Sara Ibrahim",
      type: "WhatsApp",
      dueAt: "2026-06-19T16:15:00",
      priority: "Medium",
      status: "Completed",
      note: "Sent handover documents for Dubai Hills villa",
      interest: "Dubai Hills · Golf Place",
      budget: 5_600_000,
    },
  ];

  return [...fromLeads, ...completed];
}

function bucketize(task: FollowUpTask): Bucket {
  if (task.status === "Completed") return "completed";
  const due = new Date(task.dueAt);
  const isToday = due.toDateString() === TODAY.toDateString();
  if (isToday) return "today";
  if (due.getTime() < TODAY.getTime()) return "overdue";
  return "upcoming";
}

function formatDue(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function FollowUpsPage() {
  const [tasks, setTasks] = useState<FollowUpTask[]>(() => makeTasks());
  const [tab, setTab] = useState<Bucket>("today");
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleValue, setRescheduleValue] = useState<string>("");

  const counts = useMemo(() => {
    const c = { today: 0, overdue: 0, upcoming: 0, completed: 0 } as Record<Bucket, number>;
    tasks.forEach((t) => {
      c[bucketize(t)]++;
    });
    return c;
  }, [tasks]);

  const visible = useMemo(
    () =>
      tasks
        .filter((t) => bucketize(t) === tab)
        .sort((a, b) => a.dueAt.localeCompare(b.dueAt)),
    [tasks, tab],
  );

  function markComplete(id: string) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Completed" } : t)));
  }

  function openReschedule(task: FollowUpTask) {
    // default: 2 days from current dueAt, preserve time
    const d = new Date(task.dueAt);
    d.setDate(d.getDate() + 2);
    const pad = (n: number) => String(n).padStart(2, "0");
    const local = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    setRescheduleValue(local);
    setRescheduleId(task.id);
  }

  function confirmReschedule() {
    if (!rescheduleId || !rescheduleValue) return;
    const iso = `${rescheduleValue}:00`;
    setTasks((prev) =>
      prev.map((t) => (t.id === rescheduleId ? { ...t, dueAt: iso, status: "Pending" } : t)),
    );
    // jump user to the bucket the task now lives in
    const newBucket = bucketize({ ...tasks.find((t) => t.id === rescheduleId)!, dueAt: iso, status: "Pending" });
    setTab(newBucket);
    setRescheduleId(null);
  }

  const tabs: { key: Bucket; label: string; tone: string }[] = [
    { key: "today", label: "Due Today", tone: "text-foreground" },
    { key: "overdue", label: "Overdue", tone: "text-hot" },
    { key: "upcoming", label: "Upcoming", tone: "text-foreground" },
    { key: "completed", label: "Completed", tone: "text-emerald-600" },
  ];

  return (
    <div>
      <PageHeader
        title="Follow-Up Center"
        description="Track every scheduled outreach across your UAE portfolio."
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`rounded-xl border bg-card p-5 text-left shadow-sm transition-colors ${
                tab === t.key ? "border-primary ring-1 ring-primary/30" : "border-border hover:bg-accent/30"
              }`}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {t.label}
              </p>
              <p className={`mt-2 text-3xl font-semibold ${t.tone}`}>{counts[t.key]}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t.key === "today" && "Scheduled for 22 June 2026"}
                {t.key === "overdue" && "Needs immediate attention"}
                {t.key === "upcoming" && "Next 14 days"}
                {t.key === "completed" && "Logged this week"}
              </p>
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center gap-1 border-b border-border bg-muted/30 px-3 py-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex h-8 items-center rounded-md px-3 text-sm font-medium transition-colors ${
                  tab === t.key
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
                <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-xs">
                  {counts[t.key]}
                </span>
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div className="px-5 py-16 text-center text-sm text-muted-foreground">
              No tasks in this bucket.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {visible.map((task) => {
                const TypeIcon = TYPE_META[task.type].icon;
                return (
                  <li
                    key={task.id}
                    className="flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                        {task.leadName
                          .split(" ")
                          .map((p) => p[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{task.leadName}</p>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${TYPE_META[task.type].tone}`}
                          >
                            <TypeIcon className="h-3 w-3" />
                            {task.type}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${PRIORITY_TONE[task.priority]}`}
                          >
                            {task.priority} priority
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${
                              task.status === "Completed"
                                ? "bg-emerald-500/10 text-emerald-600 ring-emerald-500/30"
                                : "bg-muted text-muted-foreground ring-border"
                            }`}
                          >
                            {task.status === "Completed" && <Check className="h-3 w-3" />}
                            {task.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {task.note} · {formatAED(task.budget)}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span className="inline-flex items-center gap-1">
                            <CalendarClock className="h-3 w-3" />
                            {formatDue(task.dueAt)}
                          </span>
                          <span>Agent: {task.agent}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => markComplete(task.id)}
                        disabled={task.status === "Completed"}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground hover:bg-accent disabled:opacity-50"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" /> Mark Complete
                      </button>
                      <button
                        onClick={() => openReschedule(task)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-foreground hover:bg-accent"
                      >
                        <RotateCw className="h-3.5 w-3.5" /> Reschedule
                      </button>
                      <Link
                        to="/lead-details/$leadId"
                        params={{ leadId: task.leadId }}
                        className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-2.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                      >
                        <ExternalLink className="h-3.5 w-3.5" /> Open Lead
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {rescheduleId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setRescheduleId(null)}
        >
          <div
            className="w-full max-w-sm rounded-xl border border-border bg-card p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-foreground">Reschedule follow-up</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Pick a new date and time. The task will move to the matching bucket.
            </p>
            <label className="mt-4 block text-xs font-medium text-foreground">
              New date & time
              <input
                type="datetime-local"
                value={rescheduleValue}
                onChange={(e) => setRescheduleValue(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </label>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setRescheduleId(null)}
                className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={confirmReschedule}
                className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
