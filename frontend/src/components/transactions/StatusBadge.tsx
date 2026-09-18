import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: "Paid" | "Pending" }) {
  const isPaid = status === "Paid";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        isPaid ? "bg-primary/15 text-primary" : "bg-warning/15 text-warning"
      )}
    >
      {status}
    </span>
  );
}