import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import type { TransactionFilters } from "@/hooks/useTransactions";

interface Props {
  filters: TransactionFilters;
  onChange: (patch: Partial<TransactionFilters>) => void;
}

export function FilterBar({ filters, onChange }: Props) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== filters.search) {
      onChange({ search: debouncedSearch });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const hasActiveFilters =
    filters.category || filters.status || filters.dateFrom || filters.dateTo || filters.amountMin || filters.amountMax;

  function clearAll() {
    setSearchInput("");
    onChange({
      search: "",
      category: "",
      status: "",
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative flex-1 min-w-[200px] max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for anything..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-9 bg-secondary border-border"
        />
      </div>

      <Select
        value={filters.category || "all"}
        onValueChange={(v) => onChange({ category: v === "all" ? "" : v })}
      >
        <SelectTrigger className="w-36 bg-secondary border-border">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          <SelectItem value="Revenue">Revenue</SelectItem>
          <SelectItem value="Expense">Expense</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters.status || "all"}
        onValueChange={(v) => onChange({ status: v === "all" ? "" : v })}
      >
        <SelectTrigger className="w-32 bg-secondary border-border">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="Paid">Paid</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => onChange({ dateFrom: e.target.value })}
        className="w-40 bg-secondary border-border text-muted-foreground"
      />
      <span className="text-muted-foreground text-sm">to</span>
      <Input
        type="date"
        value={filters.dateTo}
        onChange={(e) => onChange({ dateTo: e.target.value })}
        className="w-40 bg-secondary border-border text-muted-foreground"
      />

      <Input
        type="number"
        placeholder="Min $"
        value={filters.amountMin}
        onChange={(e) => onChange({ amountMin: e.target.value })}
        className="w-24 bg-secondary border-border"
      />
      <Input
        type="number"
        placeholder="Max $"
        value={filters.amountMax}
        onChange={(e) => onChange({ amountMax: e.target.value })}
        className="w-24 bg-secondary border-border"
      />

      {(hasActiveFilters || searchInput) && (
        <Button variant="ghost" size="sm" onClick={clearAll} className="text-muted-foreground">
          Clear filters
        </Button>
      )}
    </div>
  );
}