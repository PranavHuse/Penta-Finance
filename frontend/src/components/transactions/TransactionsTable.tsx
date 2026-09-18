import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./StatusBadge";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  data: Transaction[];
  isLoading: boolean;
  sortBy: string;
  sortDir: string;
  onSort: (field: string) => void;
}

const COLUMNS: { key: string; label: string; sortable: boolean }[] = [
  { key: "user", label: "Name", sortable: false },
  { key: "date", label: "Date", sortable: true },
  { key: "amount", label: "Amount", sortable: true },
  { key: "category", label: "Category", sortable: true },
  { key: "status", label: "Status", sortable: true },
];

export function TransactionsTable({ data, isLoading, sortBy, sortDir, onSort }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b border-border">
            {COLUMNS.map((col) => (
              <th key={col.key} className="py-3 px-3 font-medium">
                {col.sortable ? (
                  <button
                    onClick={() => onSort(col.key)}
                    className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                  >
                    {col.label}
                    {sortBy === col.key ? (
                      sortDir === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDown className="h-3.5 w-3.5" />
                      )
                    ) : (
                      <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                    )}
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <tr key={i} className="border-b border-border/50">
                {COLUMNS.map((col) => (
                  <td key={col.key} className="py-3.5 px-3">
                    <Skeleton className="h-5 w-full max-w-[140px]" />
                  </td>
                ))}
              </tr>
            ))}

          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={COLUMNS.length} className="py-10 text-center text-muted-foreground">
                No transactions match your filters.
              </td>
            </tr>
          )}

          {!isLoading &&
            data.map((tx) => {
              const isRevenue = tx.category === "Revenue";
              return (
                <tr
                  key={tx.id}
                  className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={tx.user.avatarUrl} alt={tx.user.name} />
                        <AvatarFallback>{tx.user.name?.[0] ?? "?"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-foreground">{tx.user.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    className={cn(
                      "py-3 px-3 font-medium",
                      isRevenue ? "text-primary" : "text-warning"
                    )}
                  >
                    {isRevenue ? "+" : "-"}${tx.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{tx.category}</td>
                  <td className="py-3 px-3">
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}