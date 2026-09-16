import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";

// GET /api/dashboard/summary
// Returns Balance, Revenue, Expenses, and a simple "Savings" figure —
// all computed server-side from aggregated transaction data.
export async function getSummary(_req: Request, res: Response): Promise<void> {
  const results = await Transaction.aggregate([
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
  ]);

  const revenue = results.find((r) => r._id === "Revenue")?.total || 0;
  const expenses = results.find((r) => r._id === "Expense")?.total || 0;
  const balance = revenue - expenses;
  // Savings: naive placeholder metric (% of revenue not spent) until the
  // brief defines a real "savings" concept — documented as an assumption.
  const savings = revenue > 0 ? Math.max(balance, 0) : 0;

  res.json({
    balance: round2(balance),
    revenue: round2(revenue),
    expenses: round2(expenses),
    savings: round2(savings),
  });
}

// GET /api/dashboard/trend?granularity=monthly|weekly
export async function getTrend(req: Request, res: Response): Promise<void> {
  const granularity = req.query.granularity === "weekly" ? "weekly" : "monthly";

  const dateFormat = granularity === "weekly" ? "%G-W%V" : "%Y-%m";

  const results = await Transaction.aggregate([
    {
      $group: {
        _id: {
          period: { $dateToString: { format: dateFormat, date: "$date" } },
          category: "$category",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.period": 1 } },
  ]);

  // Reshape into [{ period, revenue, expense }]
  const byPeriod = new Map<string, { period: string; revenue: number; expense: number }>();
  for (const row of results) {
    const period = row._id.period as string;
    const entry = byPeriod.get(period) || { period, revenue: 0, expense: 0 };
    if (row._id.category === "Revenue") entry.revenue = round2(row.total);
    else entry.expense = round2(row.total);
    byPeriod.set(period, entry);
  }

  res.json({
    granularity,
    data: Array.from(byPeriod.values()).sort((a, b) => a.period.localeCompare(b.period)),
  });
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}