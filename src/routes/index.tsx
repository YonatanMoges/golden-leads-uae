import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import {
  formatAED,
  monthlyPerformance,
  leadSourcesChart,
  leadSourcePerformance,
  agentPerformanceTable,
  todayActivity,
  type Lead,
} from "@/lib/mock-data";

import { useLeads } from "@/hooks/useLeads";

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

import {
  getKPIs,
  getRecentLeads,
  getUpcomingFollowUps,
  getPipelineValueCards,
} from "@/lib/dashboard";

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

function AiRecommendations({ leads }: { leads: Lead[] }) {
  const hotNotContacted = leads.filter(
    (lead) => lead.status === "Hot" && lead.stage === "New Lead"
  );
  
  const overdueFollowUps = leads.filter((lead) => {
    if (!lead.nextFollowUp) return false;
    return new Date(lead.nextFollowUp) < new Date();
  });
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowString = tomorrow.toISOString().slice(0, 10);
  
  const viewingsTomorrow = leads.filter(
    (lead) =>
      lead.stage === "Viewing Scheduled" &&
      lead.nextFollowUp === tomorrowString
  );
  
  const atRiskValue = hotNotContacted.reduce(
    (sum, lead) => sum + lead.budget,
    0
  );
  
  const items = [
    {
      icon: Zap,
      iconBg: "bg-hot/10",
      iconColor: "text-hot",
      message: `${hotNotContacted.length} hot leads have not been contacted yet.`,
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
      message: `${overdueFollowUps.length} follow-ups are overdue and need attention.`,
      priority: overdueFollowUps.length > 0 ? "High" : "Low",
      priorityBg: overdueFollowUps.length > 0 ? "bg-hot/10" : "bg-success/10",
      priorityColor: overdueFollowUps.length > 0 ? "text-hot" : "text-success",
      action: "View Follow Ups",
      href: "/follow-ups" as const,
    },
    {
      icon: CalendarCheck2,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
      message: `${viewingsTomorrow.length} property viewing is scheduled for tomorrow.`,
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
      message: `${formatAED(atRiskValue)} pipeline value may be at risk due to delayed follow-up.`,
      priority: atRiskValue > 0 ? "High" : "Low",
      priorityBg: atRiskValue > 0 ? "bg-hot/10" : "bg-success/10",
      priorityColor: atRiskValue > 0 ? "text-hot" : "text-success",
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

function RecentActivityPanel({ leads }: { leads: Lead[] }) {
  const iconMap = {
    "Lead Added": {
      icon: UserPlus,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    "Follow Up Due": {
      icon: Send,
      bg: "bg-warning/15",
      color: "text-warning",
    },
    "Viewing Scheduled": {
      icon: CalendarCheck2,
      bg: "bg-gold/15",
      color: "text-gold-foreground",
    },
    "Deal Closed": {
      icon: CheckCircle2,
      bg: "bg-success/10",
      color: "text-success",
    },
  } as const;

  const activities = leads
    .flatMap((lead) => {
      const result = [];

      result.push({
        type: "Lead Added",
        date: lead.createdAt,
        detail: `${lead.name} entered the CRM.`,
        agent: lead.agent,
      });

      if (lead.stage === "Viewing Scheduled") {
        result.push({
          type: "Viewing Scheduled",
          date: lead.lastContact,
          detail: `${lead.name} scheduled a property viewing.`,
          agent: lead.agent,
        });
      }

      if (lead.stage === "Closed") {
        result.push({
          type: "Deal Closed",
          date: lead.lastContact,
          detail: `${lead.name}'s deal was successfully closed.`,
          agent: lead.agent,
        });
      }

      if (lead.nextFollowUp) {
        result.push({
          type: "Follow Up Due",
          date: lead.nextFollowUp,
          detail: `Follow-up scheduled for ${lead.name}.`,
          agent: lead.agent,
        });
      }

      return result;
    })
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 6);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Recent Activity
        </h2>
        <p className="text-xs text-muted-foreground">
          Generated from live CRM data
        </p>
      </div>

      <ul className="mt-4 space-y-3">
        {activities.map((a, index) => {
          const { icon: Icon, bg, color } =
            iconMap[a.type as keyof typeof iconMap];

          return (
            <li
              key={index}
              className="flex items-start gap-3 rounded-lg border border-border/60 bg-background p-3"
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bg} ${color}`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">
                    {a.type}
                  </p>

                  <span className="text-xs text-muted-foreground">
                    {new Date(a.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>

                <p className="mt-1 text-xs text-muted-foreground">
                  {a.detail}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Agent: {a.agent}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}


function PipelineValueCards({ leads }: { leads: Lead[] })  {
  const toneMap = {
    primary: { bg: "bg-primary/10", color: "text-primary", icon: Wallet },
    success: { bg: "bg-success/10", color: "text-success", icon: TrendingUp },
    gold: { bg: "bg-gold/15", color: "text-gold-foreground", icon: Coins },
    hot: { bg: "bg-hot/10", color: "text-hot", icon: ShieldAlert },
  } as const;
    const totalPipeline = leads.reduce((sum, lead) => sum + lead.budget, 0);

  const closedThisMonth = leads
    .filter((lead) => lead.stage === "Closed")
    .reduce((sum, lead) => sum + lead.budget, 0);

  const averageDealSize = leads.length > 0 ? totalPipeline / leads.length : 0;

  const atRiskPipeline = leads
    .filter((lead) => lead.status === "Hot" && lead.stage !== "Closed")
    .reduce((sum, lead) => sum + lead.budget, 0);

    const livePipelineValueCards = getPipelineValueCards(leads);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {livePipelineValueCards.map((c) => {
        const t = toneMap[c.tone];
        return (
          <div key={c.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{c.label}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{formatAED(c.value)}</p>
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.bg} ${t.color}`}>
                <t.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{c.hint}</p>
          </div>
        );
      })}
    </div>
  );
}

