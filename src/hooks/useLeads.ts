import { useEffect, useState } from "react";
import type { Lead } from "@/lib/mock-data";

const LEADS_WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const response = await fetch(LEADS_WEBHOOK_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch leads");
        }

        const data = await response.json();

        const mappedLeads: Lead[] = data.map((item: any) => ({
          id: item.lead_id,
          name: item.name,
          email: item.email,
          phone: String(item.phone),
          nationality: "UAE",
          budget: Number(item.budget),
          interest: item.property_interest,
          propertyType: item.property_type || "Apartment",
          status:
            item.temperature === "hot"
              ? "Hot"
              : item.temperature === "warm"
                ? "Warm"
                : "Cold",
          stage: item.pipeline_stage || "New Lead",
          agent: item.assigned_agent,
          source: item.source,
          createdAt: item.created_at,
          lastContact: item.last_contacted_at,
          nextFollowUp: item.next_follow_up_at,
          notes: item.notes,
        }));

        setLeads(mappedLeads);
      } catch (err) {
        console.error("Lead fetch error:", err);
        setError("Could not load leads from n8n");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  return { leads, isLoading, error };
}