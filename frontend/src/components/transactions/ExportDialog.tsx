import { useState } from "react";
import { Download, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { api } from "@/lib/api";
import type { TransactionFilters } from "@/hooks/useTransactions";

const COLUMN_OPTIONS: { key: string; label: string }[] = [
  { key: "id", label: "Transaction ID" },
  { key: "date", label: "Date" },
  { key: "amount", label: "Amount" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "user", label: "User" },
];

export function ExportDialog({ activeFilters }: { activeFilters: TransactionFilters }) {
  const [open, setOpen] = useState(false);
  const [columns, setColumns] = useState<string[]>(COLUMN_OPTIONS.map((c) => c.key));
  const [scope, setScope] = useState<"filtered" | "all">("filtered");
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleColumn(key: string) {
    setColumns((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    );
  }

  async function handleExport() {
    setError(null);
    if (columns.length === 0) {
      setError("Select at least one column.");
      return;
    }

    setIsExporting(true);
    try {
      const filters =
        scope === "filtered"
          ? {
              search: activeFilters.search || undefined,
              category: activeFilters.category || undefined,
              status: activeFilters.status || undefined,
              dateFrom: activeFilters.dateFrom || undefined,
              dateTo: activeFilters.dateTo || undefined,
              amountMin: activeFilters.amountMin || undefined,
              amountMax: activeFilters.amountMax || undefined,
              sortBy: activeFilters.sortBy,
              sortDir: activeFilters.sortDir,
            }
          : {};

      const res = await api.post(
        "/reports/export",
        { columns, filters },
        { responseType: "blob" }
      );

      // Trigger a real browser download from the blob response.
      const blob = new Blob([res.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `loopr-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setOpen(false);
    } catch (err: any) {
      // err.response.data is a Blob here (since responseType: "blob"), so the
      // JSON error body needs to be read out of it manually.
      if (err?.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          setError(parsed?.error?.message || "Export failed.");
        } catch {
          setError("Export failed.");
        }
      } else {
        setError(err?.response?.data?.error?.message || "Export failed.");
      }
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90 gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export transactions</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Columns</p>
            <div className="grid grid-cols-2 gap-3">
              {COLUMN_OPTIONS.map((col) => (
                <div key={col.key} className="flex items-center gap-2">
                  <Checkbox
                    id={`col-${col.key}`}
                    checked={columns.includes(col.key)}
                    onCheckedChange={() => toggleColumn(col.key)}
                  />
                  <Label htmlFor={`col-${col.key}`} className="text-sm font-normal cursor-pointer">
                    {col.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Rows to export</p>
            <RadioGroup value={scope} onValueChange={(v) => setScope(v as "filtered" | "all")}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="filtered" id="scope-filtered" />
                <Label htmlFor="scope-filtered" className="text-sm font-normal cursor-pointer">
                  Current filtered view
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="all" id="scope-all" />
                <Label htmlFor="scope-all" className="text-sm font-normal cursor-pointer">
                  Full dataset
                </Label>
              </div>
            </RadioGroup>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isExporting ? "Generating..." : "Download CSV"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}