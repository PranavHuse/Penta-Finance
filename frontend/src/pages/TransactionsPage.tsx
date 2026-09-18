import { AlertCircle } from "lucide-react";
import { useTransactions } from "@/hooks/useTransactions";
import { FilterBar } from "@/components/transactions/FilterBar";
import { TransactionsTable } from "@/components/transactions/TransactionsTable";
import { Pagination } from "@/components/transactions/Pagination";
import { ExportDialog } from "@/components/transactions/ExportDialog";

export default function TransactionsPage() {
  const { data, pagination, filters, updateFilters, isLoading, error } = useTransactions();

  function handleSort(field: string) {
    if (filters.sortBy === field) {
      updateFilters({ sortDir: filters.sortDir === "asc" ? "desc" : "asc" });
    } else {
      updateFilters({ sortBy: field, sortDir: "asc" });
    }
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
        <h1 className="text-lg font-semibold text-foreground">Transactions</h1>
        <ExportDialog activeFilters={filters} />
      </div>

      <div className="mb-5">
        <FilterBar filters={filters} onChange={updateFilters} />
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm px-4 py-3">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          <TransactionsTable
            data={data}
            isLoading={isLoading}
            sortBy={filters.sortBy}
            sortDir={filters.sortDir}
            onSort={handleSort}
          />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            limit={pagination.limit}
            onPageChange={(p) => updateFilters({ page: p })}
          />
        </>
      )}
    </div>
  );
}