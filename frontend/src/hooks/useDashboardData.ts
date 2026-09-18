import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { DashboardSummary, DashboardTrend } from "@/types";

export function useDashboardData(granularity: "monthly" | "weekly" = "monthly") {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trend, setTrend] = useState<DashboardTrend | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [summaryRes, trendRes] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/trend", { params: { granularity } }),
        ]);
        if (!cancelled) {
          setSummary(summaryRes.data);
          setTrend(trendRes.data);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err?.response?.data?.error?.message || "Failed to load dashboard data");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [granularity]);

  return { summary, trend, isLoading, error };
}