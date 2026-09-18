import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { transactionQuerySchema, buildTransactionFilter } from "../utils/transactionQuery";

async function getUserNameMap(): Promise<Map<string, string>> {
  const users = await User.find({}, { name: 1 });
  const map = new Map<string, string>();
  for (const u of users) map.set(u.name, u._id.toString());
  return map;
}

// GET /api/transactions
export async function listTransactions(req: Request, res: Response): Promise<void> {
  const q = transactionQuerySchema.parse(req.query);
  const userNameMap = await getUserNameMap();
  const filter = buildTransactionFilter(q, userNameMap);

  const sortField = q.sortBy;
  const sortOrder = q.sortDir === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    Transaction.find(filter)
      .populate("userId", "name avatarUrl")
      .sort({ [sortField]: sortOrder })
      .skip((q.page - 1) * q.limit)
      .limit(q.limit),
    Transaction.countDocuments(filter),
  ]);

  res.json({
    data: items.map(serializeTransaction),
    pagination: {
      page: q.page,
      limit: q.limit,
      total,
      totalPages: Math.ceil(total / q.limit) || 1,
    },
  });
}

// GET /api/transactions/:id
export async function getTransactionById(req: Request, res: Response): Promise<void> {
  const tx = await Transaction.findById(req.params.id).populate("userId", "name avatarUrl");
  if (!tx) {
    res.status(404).json({ error: { code: "NOT_FOUND", message: "Transaction not found" } });
    return;
  }
  res.json(serializeTransaction(tx));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeTransaction(tx: any) {
  return {
    id: tx._id.toString(),
    legacyId: tx.legacyId,
    date: tx.date,
    amount: tx.amount,
    category: tx.category,
    status: tx.status,
    user: tx.userId && typeof tx.userId === "object"
      ? { id: tx.userId._id.toString(), name: tx.userId.name, avatarUrl: tx.userId.avatarUrl }
      : { id: tx.userId },
  };
}