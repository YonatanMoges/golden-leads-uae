import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { leads, formatAED, pipelineStages, type PipelineStage } from "@/lib/mock-data";

export const Route = createFileRoute("/pipeline")({
  head: () => ({
    meta: [
      { title: "Pipeline — Mirage Realty" },
      { name: "description", content: "Visualize every deal in your sales pipeline by stage." },
    ],
  }),
  component: PipelinePage,
});

const stageAccent: Record<PipelineStage, string> = {
  "New Lead": "border-t-chart-1",
  "Contacted": "border-t-chart-5",
  "Viewing Scheduled": "border-t-gold",
  "Offer Made": "border-t-hot",
  "Closed": "border-t-success",
};

function PipelinePage() {
  const totalValue = leads.reduce((a, b) => a + b.budget, 0);

  return (
    <div>
      <PageHeader
        title="Pipeline"
        description={`${leads.length} active opportunities · ${formatAED(totalValue)} weighted value`}
      />
      <div className="overflow-x-auto p-6">
        <div className="grid min-w-[1100px] grid-cols-5 gap-4">
          {pipelineStages.map((stage) => {
            const items = leads.filter((l) => l.stage === stage);
            const value = items.reduce((a, b) => a + b.budget, 0);
            return (
              <div
                key={stage}
                className={`flex flex-col rounded-xl border border-border border-t-4 ${stageAccent[stage]} bg-card shadow-sm`}
              >
                <div className="border-b border-border px-4 py-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">{stage}</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {items.length}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{formatAED(value)}</p>
                </div>
                <div className="flex-1 space-y-3 p-3">
                  {items.map((l) => (
                    <div
                      key={l.id}
                      className="rounded-lg border border-border bg-background p-3 transition hover:border-primary/40 hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{l.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{l.interest}</p>
                        </div>
                        <StatusBadge status={l.status} />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs">
                        <span className="font-semibold text-foreground">{formatAED(l.budget)}</span>
                        <span className="text-muted-foreground">{l.propertyType}</span>
                      </div>
                      <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-2 text-xs text-muted-foreground">
                        <span className="truncate">{l.agent}</span>
                        <span>{l.nationality}</span>
                      </div>
                    </div>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-lg border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      No deals here yet
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
