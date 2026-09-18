import { useState } from "react";
import { Wallet, Lock, ArrowDownCircle, PiggyBank, AlertCircle } from "lucide-react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useRecentTransactions } from "@/hooks/useRecentTransactions";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { DashboardTransactionsPreview } from "@/components/dashboard/DashboardTransactionsPreview";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DashboardPage() {
  const [granularity, setGranularity] = useState<"monthly" | "weekly">("monthly");
  const { summary, trend, isLoading, error } = useDashboardData(granularity);
  const { transactions, isLoading: txLoading } = useRecentTransactions(3);

  if (error) {
    return (
      <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm px-4 py-3">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading || !summary ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[76px] rounded-2xl" />
          ))
        ) : (
          <>
            <KpiCard label="Balance" value={summary.balance} icon={Wallet} iconBg="bg-primary" />
            <KpiCard label="Revenue" value={summary.revenue} icon={Lock} iconBg="bg-primary" />
            <KpiCard label="Expenses" value={summary.expenses} icon={ArrowDownCircle} iconBg="bg-primary" />
            <KpiCard label="Savings" value={summary.savings} icon={PiggyBank} iconBg="bg-primary" />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
            <h2 className="font-semibold text-foreground">Overview</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-primary" /> Income
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warning" /> Expenses
                </span>
              </div>
              <Select
                value={granularity}
                onValueChange={(v) => setGranularity(v as "monthly" | "weekly")}
              >
                <SelectTrigger className="w-28 h-8 text-xs bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {isLoading || !trend ? (
            <Skeleton className="h-[280px] rounded-xl" />
          ) : (
            <TrendChart data={trend.data} />
          )}
        </div>

        {txLoading ? (
          <Skeleton className="h-full min-h-[280px] rounded-2xl" />
        ) : (
          <RecentTransactions transactions={transactions} />
        )}
      </div>

      <DashboardTransactionsPreview />
    </div>
  );
}