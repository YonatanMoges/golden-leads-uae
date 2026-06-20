import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { leads, formatAED, pipelineStages, type PipelineStage } from "@/lib/mock-data";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageCircle,
  CalendarPlus,
  RefreshCw,
  MapPin,
  Building2,
  Wallet,
  UserCircle2,
  Globe2,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/leads_/$leadId")({
  head: ({ params }) => ({
    meta: [
      { title: `Lead ${params.leadId} — Mirage Realty` },
      { name: "description", content: "Lead profile, activity timeline and quick actions." },
    ],
  }),
  component: LeadDetailsPage,
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">
      Lead not found.{" "}
      <Link to="/leads" className="text-primary underline">
        Back to Leads
      </Link>
    </div>
  ),
});

function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-AE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function LeadDetailsPage() {
  const { leadId } = Route.useParams();
  const baseLead = useMemo(() => leads.find((l) => l.id === leadId), [leadId]);
  if (!baseLead) throw notFound();

  const [stage, setStage] = useState<PipelineStage>(baseLead.stage);
  const [notes, setNotes] = useState(
    baseLead.notes ??
      "Client prefers high-floor units with sea or skyline views. Interested in post-handover payment plans.",
  );

  const stageIndex = pipelineStages.indexOf(stage);

  const timeline = [
    {
      key: "New Lead",
      label: "Lead Created",
      date: baseLead.createdAt,
      detail: `Inbound via ${baseLead.source}`,
    },
    {
      key: "Contacted",
      label: "Contact Attempted",
      date: baseLead.lastContact,
      detail: `${baseLead.agent} called and shared brochure on WhatsApp`,
    },
    {
      key: "Viewing Scheduled",
      label: "Viewing Scheduled",
      date: baseLead.nextFollowUp ?? baseLead.lastContact,
      detail: `On-site viewing booked at ${baseLead.interest.split("·")[0].trim()}`,
    },
    {
      key: "Offer Made",
      label: "Offer Submitted",
      date: baseLead.nextFollowUp ?? baseLead.lastContact,
      detail: `Offer of ${formatAED(Math.round(baseLead.budget * 0.95))} submitted to seller`,
    },
    {
      key: "Closed",
      label: "Deal Closed",
      date: baseLead.lastContact,
      detail: `SPA signed and 10% deposit received`,
    },
  ];

  const phoneDigits = baseLead.phone.replace(/\D/g, "");

  const advanceStage = () => {
    const next = pipelineStages[Math.min(stageIndex + 1, pipelineStages.length - 1)];
    setStage(next);
    toast.success(`Status updated to "${next}"`);
  };

  return (
    <div>
      <PageHeader
        title={baseLead.name}
        description={`${baseLead.id} · ${baseLead.nationality} · ${baseLead.propertyType}`}
        actions={
          <Link
            to="/leads"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Leads
          </Link>
        }
      />

      <div className="p-6">
        {/* Action bar */}
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <a
            href={`tel:${phoneDigits}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Phone className="h-4 w-4" /> Call Lead
          </a>
          <a
            href={`https://wa.me/${phoneDigits}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-accent"
          >
            <MessageCircle className="h-4 w-4" /> Send WhatsApp
          </a>
          <a
            href={`mailto:${baseLead.email}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-accent"
          >
            <Mail className="h-4 w-4" /> Send Email
          </a>
          <button
            onClick={() => toast.success("Follow-up scheduled for next week")}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-accent"
          >
            <CalendarPlus className="h-4 w-4" /> Schedule Follow Up
          </button>
          <button
            onClick={advanceStage}
            className="inline-flex h-9 items-center gap-1.5 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-accent"
          >
            <RefreshCw className="h-4 w-4" /> Update Status
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Profile */}
          <div className="space-y-6 lg:col-span-2">
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary ring-1 ring-inset ring-primary/20">
                    {baseLead.name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-foreground">{baseLead.name}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <StatusBadge status={baseLead.status} />
                      <span className="text-xs text-muted-foreground">Stage: {stage}</span>
                    </div>
                  </div>
                </div>
              </div>

              <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
                <Field icon={<Phone className="h-4 w-4" />} label="Phone Number" value={baseLead.phone} />
                <Field icon={<Mail className="h-4 w-4" />} label="Email Address" value={baseLead.email} />
                <Field
                  icon={<MapPin className="h-4 w-4" />}
                  label="Property Interest"
                  value={baseLead.interest}
                />
                <Field
                  icon={<Building2 className="h-4 w-4" />}
                  label="Property Type"
                  value={baseLead.propertyType}
                />
                <Field
                  icon={<Wallet className="h-4 w-4" />}
                  label="Budget"
                  value={formatAED(baseLead.budget)}
                />
                <Field icon={<Globe2 className="h-4 w-4" />} label="Lead Source" value={baseLead.source} />
                <Field
                  icon={<UserCircle2 className="h-4 w-4" />}
                  label="Assigned Agent"
                  value={baseLead.agent}
                />
                <Field
                  icon={<Clock className="h-4 w-4" />}
                  label="Current Status"
                  value={`${baseLead.status} · ${stage}`}
                />
                <Field
                  icon={<Clock className="h-4 w-4" />}
                  label="Last Contacted"
                  value={formatDate(baseLead.lastContact)}
                />
                <Field
                  icon={<CalendarPlus className="h-4 w-4" />}
                  label="Next Follow Up"
                  value={formatDate(baseLead.nextFollowUp)}
                />
              </dl>
            </section>

            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-foreground">Notes</h2>
                <button
                  onClick={() => toast.success("Notes saved")}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Save
                </button>
              </div>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                className="mt-3 w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/40"
              />
            </section>
          </div>

          {/* Timeline & status update */}
          <div className="space-y-6">
            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Update Status</h2>
              <div className="mt-3 space-y-2">
                {pipelineStages.map((s, i) => {
                  const active = s === stage;
                  return (
                    <button
                      key={s}
                      onClick={() => {
                        setStage(s);
                        toast.success(`Status updated to "${s}"`);
                      }}
                      className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition ${
                        active
                          ? "border-primary/40 bg-primary/10 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:bg-accent"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold ${
                            i <= stageIndex
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </span>
                        {s}
                      </span>
                      {active && <span className="text-xs text-primary">Current</span>}
                    </button>
                  );
                })}
              </div>
            </section>

            <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-sm font-semibold text-foreground">Activity Timeline</h2>
              <ol className="mt-4 space-y-5">
                {timeline.map((item, i) => {
                  const done = i <= stageIndex;
                  const current = i === stageIndex;
                  return (
                    <li key={item.key} className="relative pl-7">
                      {i !== timeline.length - 1 && (
                        <span
                          className={`absolute left-[10px] top-5 h-full w-px ${
                            done ? "bg-primary/40" : "bg-border"
                          }`}
                        />
                      )}
                      <span className="absolute left-0 top-0.5">
                        {done ? (
                          <CheckCircle2
                            className={`h-5 w-5 ${current ? "text-primary" : "text-primary/70"}`}
                          />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground/50" />
                        )}
                      </span>
                      <div className="text-sm font-medium text-foreground">{item.label}</div>
                      <div className="text-xs text-muted-foreground">{formatDate(item.date)}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{item.detail}</div>
                    </li>
                  );
                })}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  );
}
