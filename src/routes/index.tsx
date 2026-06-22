import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import {
  leads,
  formatAED,
  monthlyPerformance,
  leadSourcesChart,
  leadSourcePerformance,
  agentPerformanceTable,
  pipelineValueCards,
  todayActivity,
} from "@/lib/mock-data";
import {
  Users,
  Flame,
  CalendarCheck2,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Plus,
  Zap,
  AlertTriangle,
  AlertCircle,
  UserPlus,
  Send,
  FileText,
  CheckCircle2,
  Wallet,
  TrendingUp,
  Coins,
  ShieldAlert,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Mirage Realty" },
      { name: "description", content: "Real-time overview of leads, pipeline, and deals." },
    ],
  }),
  component: Dashboard,
});

function KpiCard({
  label,
  value,
  delta,
  positive = true,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  delta: string;
  positive?: boolean;
  icon: React.ComponentType<{ className?: string }>;
  tone: "primary" | "hot" | "gold" | "success";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary",
    hot: "bg-hot/10 text-hot",
    gold: "bg-gold/15 text-gold-foreground",
    success: "bg-success/10 text-success",
  } as const;
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{value}</p>
        </div>
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneMap[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs">
        <span
          className={`inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 font-medium ${
            positive ? "bg-success/10 text-success" : "bg-hot/10 text-hot"
          }`}
        >
          {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {delta}
        </span>
        <span className="text-muted-foreground">vs last month</span>
      </div>
    </div>
  );
}

function AiRecommendations() {
  const items = [
    {
      icon: Zap,
      iconBg: "bg-hot/10",
      iconColor: "text-hot",
      message: "3 hot leads have not been contacted yet.",
      priority: "High",
      priorityBg: "bg-hot/10",
      priorityColor: "text-hot",
      action: "Review Leads",
      href: "/leads" as const,
    },
    {
      icon: AlertTriangle,
      iconBg: "bg-warning/15",
      iconColor: "text-warning",
      message: "2 follow-ups are overdue and need immediate attention.",
      priority: "High",
      priorityBg: "bg-hot/10",
      priorityColor: "text-hot",
      action: "View Follow Ups",
      href: "/follow-ups" as const,
    },
    {
      icon: CalendarCheck2,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      message: "1 property viewing is scheduled for tomorrow.",
      priority: "Medium",
      priorityBg: "bg-warning/15",
      priorityColor: "text-warning",
      action: "View Pipeline",
      href: "/pipeline" as const,
    },
    {
      icon: AlertCircle,
      iconBg: "bg-destructive/10",
      iconColor: "text-destructive",
      message: "AED 4.5M pipeline value may be at risk due to delayed follow-up.",
      priority: "High",
      priorityBg: "bg-hot/10",
      priorityColor: "text-hot",
      action: "Open Pipeline",
      href: "/pipeline" as const,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-foreground">AI Recommendations</h2>
        <p className="text-xs text-muted-foreground">Intelligent next steps based on your pipeline</p>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-3">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.iconBg} ${item.iconColor}`}>
              <item.icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{item.message}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${item.priorityBg} ${item.priorityColor}`}>
                  {item.priority}
                </span>
                <Link
                  to={item.href}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {item.action}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LeadSourcesChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-foreground">Lead Sources</h2>
        <p className="text-xs text-muted-foreground">Total leads by channel</p>
      </div>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={leadSourcesChart} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="source" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function RecentActivityPanel() {
  const iconMap = {
    "New Lead": { icon: UserPlus, bg: "bg-primary/10", color: "text-primary" },
    Contacted: { icon: Phone, bg: "bg-warning/15", color: "text-warning" },
    "Viewing Scheduled": { icon: CalendarCheck2, bg: "bg-gold/15", color: "text-gold-foreground" },
    "Offer Submitted": { icon: FileText, bg: "bg-chart-5/15", color: "text-chart-5" },
    "Deal Closed": { icon: CheckCircle2, bg: "bg-success/10", color: "text-success" },
  } as const;

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
        <p className="text-xs text-muted-foreground">Latest events across your pipeline</p>
      </div>
      <ul className="mt-4 space-y-3">
        {recentActivity.map((a) => {
          const { icon: Icon, bg, color } = iconMap[a.type];
          return (
            <li key={a.id} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-3">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{a.type}</p>
                <p className="text-xs text-muted-foreground">{a.leadName} — {a.detail}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{new Date(a.timestamp).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  <span>·</span>
                  <span>{a.agent}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LeadSourcePerformance() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Lead Source Performance</h2>
          <p className="text-xs text-muted-foreground">Total leads, hot leads, and conversion by source</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Total Leads</th>
              <th className="px-5 py-3 font-medium">Hot Leads</th>
              <th className="px-5 py-3 font-medium">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {leadSourcePerformance.map((s) => (
              <tr key={s.source} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                <td className="px-5 py-3 font-medium text-foreground">{s.source}</td>
                <td className="px-5 py-3 text-muted-foreground">{s.totalLeads}</td>
                <td className="px-5 py-3 text-muted-foreground">{s.hotLeads}</td>
                <td className="px-5 py-3">
                  <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    {s.conversionRate}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Dashboard() {
  const total = leads.length;
  const hot = leads.filter((l) => l.status === "Hot").length;
  const appts = leads.filter((l) => l.stage === "Viewing Scheduled").length;
  const closed = leads.filter((l) => l.stage === "Closed").length;
  const closedRevenue = leads
    .filter((l) => l.stage === "Closed")
    .reduce((a, b) => a + b.budget, 0);

  const recent = [...leads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);

  const upcoming = leads
    .filter((l) => l.nextFollowUp)
    .sort((a, b) => (a.nextFollowUp || "").localeCompare(b.nextFollowUp || ""))
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Welcome back, Layla. Here's what's moving today across your portfolio."
        actions={
          <>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent">
              <Download className="h-4 w-4" /> Export
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> New Lead
            </button>
          </>
        }
      />

      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Total Leads" value={String(total)} delta="+12.4%" icon={Users} tone="primary" />
          <KpiCard label="Hot Leads" value={String(hot)} delta="+8.1%" icon={Flame} tone="hot" />
          <KpiCard
            label="Appointments Scheduled"
            value={String(appts)}
            delta="+3 this week"
            icon={CalendarCheck2}
            tone="gold"
          />
          <KpiCard
            label="Deals Closed"
            value={String(closed)}
            delta={formatAED(closedRevenue)}
            icon={Trophy}
            tone="success"
          />
        </div>

        <AiRecommendations />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-foreground">Lead inflow</h2>
                <p className="text-xs text-muted-foreground">Last 6 months · across all sources</p>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-chart-1" /> Leads
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-gold" /> Deals
                </span>
              </div>
            </div>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gLeads" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gDeals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--gold)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--gold)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="leads" stroke="var(--chart-1)" fill="url(#gLeads)" strokeWidth={2} />
                  <Area type="monotone" dataKey="deals" stroke="var(--gold)" fill="url(#gDeals)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Upcoming follow-ups</h2>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
            <ul className="mt-4 space-y-3">
              {upcoming.map((l) => (
                <li key={l.id} className="flex items-start justify-between gap-3 rounded-lg border border-border/60 bg-background p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{l.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{l.interest}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">
                      {new Date(l.nextFollowUp!).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </p>
                    <StatusBadge status={l.status} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <LeadSourcesChart />
          </div>
          <RecentActivityPanel />
        </div>

        <LeadSourcePerformance />

        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <h2 className="text-base font-semibold text-foreground">Recent leads</h2>
              <p className="text-xs text-muted-foreground">Latest 6 enquiries from all channels</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Lead</th>
                  <th className="px-5 py-3 font-medium">Interest</th>
                  <th className="px-5 py-3 font-medium">Budget</th>
                  <th className="px-5 py-3 font-medium">Stage</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Agent</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((l) => (
                  <tr key={l.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="font-medium text-foreground">{l.name}</div>
                      <div className="text-xs text-muted-foreground">{l.nationality} · {l.source}</div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{l.interest}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{formatAED(l.budget)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{l.stage}</td>
                    <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{l.agent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
