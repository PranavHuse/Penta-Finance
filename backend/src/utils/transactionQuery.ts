import { QueryFilter  } from "mongoose";
import { z } from "zod";
import { ITransaction } from "../models/Transaction";

export const transactionQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  category: z.enum(["Revenue", "Expense"]).optional(),
  status: z.enum(["Paid", "Pending"]).optional(),
  userId: z.string().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  amountMin: z.coerce.number().optional(),
  amountMax: z.coerce.number().optional(),
  sortBy: z.enum(["date", "amount", "category", "status"]).default("date"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

export function buildTransactionFilter(
  q: TransactionQuery,
  userNameToId: Map<string, string> = new Map()
): QueryFilter <ITransaction> {
  const filter: QueryFilter <ITransaction> = {};

  if (q.category) filter.category = q.category;
  if (q.status) filter.status = q.status;
  if (q.userId) filter.userId = q.userId;

  if (q.dateFrom || q.dateTo) {
    filter.date = {};

    if (q.dateFrom) filter.date.$gte = q.dateFrom;
    if (q.dateTo) filter.date.$lte = q.dateTo;
  }

  if (q.amountMin !== undefined || q.amountMax !== undefined) {
    filter.amount = {};

    if (q.amountMin !== undefined) filter.amount.$gte = q.amountMin;
    if (q.amountMax !== undefined) filter.amount.$lte = q.amountMax;
  }

  if (q.search) {
    const term = q.search.trim();

    const matchedUserIds = [...userNameToId.entries()]
      .filter(([name]) =>
        name.toLowerCase().includes(term.toLowerCase())
      )
      .map(([, id]) => id);

    const numericAmount = Number(term);

    const orClauses: QueryFilter <ITransaction>[] = [
      { category: { $regex: term, $options: "i" } },
      { status: { $regex: term, $options: "i" } },
    ];

    if (matchedUserIds.length > 0) {
      orClauses.push({
        userId: { $in: matchedUserIds },
      });
    }

    if (!Number.isNaN(numericAmount)) {
      orClauses.push({
        amount: numericAmount,
      });
    }

    filter.$or = orClauses;
  }

  return filter;
}