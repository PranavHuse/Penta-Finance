import { Schema, model, Document, Types } from "mongoose";

export type TransactionCategory = "Revenue" | "Expense";
export type TransactionStatus = "Paid" | "Pending";

export interface ITransaction extends Document {
  _id: Types.ObjectId;
  legacyId: number; // original numeric id from transactions.json
  date: Date;
  amount: number;
  category: TransactionCategory;
  status: TransactionStatus;
  userId: Types.ObjectId;
  userProfile: string;
}

const transactionSchema = new Schema<ITransaction>({
  legacyId: { type: Number, required: true, unique: true, index: true },
  date: { type: Date, required: true, index: true },
  amount: { type: Number, required: true, index: true },
  category: {
    type: String,
    enum: ["Revenue", "Expense"],
    required: true,
    index: true,
  },
  status: {
    type: String,
    enum: ["Paid", "Pending"],
    required: true,
    index: true,
  },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  userProfile: { type: String, default: "" },
});

// Supports common filter/sort combinations (date range + category/status, sort by amount)
transactionSchema.index({ date: -1, category: 1, status: 1 });

export const Transaction = model<ITransaction>("Transaction", transactionSchema);