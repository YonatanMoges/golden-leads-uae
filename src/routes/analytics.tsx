import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  monthlyPerformance,
  leadSources,
  agentPerformance,
  leads,
  formatAED,
  pipelineStages,
} from "@/lib/mock-data";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Mirage Realty" },
      { name: "description", content: "Performance insights across leads, sources, agents, and revenue." },
    ],
  }),
  component: AnalyticsPage,
});

const PIE_COLORS = ["var(--chart-1)", "var(--gold)", "var(--chart-3)", "var(--chart-5)", "var(--chart-4)"];

function AnalyticsPage() {
  const totalRevenue = leads.filter((l) => l.stage === "Closed").reduce((a, b) => a + b.budget, 0);
  const conv = ((leads.filter((l) => l.stage === "Closed").length / leads.length) * 100).toFixed(1);
  const avgDeal = totalRevenue / Math.max(1, leads.filter((l) => l.stage === "Closed").length);

  const stageFunnel = pipelineStages.map((s) => ({
    stage: s,
    count: leads.filter((l) => l.stage === s).length,
  }));

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Performance across your portfolio · last 6 months"
      />
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Closed Revenue</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{formatAED(totalRevenue)}</p>
            <p className="mt-1 text-xs text-success">+18.2% vs previous period</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Avg. Deal Size</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{formatAED(avgDeal)}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across closed deals</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Conversion Rate</p>
            <p className="mt-2 text-3xl font-semibold text-foreground">{conv}%</p>
            <p className="mt-1 text-xs text-muted-foreground">Lead → Closed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Revenue trend</h2>
            <p className="text-xs text-muted-foreground">In AED millions</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyPerformance} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
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
                  <Line type="monotone" dataKey="revenue" stroke="var(--gold)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--gold)" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Lead sources</h2>
            <p className="text-xs text-muted-foreground">Distribution by channel</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={leadSources}
                    dataKey="value"
                    nameKey="source"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={2}
                  >
                    {leadSources.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="var(--card)" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "var(--popover)",
                      border: "1px solid var(--border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Pipeline funnel</h2>
            <p className="text-xs text-muted-foreground">Leads currently in each stage</p>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stageFunnel} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="stage" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
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

          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-base font-semibold text-foreground">Agent leaderboard</h2>
            <p className="text-xs text-muted-foreground">Closed deals · last 6 months</p>
            <ul className="mt-4 space-y-3">
              {agentPerformance.map((a, i) => {
                const max = Math.max(...agentPerformance.map((x) => x.revenue));
                const pct = (a.revenue / max) * 100;
                return (
                  <li key={a.agent}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                          {i + 1}
                        </span>
                        <span className="font-medium text-foreground">{a.agent}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {a.deals} deals · AED {a.revenue}M
                      </span>
                    </div>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-gold"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
