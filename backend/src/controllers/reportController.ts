import { Request, Response } from "express";
import { z } from "zod";
import { format } from "fast-csv";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { transactionQuerySchema, buildTransactionFilter } from "../utils/transactionQuery";
import { ApiError } from "../utils/ApiError";

const EXPORTABLE_COLUMNS = ["id", "date", "amount", "category", "status", "user"] as const;
type ExportColumn = (typeof EXPORTABLE_COLUMNS)[number];

const exportSchema = z.object({
  columns: z.array(z.enum(EXPORTABLE_COLUMNS)).min(1, "Select at least one column"),
  filters: transactionQuerySchema.partial().default({}),
});

const COLUMN_HEADERS: Record<ExportColumn, string> = {
  id: "Transaction ID",
  date: "Date",
  amount: "Amount",
  category: "Category",
  status: "Status",
  user: "User",
};

// POST /api/reports/export
// Body: { columns: string[], filters: {...} } -> streams a CSV file.
// Reuses buildTransactionFilter so the export always matches whatever the
// table is currently showing (PRD 4.4: "export what I'm looking at").
export async function exportTransactions(req: Request, res: Response): Promise<void> {
  const { columns, filters } = exportSchema.parse(req.body);

  // Re-run the same query parsing used by the list endpoint so an empty
  // filters object still gets sane defaults (page/limit are irrelevant here
  // since export always pulls the full filtered set, per PRD open question #4).
  const q = transactionQuerySchema.parse(filters);

  const users = await User.find({}, { name: 1 });
  const userNameMap = new Map(users.map((u) => [u.name, u._id.toString()]));
  const mongoFilter = buildTransactionFilter(q, userNameMap);

  const cursor = Transaction.find(mongoFilter)
    .populate("userId", "name")
    .sort({ [q.sortBy]: q.sortDir === "asc" ? 1 : -1 })
    .cursor();

  let rowCount = 0;
  // Peek: fast-csv streams as rows arrive, so we can't know "zero rows" until
  // the cursor is empty — check once up front instead, so a no-match export
  // fails cleanly with an alert-chip-friendly error instead of downloading
  // an empty file.
  const hasAny = await Transaction.exists(mongoFilter);
  if (!hasAny) {
    throw ApiError.badRequest("No transactions match the selected filters", "EXPORT_EMPTY_RESULT");
  }

  const filename = `loopr-transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

  const csvStream = format({
    headers: columns.map((c) => COLUMN_HEADERS[c as ExportColumn]),
  });
  csvStream.pipe(res);

  cursor.on("data", (doc: any) => {
    rowCount += 1;
    const row: Record<string, string | number> = {};
    for (const col of columns) {
      switch (col) {
        case "id":
          row.id = doc.legacyId;
          break;
        case "date":
          row.date = doc.date.toISOString().slice(0, 10);
          break;
        case "amount":
          row.amount = doc.amount;
          break;
        case "category":
          row.category = doc.category;
          break;
        case "status":
          row.status = doc.status;
          break;
        case "user":
          row.user = doc.userId?.name || "Unknown";
          break;
      }
    }
    csvStream.write(Object.values(row));
  });

  cursor.on("end", () => {
    csvStream.end();
  });

  cursor.on("error", (err: Error) => {
    // Headers are already sent once streaming starts, so we can't send a
    // clean JSON error at this point — end the stream and log server-side.
    console.error("[export] cursor error:", err);
    csvStream.end();
  });
}