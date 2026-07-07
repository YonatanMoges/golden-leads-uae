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