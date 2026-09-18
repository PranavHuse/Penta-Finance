import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Transaction } from "@/types";
import { cn } from "@/lib/utils";

export function RecentTransactions({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-foreground">Recent Transaction</h2>
        <button className="text-sm text-primary hover:underline">See all</button>
      </div>

      <div className="space-y-4">
        {transactions.map((tx) => {
          const isRevenue = tx.category === "Revenue";
          return (
            <div key={tx.id} className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={tx.user.avatarUrl} alt={tx.user.name} />
                <AvatarFallback>{tx.user.name?.[0] ?? "?"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">
                  {isRevenue ? "Transfer from" : "Transfer to"}
                </p>
                <p className="text-sm font-medium text-foreground truncate">{tx.user.name}</p>
              </div>
              <span
                className={cn(
                  "text-sm font-medium shrink-0",
                  isRevenue ? "text-primary" : "text-warning"
                )}
              >
                {isRevenue ? "+" : "-"}${tx.amount.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}