import { useEffect, useState } from "react";
import type { Lead } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase";

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const { data, error } = await supabase
          .from("leads")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        const mappedLeads: Lead[] =
          data?.map((item) => ({
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
          })) ?? [];

        setLeads(mappedLeads);
      } catch (err) {
        console.error(err);
        setError("Could not load leads from Supabase");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLeads();
  }, []);

  return {
    leads,
    isLoading,
    error,
  };
}