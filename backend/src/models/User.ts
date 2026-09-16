import { Schema, model, Document, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  legacyUserId: string; // maps to user_001..user_004 from the sample dataset
  name: string;
  email: string;
  passwordHash: string;
  avatarUrl: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  legacyUserId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
  },
  passwordHash: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

export const User = model<IUser>("User", userSchema);