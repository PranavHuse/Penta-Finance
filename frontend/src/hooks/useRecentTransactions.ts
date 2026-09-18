import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Transaction } from "@/types";

export function useRecentTransactions(limit = 3) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get("/transactions", { params: { page: 1, limit, sortBy: "date", sortDir: "desc" } })
      .then((res) => {
        if (!cancelled) setTransactions(res.data.data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [limit]);

  return { transactions, isLoading };
}