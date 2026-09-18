import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import type { Transaction } from "@/types";

export interface TransactionFilters {
  page: number;
  limit: number;
  search: string;
  category: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
  sortBy: string;
  sortDir: string;
}

const DEFAULTS: TransactionFilters = {
  page: 1,
  limit: 10,
  search: "",
  category: "",
  status: "",
  dateFrom: "",
  dateTo: "",
  amountMin: "",
  amountMax: "",
  sortBy: "date",
  sortDir: "desc",
};

export function useTransactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filters: TransactionFilters = {
    page: Number(searchParams.get("page")) || DEFAULTS.page,
    limit: Number(searchParams.get("limit")) || DEFAULTS.limit,
    search: searchParams.get("search") || DEFAULTS.search,
    category: searchParams.get("category") || DEFAULTS.category,
    status: searchParams.get("status") || DEFAULTS.status,
    dateFrom: searchParams.get("dateFrom") || DEFAULTS.dateFrom,
    dateTo: searchParams.get("dateTo") || DEFAULTS.dateTo,
    amountMin: searchParams.get("amountMin") || DEFAULTS.amountMin,
    amountMax: searchParams.get("amountMax") || DEFAULTS.amountMax,
    sortBy: searchParams.get("sortBy") || DEFAULTS.sortBy,
    sortDir: searchParams.get("sortDir") || DEFAULTS.sortDir,
  };

  const updateFilters = useCallback(
    (patch: Partial<TransactionFilters>) => {
      const next = { ...filters, ...patch };
      // Any filter change other than page itself resets to page 1
      if (!("page" in patch)) next.page = 1;

      const params = new URLSearchParams();
      Object.entries(next).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      });
      setSearchParams(params);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchParams]
  );

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const params: Record<string, string | number> = { page: filters.page, limit: filters.limit };
    if (filters.search) params.search = filters.search;
    if (filters.category) params.category = filters.category;
    if (filters.status) params.status = filters.status;
    if (filters.dateFrom) params.dateFrom = filters.dateFrom;
    if (filters.dateTo) params.dateTo = filters.dateTo;
    if (filters.amountMin) params.amountMin = filters.amountMin;
    if (filters.amountMax) params.amountMax = filters.amountMax;
    params.sortBy = filters.sortBy;
    params.sortDir = filters.sortDir;

    api
      .get("/transactions", { params })
      .then((res) => {
        if (cancelled) return;
        setData(res.data.data);
        setPagination(res.data.pagination);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.error?.message || "Failed to load transactions");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return { data, pagination, filters, updateFilters, isLoading, error };
}