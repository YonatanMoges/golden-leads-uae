import type { Lead } from "@/lib/mock-data";

export function getKPIs(leads: Lead[]) {
  const total = leads.length;

  const hot = leads.filter((l) => l.status === "Hot").length;

  const appointments = leads.filter(
    (l) => l.stage === "Viewing Scheduled",
  ).length;

  const closed = leads.filter(
    (l) => l.stage === "Closed",
  ).length;

  const closedRevenue = leads
    .filter((l) => l.stage === "Closed")
    .reduce((sum, l) => sum + l.budget, 0);

  const pipelineValue = leads.reduce(
    (sum, l) => sum + l.budget,
    0,
  );

  return {
    total,
    hot,
    appointments,
    closed,
    closedRevenue,
    pipelineValue,
  };
}

export function getRecentLeads(leads: Lead[]) {
  return [...leads]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 6);
}

export function getUpcomingFollowUps(leads: Lead[]) {
  return leads
    .filter((l) => l.nextFollowUp)
    .sort((a, b) =>
      (a.nextFollowUp || "").localeCompare(
        b.nextFollowUp || "",
      ),
    )
    .slice(0, 5);
}

export function getPipelineValueCards(leads: Lead[]) {
    const totalPipeline = leads.reduce((sum, lead) => sum + lead.budget, 0);
  
    const closedThisMonth = leads
      .filter((lead) => lead.stage === "Closed")
      .reduce((sum, lead) => sum + lead.budget, 0);
  
    const averageDealSize = leads.length > 0 ? totalPipeline / leads.length : 0;
  
    const atRiskPipeline = leads
      .filter((lead) => lead.status === "Hot" && lead.stage !== "Closed")
      .reduce((sum, lead) => sum + lead.budget, 0);
  
    return [
      {
        label: "Total Pipeline",
        value: totalPipeline,
        hint: "Total value of all active leads",
        tone: "primary" as const,
      },
      {
        label: "Closed This Month",
        value: closedThisMonth,
        hint: "Closed deal value from live CRM data",
        tone: "success" as const,
      },
      {
        label: "Average Deal Size",
        value: averageDealSize,
        hint: "Average budget per lead",
        tone: "gold" as const,
      },
      {
        label: "At-Risk Pipeline",
        value: atRiskPipeline,
        hint: "Hot leads not yet closed",
        tone: "hot" as const,
      },
    ];
  }