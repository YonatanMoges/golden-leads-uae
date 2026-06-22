import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { leads, formatAED, pipelineStages } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { Search, Filter, Download, Plus, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/leads")({
  head: () => ({
    meta: [
      { title: "Leads — Mirage Realty" },
      { name: "description", content: "Browse and qualify every lead across your UAE portfolio." },
    ],
  }),
  component: LeadsPage,
});

const BUDGET_RANGES = [
  { label: "All", min: 0, max: Infinity },
  { label: "Under AED 2M", min: 0, max: 2_000_000 },
  { label: "AED 2M – 5M", min: 2_000_000, max: 5_000_000 },
  { label: "AED 5M – 10M", min: 5_000_000, max: 10_000_000 },
  { label: "AED 10M+", min: 10_000_000, max: Infinity },
];

function LeadsPage() {
  const navigate = useNavigate({ from: "/leads" });
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [stage, setStage] = useState<string>("All");
  const [agent, setAgent] = useState<string>("All");
  const [propertyType, setPropertyType] = useState<string>("All");
  const [source, setSource] = useState<string>("All");
  const [budgetRange, setBudgetRange] = useState<string>("All");

  const agents = useMemo(() => ["All", ...Array.from(new Set(leads.map((l) => l.agent)))], []);
  const propertyTypes = useMemo(
    () => ["All", ...Array.from(new Set(leads.map((l) => l.propertyType)))],
    [],
  );
  const sources = useMemo(() => ["All", ...Array.from(new Set(leads.map((l) => l.source)))], []);

  const filtered = useMemo(() => {
    const range = BUDGET_RANGES.find((r) => r.label === budgetRange) ?? BUDGET_RANGES[0];
    return leads.filter((l) => {
      if (status !== "All" && l.status !== status) return false;
      if (stage !== "All" && l.stage !== stage) return false;
      if (agent !== "All" && l.agent !== agent) return false;
      if (propertyType !== "All" && l.propertyType !== propertyType) return false;
      if (source !== "All" && l.source !== source) return false;
      if (l.budget < range.min || l.budget > range.max) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.phone.toLowerCase().includes(q) ||
        l.interest.toLowerCase().includes(q) ||
        l.agent.toLowerCase().includes(q)
      );
    });
  }, [query, status, stage, agent, propertyType, source, budgetRange]);

  return (
    <div>
      <PageHeader
        title="Leads"
        description={`${filtered.length} of ${leads.length} leads · filtered view`}
        actions={
          <>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent">
              <Download className="h-4 w-4" /> Export CSV
            </button>
            <button className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Add Lead
            </button>
          </>
        }
      />

      <div className="p-6">
        <div className="mb-4">
          <Link
            to="/lead-details/$leadId"
            params={{ leadId: leads[0].id }}
            className="inline-flex h-9 items-center rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-accent"
          >
            Open Sample Lead Details
          </Link>
        </div>

        <div className="mb-4 space-y-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leads by name, phone, email, or property interest"
              className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 rounded-md border border-input bg-card px-2.5 text-sm"
              aria-label="Status"
            >
              {["All", "Hot", "Warm", "Cold"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="h-9 rounded-md border border-input bg-card px-2.5 text-sm"
              aria-label="Stage"
            >
              <option>All</option>
              {pipelineStages.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="h-9 rounded-md border border-input bg-card px-2.5 text-sm"
              aria-label="Assigned Agent"
            >
              {agents.map((a) => (
                <option key={a}>{a === "All" ? "All Agents" : a}</option>
              ))}
            </select>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="h-9 rounded-md border border-input bg-card px-2.5 text-sm"
              aria-label="Property Type"
            >
              {propertyTypes.map((p) => (
                <option key={p}>{p === "All" ? "All Property Types" : p}</option>
              ))}
            </select>
            <select
              value={budgetRange}
              onChange={(e) => setBudgetRange(e.target.value)}
              className="h-9 rounded-md border border-input bg-card px-2.5 text-sm"
              aria-label="Budget Range"
            >
              {BUDGET_RANGES.map((r) => (
                <option key={r.label}>{r.label === "All" ? "All Budgets" : r.label}</option>
              ))}
            </select>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="h-9 rounded-md border border-input bg-card px-2.5 text-sm"
              aria-label="Lead Source"
            >
              {sources.map((s) => (
                <option key={s}>{s === "All" ? "All Sources" : s}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Lead</th>
                  <th className="px-5 py-3 font-medium">Contact</th>
                  <th className="px-5 py-3 font-medium">Interest</th>
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Budget</th>
                  <th className="px-5 py-3 font-medium">Stage</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Agent</th>
                  <th className="px-5 py-3 font-medium">Source</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => navigate({ to: "/lead-details/$leadId", params: { leadId: l.id } })}
                    className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-5 py-3">
                      <Link
                        to="/lead-details/$leadId"
                        params={{ leadId: l.id }}
                        onClick={(e) => e.stopPropagation()}
                        className="font-medium text-foreground hover:text-primary hover:underline"
                      >
                        {l.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{l.id} · {l.nationality}</div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" />{l.email}</span>
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" /> {l.phone}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">{l.interest}</td>
                    <td className="px-5 py-3 text-muted-foreground">{l.propertyType}</td>
                    <td className="px-5 py-3 font-medium text-foreground">{formatAED(l.budget)}</td>
                    <td className="px-5 py-3 text-muted-foreground">{l.stage}</td>
                    <td className="px-5 py-3"><StatusBadge status={l.status} /></td>
                    <td className="px-5 py-3 text-muted-foreground">{l.agent}</td>
                    <td className="px-5 py-3 text-muted-foreground">{l.source}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-5 py-12 text-center text-sm text-muted-foreground">
                      No leads match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
