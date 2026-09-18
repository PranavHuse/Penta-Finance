import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/transactions/StatusBadge";
import { useDebounce } from "@/hooks/useDebounce";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";

export function DashboardTransactionsPreview() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);
  const [data, setData] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    api
      .get("/transactions", {
        params: {
          page: 1,
          limit: 5,
          sortBy: "date",
          sortDir: "desc",
          ...(debouncedSearch ? { search: debouncedSearch } : {}),
        },
      })
      .then((res) => {
        if (!cancelled) setData(res.data.data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <h2 className="text-lg font-semibold text-foreground">Transactions</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search for anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-56 bg-secondary border-border"
            />
          </div>
          <button
            onClick={() => navigate("/transactions")}
            className="text-sm text-primary hover:underline whitespace-nowrap"
          >
            View all
          </button>
        </div>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground border-b border-border">
            <th className="py-2 px-3 font-medium">Name</th>
            <th className="py-2 px-3 font-medium">Date</th>
            <th className="py-2 px-3 font-medium">Amount</th>
            <th className="py-2 px-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-3.5 px-3" colSpan={4}>
                  <Skeleton className="h-5 w-full max-w-sm" />
                </td>
              </tr>
            ))}

          {!isLoading && data.length === 0 && (
            <tr>
              <td colSpan={4} className="py-8 text-center text-muted-foreground">
                No transactions found.
              </td>
            </tr>
          )}

          {!isLoading &&
            data.map((tx) => {
              const isRevenue = tx.category === "Revenue";
              return (
                <tr key={tx.id} className="border-b border-border/50 last:border-0">
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