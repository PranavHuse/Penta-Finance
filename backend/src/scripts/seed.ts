import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../config/db";
import { User } from "../models/User";
import { Transaction, TransactionCategory, TransactionStatus } from "../models/Transaction";
import rawTransactions from "../data/transactions.json";

interface RawTransaction {
  id: number;
  date: string;
  amount: number;
  category: TransactionCategory;
  status: TransactionStatus;
  user_id: string;
  user_profile: string;
}

// The sample data only has user_001..user_004 with no names — synthesize
// display identities matching the reference "Penta" dashboard's people-based UI.
const DEMO_USERS: Record<string, { name: string; email: string }> = {
  user_001: { name: "Matheus Ferrero", email: "matheus@loopr.io" },
  user_002: { name: "Floyd Miles", email: "floyd@loopr.io" },
  user_003: { name: "Jerome Bell", email: "jerome@loopr.io" },
  user_004: { name: "Courtney Henry", email: "courtney@loopr.io" },
};

const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || "loopr1234";

async function seed(): Promise<void> {
  await connectDB();

  console.log("[seed] hashing demo password...");
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  console.log("[seed] upserting users...");
  const userIdMap = new Map<string, mongoose.Types.ObjectId>();

  for (const [legacyUserId, identity] of Object.entries(DEMO_USERS)) {
    const sample = (rawTransactions as RawTransaction[]).find((t) => t.user_id === legacyUserId);
    const user = await User.findOneAndUpdate(
      { legacyUserId },
      {
        legacyUserId,
        name: identity.name,
        email: identity.email,
        passwordHash,
        avatarUrl: sample?.user_profile || "",
      },
      { upsert: true, new: true }
    );
    userIdMap.set(legacyUserId, user._id);
  }

  console.log(`[seed] upserting ${(rawTransactions as RawTransaction[]).length} transactions...`);
  let count = 0;
  for (const t of rawTransactions as RawTransaction[]) {
    const userId = userIdMap.get(t.user_id);
    if (!userId) {
      console.warn(`[seed] skipping transaction ${t.id} — unknown user_id ${t.user_id}`);
      continue;
    }
    await Transaction.findOneAndUpdate(
      { legacyId: t.id },
      {
        legacyId: t.id,
        date: new Date(t.date),
        amount: t.amount,
        category: t.category,
        status: t.status,
        userId,
        userProfile: t.user_profile,
      },
      { upsert: true, new: true }
    );
    count += 1;
  }

  console.log(`[seed] done. ${count} transactions, ${userIdMap.size} users.`);
  console.log("[seed] demo login credentials (same password for all):");
  for (const identity of Object.values(DEMO_USERS)) {
    console.log(`  - ${identity.email} / ${DEMO_PASSWORD}`);
  }

 // await disconnectDB();
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] failed:", err);
  process.exit(1);
});