function AgentPerformancePanel({ leads }: { leads: Lead[] }) {
  const agentStats = Object.values(
    leads.reduce(
      (acc, lead) => {
        if (!acc[lead.agent]) {
          acc[lead.agent] = {
            agent: lead.agent,
            leads: 0,
            viewings: 0,
            deals: 0,
          };
        }

        acc[lead.agent].leads += 1;

        if (lead.stage === "Viewing Scheduled") {
          acc[lead.agent].viewings += 1;
        }

        if (lead.stage === "Closed") {
          acc[lead.agent].deals += 1;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          agent: string;
          leads: number;
          viewings: number;
          deals: number;
        }
      >,
    ),
  );

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">Agent Performance</h2>
          <p className="text-xs text-muted-foreground">
            Leads, viewings, and closed deals from live CRM data
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-5 py-3 font-medium">Agent</th>
              <th className="px-5 py-3 font-medium">Leads</th>
              <th className="px-5 py-3 font-medium">Viewings</th>
              <th className="px-5 py-3 font-medium">Deals</th>
              <th className="px-5 py-3 font-medium">Conversion</th>
            </tr>
          </thead>

          <tbody>
            {agentStats.map((a) => {
              const conv =
                a.leads > 0 ? ((a.deals / a.leads) * 100).toFixed(1) + "%" : "0.0%";

              const initials = a.agent
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("");

              return (
                <tr
                  key={a.agent}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                        {initials}
                      </div>
                      <span className="font-medium text-foreground">{a.agent}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3 text-muted-foreground">{a.leads}</td>
                  <td className="px-5 py-3 text-muted-foreground">{a.viewings}</td>
                  <td className="px-5 py-3 text-muted-foreground">{a.deals}</td>

                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {conv}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function LeadSourcePerformance({ leads }: { leads: Lead[] }) {
  const sourceStats = Object.values(
    leads.reduce(
      (acc, lead) => {
        if (!acc[lead.source]) {
          acc[lead.source] = {
            source: lead.source,
            totalLeads: 0,
            hotLeads: 0,
            closedDeals: 0,
          };
        }

        acc[lead.source].totalLeads++;

        if (lead.status === "Hot") {
          acc[lead.source].hotLeads++;
        }

        if (lead.stage === "Closed") {
          acc[lead.source].closedDeals++;
        }

        return acc;
      },
      {} as Record<
        string,
        {
          source: string;
          totalLeads: number;
          hotLeads: number;
          closedDeals: number;
        }
      >,
    ),
  );

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Lead Source Performance
          </h2>
          <p className="text-xs text-muted-foreground">
            Live performance by lead source
          </p>
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
            {sourceStats.map((s) => {
              const conversion =
                s.totalLeads > 0
                  ? ((s.closedDeals / s.totalLeads) * 100).toFixed(1) + "%"
                  : "0.0%";

              return (
                <tr
                  key={s.source}
                  className="border-b border-border/60 last:border-0 hover:bg-muted/30"
                >
                  <td className="px-5 py-3 font-medium text-foreground">
                    {s.source}
                  </td>

                  <td className="px-5 py-3 text-muted-foreground">
                    {s.totalLeads}
                  </td>

                  <td className="px-5 py-3 text-muted-foreground">
                    {s.hotLeads}
                  </td>

                  <td className="px-5 py-3">
                    <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      {conversion}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Dashboard() {
  const { leads, isLoading, error } = useLeads();
  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading dashboard...</div>;
  }
  
  if (error) {
    return <div className="p-6 text-sm text-red-500">{error}</div>;
  }
  const {
    total,
    hot,
    appointments,
    closed,
    closedRevenue,
    pipelineValue,
  } = getKPIs(leads);
  
  const recent = getRecentLeads(leads);
  const upcoming = getUpcomingFollowUps(leads);

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Live CRM • ${total} active leads • ${formatAED(pipelineValue)} pipeline`}
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
            value={String(appointments)}
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

        <AiRecommendations leads={leads} />

        <PipelineValueCards leads={leads} />



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
          <RecentActivityPanel leads={leads} />
        </div>

        <LeadSourcePerformance leads={leads} />

        <AgentPerformancePanel leads={leads} />

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
