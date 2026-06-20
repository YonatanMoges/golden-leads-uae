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

function LeadsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<string>("All");
  const [stage, setStage] = useState<string>("All");

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (status !== "All" && l.status !== status) return false;
      if (stage !== "All" && l.stage !== stage) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.interest.toLowerCase().includes(q) ||
        l.agent.toLowerCase().includes(q)
      );
    });
  }, [query, status, stage]);

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
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, location, agent…"
              className="h-10 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-md border border-input bg-card px-3 text-sm"
            >
              {["All", "Hot", "Warm", "Cold"].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="h-10 rounded-md border border-input bg-card px-3 text-sm"
            >
              <option>All</option>
              {pipelineStages.map((s) => (
                <option key={s}>{s}</option>
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
                  <tr key={l.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3">
                      <div className="font-medium text-foreground">{l.name}</div>
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
